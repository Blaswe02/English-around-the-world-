import { useEffect,useState } from 'react';

import { supabase } from '../../services/supabase';
import { useAuth } from '../../auth/AuthProvider';
import { COUNTRIES } from '../../data/countries';
import { STAMP_ICONS,STAMP_LABELS } from '../../data/passport';
import type { Level,StampType } from '../../types/curriculum';
const types:StampType[]=['fact','taste','story','heritage','diplomat','archive'];
export function AccountPassport({level,year}:{level:Level;year:number}){
 const {user,profile}=useAuth();const [stamps,setStamps]=useState<Set<string>>(new Set()),[error,setError]=useState(''),[busy,setBusy]=useState(true);
 useEffect(()=>{let active=true;setStamps(new Set());setError('');setBusy(true);if(!supabase||!user){setBusy(false);return;}supabase.from('passport_stamps').select('country_id,stamp_type').eq('user_id',user.id).eq('level',level).eq('study_year',year).then(({data,error})=>{if(!active)return;if(error)setError('Could not load your stamps. Please try again later.');else setStamps(new Set(data.map(s=>`${s.country_id}__${s.stamp_type}`)));setBusy(false);});return()=>{active=false;};},[user?.id,level,year]);
 return <div className="travel-page"><div className="page-intro"><div><p className="eyebrow">YOUR CULTURAL JOURNEY</p><h1>Passport: {profile?.display_name}</h1><p>Your teacher awards stamps when you complete passport tasks.</p></div></div><section className="passport-cover"><></><p>HAARLEM COLLEGE</p><h2>English around the world.</h2><span>{busy?'Loading stamps…':`${stamps.size} stamps collected`} · {level}</span></section>{error&&<p role="alert" className="form-error">{error}</p>}{COUNTRIES.map(c=><section className="content-panel" key={c.id}><h2>{c.title}</h2><div className="stamp-grid">{types.map(type=>{const earned=stamps.has(`${c.id}__${type}`);return <div key={type} className={`stamp-slot ${earned?'earned':''}`} aria-label={`${STAMP_LABELS[type]}: ${earned?'earned':'not earned yet'}`}><strong>{STAMP_LABELS[type].replace(' Stamp','')}</strong><small>{earned?'Earned':'Not earned yet'}</small></div>;})}</div></section>)}</div>;
}

