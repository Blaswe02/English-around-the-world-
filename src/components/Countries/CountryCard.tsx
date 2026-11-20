import { getDestinationCode, getDestinationYear, getDestinationPeriod } from '../../data/countries';
import { DESTINATION_PHOTOS } from '../../data/destinationPhotos';
import type { CountryConfig, CountryStatus, Level } from '../../types/curriculum';
interface Props { country:CountryConfig; status:CountryStatus; level:Level; index:number; onClick:()=>void; }
const labels:Record<CountryStatus,string>={current:'Explore now',completed:'Module archive',development:'In development',locked:'Locked by your teacher',future:'Coming soon'};
export function CountryCard({country,status,level,onClick}:Props){
 const ready=country.lessons.filter(l=>l.levels.includes(level)&&(l.url||l.internalLessonId)).length;
 const unavailable=status==='locked'||status==='future';
 return <button className={`destination-card ${unavailable?'destination-planned':''}`} onClick={onClick} aria-label={`${country.title} — ${labels[status]}`}>
  <div className="destination-photo"><img src={country.image} alt={DESTINATION_PHOTOS[country.id]?.alt||country.title} loading="lazy" decoding="async" width={960} height={600}/><span className={`destination-status status-${status}`}>{labels[status]}</span><span className="destination-code">{getDestinationCode(country.id)}</span></div>
  <div className="destination-info"><p>{country.region}</p><h3>{country.title}</h3><span className="destination-subtitle">Year {getDestinationYear(country.id)} · Period {getDestinationPeriod(country.id)} · {country.subtitle}</span><div className="destination-footer"><span>{ready?`${ready} lessons to explore`:'Lessons coming soon'}</span><span>{status==='current'?'Explore':'View module'}</span></div></div>
 </button>;
}
