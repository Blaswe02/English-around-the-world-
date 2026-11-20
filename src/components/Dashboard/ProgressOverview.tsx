import { CheckCircle2, Compass } from 'lucide-react';
import type { CountryConfig, Level } from '../../types/curriculum';
interface Props { countries:CountryConfig[]; level:Level; isLessonComplete:(c:string,l:string)=>boolean; onCountryClick:(c:CountryConfig)=>void; }
export function ProgressOverview({countries,level,isLessonComplete,onCountryClick}:Props) {
 const completed = countries.reduce((n,c)=> n+c.lessons.filter(l=>l.levels.includes(level)&&isLessonComplete(c.id,l.id)).length,0);
 return <div className="travel-page"><div className="page-intro"><div><p className="eyebrow">ELKE STAP TELT</p><h1>Dit heb jij al ontdekt.</h1><p>Je afgeronde lessen voor niveau {level}. Een nieuw verhaal begint met één stap.</p></div><Compass size={36} className="text-teal-700"/></div>
 <div className="content-panel"><h2>{completed} {completed===1?'les':'lessen'} afgerond</h2><p>De balken tonen je voortgang in de lessen die je hier kunt openen. Geplande lessen tellen nog niet mee.</p>
 {countries.map(c=>{const ready=c.lessons.filter(l=>l.levels.includes(level)&&(l.url||l.internalLessonId));const done=ready.filter(l=>isLessonComplete(c.id,l.id)).length;return <div key={c.id} className="progress-row"><span>{c.flag}</span><div><h3>{c.title}</h3><p>{ready.length ? `${done} van ${ready.length} lessen afgerond` : 'Lessen in voorbereiding'}</p>{ready.length>0&&<div className="progress-bar" role="progressbar" aria-label={`Voortgang ${c.title}`} aria-valuenow={done} aria-valuemin={0} aria-valuemax={ready.length}><i style={{width:`${done/ready.length*100}%`}}/></div>}</div>{done===ready.length&&ready.length>0?<CheckCircle2 className="text-teal-700"/>:ready.length>0?<button className="text-button" onClick={()=>onCountryClick(c)}>Verder leren</button>:null}</div>})}
 </div></div>;
}
