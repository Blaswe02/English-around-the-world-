import { Globe2 } from 'lucide-react';
import { CountryCard } from './CountryCard';
import type { CountryConfig,CountryStatus,Level } from '../../types/curriculum';
interface Props { countries:CountryConfig[]; level:Level; getCountryStatus:(c:CountryConfig)=>CountryStatus; onCountryClick:(c:CountryConfig)=>void; }
export function CountryGrid({countries,level,getCountryStatus,onCountryClick}:Props) {
  return <div className="travel-page"><div className="page-intro"><div><p className="eyebrow">YOUR WORLD IS WAITING</p><h1>Where does your story begin?</h1><p>Explore the destinations and see which lessons are ready.</p></div><Globe2 size={42} className="text-teal-700"/></div><div className="destination-grid">{countries.map((c,i)=><CountryCard key={c.id} country={c} status={getCountryStatus(c)} level={level} index={i} onClick={()=>onCountryClick(c)}/>)}</div></div>;
}


