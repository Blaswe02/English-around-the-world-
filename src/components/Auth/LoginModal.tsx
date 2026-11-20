import { useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';
import { useDialogFocus } from '../UI/useDialogFocus';
import { supabase } from '../../services/supabase';
import { loginEmail } from '../../auth/identity';
export function LoginModal({onClose,onSuccess,message}:{onClose:()=>void;onSuccess:()=>void;message?:string}){
 const ref=useDialogFocus(onClose);const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 return <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4"><div ref={ref} role="dialog" aria-modal="true" aria-labelledby="login-title" className="auth-dialog"><button className="auth-close" aria-label="Close login" onClick={onClose}><X size={21}/></button><div className="auth-dialog-heading"><LockKeyhole size={30}/><p className="eyebrow">YOUR PERSONAL LEARNING JOURNEY</p><h2 id="login-title">Welcome back, traveller.</h2><p>{message||'Log in to continue your journey.'}</p></div><form className="auth-form" onSubmit={async e=>{e.preventDefault();setError('');setBusy(true);try{if(!supabase)throw new Error('The login service is unavailable. Please try again later.');const email=loginEmail(username);const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw new Error(error.code==='email_not_confirmed'?'Your account is not confirmed yet. Ask your teacher or administrator to activate it.':'Could not log in. Check your username or email and password.');setPassword('');onSuccess();}catch(err){setError(err instanceof Error?err.message:'Could not log in.');}finally{setBusy(false);}}}>
 <label htmlFor="login-username">Student username or teacher email</label><input id="login-username" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username or email"/>
 <label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>
 {error&&<p role="alert" className="form-error">{error}</p>}<button className="button button-teal" disabled={busy||!supabase}>{busy?'Logging in…':'Log in'}</button><p className="auth-help">Forgot your password? Ask your teacher to reset it. Your teacher creates your account.</p></form></div></div>;
}

