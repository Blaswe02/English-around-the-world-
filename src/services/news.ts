import { useEffect, useState } from 'react';
import { supabase } from './supabase';
export type NewsPost={id:string;title:string;summary:string;body:string;category:string;published:boolean;published_at:string|null;created_at:string};
export const NEWS_CATEGORIES=['Method update','New lessons','Classroom stories','Platform news'] as const;
export const formatNewsDate=(date:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Amsterdam'}).format(new Date(date));
export function useNews(includeDrafts:boolean){
 const [posts,setPosts]=useState<NewsPost[]>([]),[busy,setBusy]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);
 const reload=()=>setRevision(v=>v+1);
 useEffect(()=>{let active=true;setBusy(true);setError('');
  async function fetchPosts(){try{
   if(!supabase)throw new Error('unavailable');
   let query=supabase.from('news_posts').select('id,title,summary,body,category,published,published_at,created_at');
   if(!includeDrafts)query=query.eq('published',true);
   const {data,error}=await query.order('published_at',{ascending:false,nullsFirst:false}).order('created_at',{ascending:false});
   if(error)throw error;if(active)setPosts(data as NewsPost[]);
  }catch{if(active){setPosts([]);setError('Could not load updates. Please try again.');}}finally{if(active)setBusy(false);}}
  void fetchPosts();const changed=()=>reload();window.addEventListener('eatw-news-changed',changed);
  return()=>{active=false;window.removeEventListener('eatw-news-changed',changed);};
 },[includeDrafts,revision]);
 return {posts,busy,error,reload};
}
