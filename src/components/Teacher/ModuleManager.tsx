import { useState } from 'react';

import { COUNTRIES,LEVELS } from '../../data/countries';
import { useAuth } from '../../auth/AuthProvider';
import { supabase } from '../../services/supabase';
import { yearsFor,type ModuleAccess } from '../../services/moduleAccess';
import type { Level } from '../../types/curriculum';
export function ModuleManager({rows,onChange}:{rows:ModuleAccess[];onChange:()=>void}){
 const {user}=useAuth();const [level,setLevel]=useState<Level>('BASIS'),[year,setYear]=useState(1),[busy,setBusy]=useState<string|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function toggle(id:string,isOpen:boolean){
  if(!supabase||!user)return;setBusy(id);setError('');setNotice('');
  const {data,error}=await supabase.from('module_access').upsert({country_id:id,study_year:year,study_level:level,is_open:isOpen,updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:'country_id,study_year,study_level'}).select('country_id').single();
  if(error||!data)setError('Could not save module access. Please try again.');
  else {setNotice(`${COUNTRIES.find(c=>c.id===id)?.title} is now ${isOpen?'open':'locked'} for Year ${year} ${level}.`);onChange();}setBusy(null);
 }
 return <section className="content-panel module-manager"><p className="eyebrow">YOU SET THE PACE</p><h2>Unlock the world</h2><p>Choose a year and level, then open the destinations your students can use. All modules start locked. You can preview every destination with your teacher account.</p><div className="enrolment-fields"><label>Level<select disabled={busy!==null} value={level} onChange={e=>{const next=e.target.value as Level;setLevel(next);if(next==='HAVO'&&year===4)setYear(3);setNotice('');}}>{LEVELS.map(l=><option key={l}>{l}</option>)}</select></label><label>Year<select disabled={busy!==null} value={year} onChange={e=>{setYear(Number(e.target.value));setNotice('');}}>{yearsFor(level).map(y=><option key={y} value={y}>Year {y}</option>)}</select></label></div><div className="module-access-list">{COUNTRIES.map(c=>{const open=rows.some(r=>r.country_id===c.id&&r.study_year===year&&r.study_level===level&&r.is_open);const ready=c.lessons.filter(l=>l.levels.includes(level)&&(l.url||l.internalLessonId)).length;return <div className="module-access-row" key={c.id}><div><h3>{c.title}</h3><p>{ready?`${ready} available lessons`:'Lesson content in development'}</p></div><button className={`button ${open?'module-open':'module-locked'}`} disabled={busy!==null} aria-pressed={open} aria-label={`${open?'Lock':'Unlock'} ${c.title} for Year ${year} ${level}`} onClick={()=>void toggle(c.id,!open)}>{open?<></>:<></>} {busy===c.id?'Saving…':open?'Open · Lock module':'Locked · Unlock'}</button></div>;})}</div>{error&&<p role="alert" className="form-error">{error}</p>}{notice&&<p role="status" className="form-success">{notice}</p>}<p className="auth-help">Changes apply to all students in the selected year and level. Unlocking a destination makes its available lessons accessible; lessons still in development remain unavailable.</p></section>;
}
