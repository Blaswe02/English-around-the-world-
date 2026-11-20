import { DESTINATION_PHOTOS } from '../../data/destinationPhotos';
export function ImageCredits(){
 return <details className="image-credits"><summary>Photo credits</summary><div><p>Destination photographs are cropped to fit. All photos are used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a>.</p>{Object.entries(DESTINATION_PHOTOS).map(([id,photo])=><p key={id}>{photo.title}: <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.author} / Unsplash</a>.</p>)}</div></details>;
}
