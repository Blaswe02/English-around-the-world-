import { useEffect,useState } from 'react';
import { Globe2 } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../auth/AuthProvider';
import { COUNTRIES } from '../../data/countries';
import { STAMP_ICONS,STAMP_LABELS } from '../../data/passport';
import type { Level,StampType } from '../../types/curriculum';
const types:StampType[]=['fact','taste','story','heritage','diplomat','archive'];
export function AccountPassport({level}:{level:Level}){
 const {user,profile}=useAuth();const [stamps,setStamps]=useState<Set<string>>(new Set()),[error,setError]=useState(''),[busy,setBusy]=useState(true);
 useEffect(()=>{let active=true;setStamps(new Set());setError('');setBusy(true);if(!supabase||!user){setBusy(false);return;}supabase.from('passport_stamps').select('country_id,stamp_type').eq('user_id',user.id).eq('level',level).then(({data,error})=>{if(!active)return;if(error)setError('Je stempels konden niet worden opgehaald. Open het paspoort later opnieuw.');else setStamps(new Set(data.map(s=>`${s.country_id}__${s.stamp_type}`)));setBusy(false);});return()=>{active=false;};},[user?.id,level]);
 return <div className="travel-page"><div className="page-intro"><div><p className="eyebrow">JOUW CULTURELE REIS</p><h1>Het paspoort van {profile?.display_name}</h1><p>Je docent kent stempels toe na het afronden van een paspoortopdracht.</p></div></div><section className="passport-cover"><Globe2 size={42}/><p>HAARLEM COLLEGE</p><h2>English around the world.</h2><span>{busy?'Stempels ophalen…':`${stamps.size} stempels verzameld`} · {level}</span></section>{error&&<p role="alert" className="form-error">{error}</p>}{COUNTRIES.map(c=><section className="content-panel" key={c.id}><h2>{c.flag} {c.title}</h2><div className="stamp-grid">{types.map(type=>{const earned=stamps.has(`${c.id}__${type}`);return <div key={type} className={`stamp-slot ${earned?'earned':''}`} aria-label={`${STAMP_LABELS[type]}: ${earned?'behaald':'nog te behalen'}`}><span>{STAMP_ICONS[type]}</span><strong>{STAMP_LABELS[type].replace(' Stamp','')}</strong><small>{earned?'Behaald':'Nog te behalen'}</small></div>;})}</div></section>)}</div>;
}
