"""Fetch the reviewed Commons photos and emit optimized JPEGs for repository import."""
import base64, hashlib, io, json, sys, time, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

year = int(sys.argv[1])
photos = json.loads(Path('public/data/destination-photo-sources.json').read_text())
for photo in [p for p in photos if p['year'] == year]:
    filename = photo['file'].replace(' ', '_')
    digest = hashlib.md5(filename.encode()).hexdigest()
    url = 'https://upload.wikimedia.org/wikipedia/commons/' + digest[0] + '/' + digest[:2] + '/' + urllib.parse.quote(filename)
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'EnglishAroundTheWorld/1.0 (educational photo asset preparation; source credits retained)'})
            with urllib.request.urlopen(req, timeout=45) as response:
                data = response.read()
            image = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
            image.thumbnail((1200, 900), Image.Resampling.LANCZOS)
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=82, optimize=True, progressive=True)
            content = output.getvalue()
            assert len(content) > 5000
            print('PHOTO_ASSET:' + json.dumps({'id':photo['id'],'width':image.width,'height':image.height,'bytes':len(content),'base64':base64.b64encode(content).decode()}, separators=(',',':')), flush=True)
            break
        except Exception as error:
            if attempt == 3: raise
            print('Retry ' + photo['id'] + ': ' + str(error), flush=True)
            time.sleep(3 * (attempt + 1))
