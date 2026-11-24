import { supabase } from './supabase';
import { getDestinationYear } from '../data/countries';
import type { Level } from '../types/curriculum';
export type ResourceCategory='handout'|'extra';
export type DestinationResource={id:string;country_id:string;study_year:number;study_level:Level|'ALL';category:ResourceCategory;title:string;storage_path:string;file_name:string;mime_type:string;size_bytes:number;archived_at:string|null};
const types:Record<string,string>={pdf:'application/pdf',doc:'application/msword',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',ppt:'application/vnd.ms-powerpoint',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg'};
export async function listResources(countryId:string,category:ResourceCategory){
 if(!supabase)throw new Error('Materials are unavailable.');
 const {data,error}=await supabase.from('destination_resources').select('id,country_id,study_year,study_level,category,title,storage_path,file_name,mime_type,size_bytes,archived_at').eq('country_id',countryId).eq('category',category).order('created_at',{ascending:false});
 if(error)throw new Error('Could not load materials. Please try again.');
 return data as DestinationResource[];
}
export async function uploadResource(countryId:string,category:ResourceCategory,title:string,studyLevel:Level|'ALL',file:File,userId:string){
 if(!supabase)throw new Error('Materials are unavailable.');
 const extension=file.name.split('.').pop()?.toLowerCase()||'',mime=types[extension];
 if(!mime)throw new Error('Choose a PDF, Word, PowerPoint, PNG or JPEG file.');
 if(!file.size||file.size>20*1024*1024)throw new Error('Choose a file up to 20 MB.');
 const storagePath=countryId+'/'+crypto.randomUUID()+'.'+extension;
 const {error:uploadError}=await supabase.storage.from('destination-materials').upload(storagePath,file,{contentType:mime,upsert:false});
 if(uploadError)throw new Error('Could not upload the file. Please try again.');
 const {error}=await supabase.from('destination_resources').insert({country_id:countryId,study_year:getDestinationYear(countryId),study_level:studyLevel,category,title:title.trim(),storage_path:storagePath,file_name:file.name,mime_type:mime,size_bytes:file.size,created_by:userId});
 if(error){await supabase.storage.from('destination-materials').remove([storagePath]);throw new Error('Could not save the material. Please try again.');}
}
export async function downloadResource(resource:DestinationResource){
 if(!supabase)throw new Error('Materials are unavailable.');
 const {data,error}=await supabase.storage.from('destination-materials').createSignedUrl(resource.storage_path,60,{download:resource.file_name});
 if(error||!data?.signedUrl)throw new Error('Could not download this file. Check that the destination is still open.');
 const link=document.createElement('a');link.href=data.signedUrl;link.download=resource.file_name;document.body.appendChild(link);link.click();link.remove();
}
export async function archiveResource(id:string,archive:boolean){
 if(!supabase)throw new Error('Materials are unavailable.');
 const {error}=await supabase.from('destination_resources').update({archived_at:archive?new Date().toISOString():null}).eq('id',id);
 if(error)throw new Error('Could not update this material. Please try again.');
}
