import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { supabase } from '../../services/supabase';
type Teacher={user_id:string;display_name:string;email:string;active:boolean;is_admin:boolean};
type Credential={email:string;temporary_password:string};
export function TeacherAccountManager(){
 const {profile}=useAuth();const [teachers,setTeachers]=useState<Teacher[]>([]);
 const [email,setEmail]=useState(''),[name,setName]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[credential,setCredential]=useState<Credential|null>(null),[confirmId,setConfirmId]=useState<string|null>(null);
 const mounted=useRef(true);
 async function action(body:Record<string,unknown>){if(!supabase)throw new Error('Account management is unavailable.');const {data,error}=await supabase.functions.invoke('manage-learning-accounts',{body});if(error){let message='Account management failed. Please try again.';try{const payload=await error.context?.json();if(payload?.error)message=payload.error;}catch{}throw new Error(message);}if(data?.error)throw new Error(data.error);return data;}
 async function refresh(){try{const data=await action({action:'list_teachers'});if(mounted.current)setTeachers(data.teachers);}catch(e){if(mounted.current)setError((e as Error).message);}}
 useEffect(()=>{mounted.current=true;if(profile?.is_admin)void refresh();return()=>{mounted.current=false;};},[profile?.is_admin]);
 if(!profile?.is_admin)return null;
 return <section className="content-panel teacher-account-manager"><p className="eyebrow">ADMINISTRATORS ONLY</p><h2>Teacher accounts</h2><p>Create a teacher account with an email address and name. A temporary password is generated for you to share directly with the teacher.</p>
 <form className="account-create" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');setCredential(null);try{const data=await action({action:'create_teacher',email,display_name:name});setCredential({email:data.email,temporary_password:data.temporary_password});setEmail('');setName('');await refresh();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>
 <label>Teacher email<input type="email" maxLength={254} required autoComplete="off" value={email} onChange={e=>setEmail(e.target.value)}/></label>
 <label>Teacher name<input required maxLength={60} value={name} onChange={e=>setName(e.target.value)}/></label>
 <button className="button button-teal" disabled={busy}>{busy?'Please wait…':'Create teacher'}</button></form>
 {error&&<p className="form-error" role="alert">{error}</p>}
 {credential&&<div className="form-success" role="status"><p>Share these login details directly with the teacher. Their password can be changed in Settings.</p><p><strong>{credential.email}</strong></p><p>Temporary password: <code>{credential.temporary_password}</code></p><button type="button" className="text-button" onClick={()=>setCredential(null)}>Hide password</button></div>}
 <div className="account-table-wrap"><table className="account-table"><thead><tr><th>Teacher</th><th>Email</th><th>Access</th><th>Account</th></tr></thead><tbody>{teachers.map(t=><tr key={t.user_id}><td>{t.display_name}</td><td>{t.email}</td><td>{t.is_admin?'Administrator':'Teacher'} · {t.active?'Active':'Inactive'}</td><td>{!t.is_admin&&<>{confirmId!==t.user_id?<button className="text-button" disabled={busy} onClick={()=>setConfirmId(t.user_id)}>New temporary password</button>:<div><p>This replaces the teacher’s password and signs out their existing sessions.</p><button className="button button-teal" disabled={busy} onClick={async()=>{setBusy(true);setError('');setCredential(null);try{const data=await action({action:'reset_teacher_password',user_id:t.user_id});setCredential({email:data.email,temporary_password:data.temporary_password});setConfirmId(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>Reset password</button><button className="text-button" onClick={()=>setConfirmId(null)}>Cancel</button></div>}</>}</td></tr>)}</tbody></table></div>
 </section>;
}
