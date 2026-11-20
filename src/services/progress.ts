import { supabase } from './supabase';
export function readLocal(key:string):string|null{try{return localStorage.getItem(key);}catch{return null;}}
export function writeLocal(key:string,value:string):void{try{localStorage.setItem(key,value);}catch{/* Preferences are optional. */}}
export async function loadProgress(level:string):Promise<Set<string>>{
 if(!supabase)throw new Error('De accountverbinding is niet beschikbaar.');
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)throw new Error('Log opnieuw in om je voortgang op te halen.');
 const {data,error}=await supabase.from('learner_progress').select('country_id,lesson_id').eq('user_id',user.id).eq('level',level);
 if(error)throw new Error('Je voortgang kon niet worden opgehaald. Probeer opnieuw.');
 return new Set(data.map(row=>`${row.country_id}__${row.lesson_id}`));
}
export async function markLessonComplete(countryId:string,lessonId:string,level:string):Promise<void>{
 if(!supabase)throw new Error('De accountverbinding is niet beschikbaar.');
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)throw new Error('Log opnieuw in om je voortgang op te slaan.');
 const {error}=await supabase.from('learner_progress').upsert({user_id:user.id,country_id:countryId,lesson_id:lessonId,level},{onConflict:'user_id,country_id,lesson_id,level'});
 if(error)throw new Error('Opslaan is niet gelukt. Probeer opnieuw; je les is nog niet opgeslagen.');
}
