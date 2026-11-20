
import type { CountryConfig, Level } from '../../types/curriculum';
interface Props { countries:CountryConfig[]; level:Level; year:number; isLessonComplete:(c:string,l:string)=>boolean; onCountryClick:(c:CountryConfig)=>void; }
export function ProgressOverview({countries,level,year,isLessonComplete,onCountryClick}:Props) {
 const completed = countries.reduce((n,c)=> n+c.lessons.filter(l=>l.levels.includes(level)&&isLessonComplete(c.id,l.id)).length,0);
 return <div className="travel-page"><div className="page-intro"><div><p className="eyebrow">EVERY STEP COUNTS</p><h1>Look how far you have come.</h1><p>Your completed lessons in Year {year} at level {level}. A new story starts with one step.</p></div><></></div>
 <div className="content-panel"><h2>{completed} {completed===1?'lesson':'lessons'} completed</h2><p>The bars show progress in available lessons. Planned lessons do not count yet.</p>
 {countries.map(c=>{const ready=c.lessons.filter(l=>l.levels.includes(level)&&(l.url||l.internalLessonId));const done=ready.filter(l=>isLessonComplete(c.id,l.id)).length;return <div key={c.id} className="progress-row"><div><h3>{c.title}</h3><p>{ready.length ? `${done} of ${ready.length} lessons completed` : 'Lessons coming soon'}</p>{ready.length>0&&<div className="progress-bar" role="progressbar" aria-label={`Progress in ${c.title}`} aria-valuenow={done} aria-valuemin={0} aria-valuemax={ready.length}><i style={{width:`${done/ready.length*100}%`}}/></div>}</div>{done===ready.length&&ready.length>0?<>Completed</>:ready.length>0?<button className="text-button" onClick={()=>onCountryClick(c)}>Keep learning</button>:null}</div>})}
 </div></div>;
}

