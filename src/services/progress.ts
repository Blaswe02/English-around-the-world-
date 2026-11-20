import { supabase } from './supabase';
export function readLocal(key:string):string|null{try{return localStorage.getItem(key);}catch{return null;}}
export function writeLocal(key:string,value:string):void{try{localStorage.setItem(key,value);}catch{/* Preferences are optional. */}}
export async function loadProgress(level:string,year:number):Promise<Set<string>>{
 if(!supabase)throw new Error('The account service is unavailable.');
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)throw new Error('Log in again to load your progress.');
 const {data,error}=await supabase.from('learner_progress').select('country_id,lesson_id').eq('user_id',user.id).eq('level',level).eq('study_year',year);
 if(error)throw new Error('Could not load your progress. Please try again.');
 return new Set(data.map(row=>`${row.country_id}__${row.lesson_id}`));
}
export async function markLessonComplete(countryId:string,lessonId:string,level:string,year:number):Promise<void>{
 if(!supabase)throw new Error('The account service is unavailable.');
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)throw new Error('Log in again to save your progress.');
 const {error}=await supabase.from('learner_progress').upsert({user_id:user.id,country_id:countryId,lesson_id:lessonId,level,study_year:year},{onConflict:'user_id,country_id,lesson_id,level,study_year'});
 if(error)throw new Error('Could not save your progress. Please try again; your lesson has not been saved yet.');
}

