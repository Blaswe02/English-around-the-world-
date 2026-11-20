"""Prepare the curated destination photographs for repository import.
Source URLs and attribution live in public/data/destination-photo-sources.json.
"""
import base64, io, json, sys, time, urllib.request
from pathlib import Path
from PIL import Image, ImageOps
year = int(sys.argv[1])
photos = json.loads(Path('public/data/destination-photo-sources.json').read_text())
for photo in [p for p in photos if p['year'] == year]:
    for attempt in range(3):
        try:
            request = urllib.request.Request(photo['downloadUrl'], headers={'User-Agent': 'EnglishAroundTheWorld/1.0 (educational classroom website)'})
            with urllib.request.urlopen(request, timeout=45) as response:
                data = response.read()
            image = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
            image = ImageOps.fit(image, (960, 600), method=Image.Resampling.LANCZOS, centering=tuple(photo['crop']))
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=79, optimize=True, progressive=True)
            content = output.getvalue()
            assert len(content) > 5000
            print('PHOTO_ASSET:' + json.dumps({'id': photo['id'], 'width': image.width, 'height': image.height, 'bytes': len(content), 'base64': base64.b64encode(content).decode()}, separators=(',', ':')), flush=True)
            break
        except Exception:
            if attempt == 2: raise
            time.sleep(5 * (attempt + 1))
