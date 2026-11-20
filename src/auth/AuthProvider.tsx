import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
export type Profile={user_id:string;username:string;display_name:string;role:'student'|'teacher';class_name:string;active:boolean};
type AuthState={user:User|null;profile:Profile|null;loading:boolean;error:string;refresh:()=>Promise<void>;signOut:()=>Promise<void>};
const AuthContext=createContext<AuthState|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<Profile|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{
  let active=true;let version=0;
  async function load(){
   const request=++version;
   if(!supabase){if(active)setLoading(false);return;}
   try{
    const {data,error:authError}=await supabase.auth.getUser();
    if(!active||request!==version)return;
    if(authError||!data.user){setUser(null);setProfile(null);setLoading(false);return;}
    const result=await supabase.from('learning_profiles').select('user_id,username,display_name,role,class_name,active').eq('user_id',data.user.id).single();
    if(!active||request!==version)return;
    if(result.error||!result.data?.active){setUser(null);setProfile(null);setError('Je account is nog niet actief. Vraag je docent om hulp.');}
    else{setUser(data.user);setProfile(result.data as Profile);setError('');}
   }catch{if(active&&request===version){setUser(null);setProfile(null);setError('De accountverbinding is niet beschikbaar. Probeer opnieuw.');}}
   finally{if(active&&request===version)setLoading(false);}
  }
  void load();
  const {data}=supabase?.auth.onAuthStateChange(()=>{if(active){setLoading(true);setUser(null);setProfile(null);setTimeout(()=>void load(),0);}})||{data:null};
  const refresh=()=>void load();window.addEventListener('eatw-auth-refresh',refresh);
  return()=>{active=false;version++;data?.subscription.unsubscribe();window.removeEventListener('eatw-auth-refresh',refresh);};
 },[]);
 const refresh=async()=>{window.dispatchEvent(new Event('eatw-auth-refresh'));};
 const signOut=async()=>{
  if(supabase){const {error}=await supabase.auth.signOut({scope:'local'});if(error)throw new Error('Uitloggen is niet gelukt. Probeer opnieuw.');}
  setUser(null);setProfile(null);setError('');
 };
 return <AuthContext.Provider value={{user,profile,loading,error,refresh,signOut}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider ontbreekt');return value;}
