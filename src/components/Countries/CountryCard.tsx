import { MapPin, Lock, Compass, BookOpen } from 'lucide-react';
import type { CountryConfig, CountryStatus, Level } from '../../types/curriculum';
interface Props { country:CountryConfig; status:CountryStatus; level:Level; index:number; onClick:()=>void; }
const labels: Record<CountryStatus,string> = { current:'Explore now', completed:'Module archive', development:'In development', locked:'Locked by your teacher', future:'Coming soon' };
export function CountryCard({country,status,level,onClick}:Props) {
  const ready = country.lessons.filter(l => l.levels.includes(level) && (l.url || l.internalLessonId)).length;
  const unavailable = status === 'locked' || status === 'future';
  return <button className={`destination-card ${unavailable ? 'destination-planned' : ''}`} onClick={onClick} aria-label={`${country.title} — ${labels[status]}`}>
    <div className="destination-photo"><img src={country.image} alt="" loading="lazy"/><span className={`destination-status status-${status}`}>{unavailable ? <Lock size={13}/> : status==='current' ? <Compass size={13}/> : null}{labels[status]}</span><span className="destination-code">{country.id==='singapore'?'SIN':country.id==='malta'?'MLA':country.id==='hawaii'?'HNL':country.id==='ireland'?'DUB':'KIN'}</span></div>
    <div className="destination-info"><p><MapPin size={13}/>{country.region}</p><h3>{country.title}<span>{country.flag}</span></h3><span className="destination-subtitle">{country.subtitle}</span><div className="destination-footer"><span><BookOpen size={14}/>{ready ? `${ready} lessons to explore` : 'Lessons coming soon'}</span><span>{status==='current' ? 'Explore' : 'View module'}</span></div></div>
  </button>;
}


