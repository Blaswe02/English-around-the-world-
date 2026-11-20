import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Level } from '../types/curriculum';
export type ModuleAccess={country_id:string;study_year:number;study_level:Level;is_open:boolean};
export const yearsFor=(level:Level)=>Array.from({length:level==='HAVO'?3:4},(_,i)=>i+1);
export function useModuleAccess(userId:string|undefined,revision:number){
 const [state,setState]=useState<{owner?:string;rows:ModuleAccess[];busy:boolean;error:string}>({rows:[],busy:false,error:''});
 useEffect(()=>{let active=true;
  async function refresh(){
   if(!supabase||!userId){if(active)setState({rows:[],busy:false,error:''});return;}
   setState(s=>({...s,busy:true}));
   const {data,error}=await supabase.from('module_access').select('country_id,study_year,study_level,is_open');
   if(active)setState({owner:userId,rows:error?[]:data as ModuleAccess[],busy:false,error:error?'Could not load module access. Please try again.':''});
  }
  void refresh();const timer=window.setInterval(()=>void refresh(),30000);const focus=()=>void refresh();window.addEventListener('focus',focus);
  return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',focus);};
 },[userId,revision]);
 return {...state,rows:state.owner===userId?state.rows:[],ready:!!userId&&state.owner===userId};
}
