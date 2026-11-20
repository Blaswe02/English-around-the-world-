import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { supabase } from '../../services/supabase';
import { NEWS_CATEGORIES, useNews, type NewsPost } from '../../services/news';
const blank={title:'',summary:'',body:'',category:'Method update'};
export function NewsManager(){
 const {user}=useAuth();const {posts,busy:loading,error:loadError,reload}=useNews(true);
 const [draft,setDraft]=useState(blank),[editing,setEditing]=useState<NewsPost|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function save(publish:boolean){
  if(!supabase||!user)return;setBusy(true);setError('');setNotice('');
  try{
   const values={title:draft.title.trim(),summary:draft.summary.trim(),body:draft.body.trim(),category:draft.category,published:publish,published_at:publish?(editing?.published_at||new Date().toISOString()):null,updated_by:user.id,updated_at:new Date().toISOString()};
   if(!values.title||!values.summary)throw new Error('Enter a title and a short introduction.');
   const query=editing?supabase.from('news_posts').update(values).eq('id',editing.id):supabase.from('news_posts').insert({...values,created_by:user.id});
   const {data,error}=await query.select('id').single();if(error||!data)throw new Error('Could not save this update. Please try again.');
   setDraft(blank);setEditing(null);setNotice(publish?'Update published on the home page.':'Draft saved. It is visible to teachers only.');window.dispatchEvent(new Event('eatw-news-changed'));
  }catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 return <section className="content-panel news-manager"><p className="eyebrow">KEEP YOUR COMMUNITY IN THE LOOP</p><h2>News &amp; updates</h2><p>Write an update for the home page. Save a draft to finish later, or publish it for everyone to read. Published updates are public.</p>
  <form onSubmit={e=>{e.preventDefault();void save(true);}}><h3>{editing?'Edit update':'New update'}</h3><label>Title<input required maxLength={140} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label>Category<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>{NEWS_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label><label>Short introduction<textarea required rows={2} maxLength={500} value={draft.summary} onChange={e=>setDraft({...draft,summary:e.target.value})}/></label><label>Full update (optional)<textarea rows={7} maxLength={12000} value={draft.body} onChange={e=>setDraft({...draft,body:e.target.value})}/></label><div className="news-actions"><button className="button button-teal" disabled={busy}>{busy?'Saving…':editing?.published?'Save & publish changes':'Publish update'}</button><button className="button news-draft-button" type="button" disabled={busy} onClick={()=>void save(false)}>{editing?.published?'Unpublish & save draft':'Save draft'}</button>{editing&&<button className="text-button" type="button" disabled={busy} onClick={()=>{setEditing(null);setDraft(blank);setError('');}}>Cancel editing</button>}</div></form>
  {error&&<p role="alert" className="form-error">{error}</p>}{notice&&<p role="status" className="form-success">{notice}</p>}{loadError&&<p role="alert" className="form-error">{loadError} <button className="text-button" onClick={reload}>Try again</button></p>}{loading?<p role="status">Loading updates…</p>:<div className="news-admin-list">{posts.map(post=><div key={post.id}><div><span>{post.published?'Published':'Draft'} · {post.category}</span><h3>{post.title}</h3></div><button className="text-button" disabled={busy} onClick={()=>{setEditing(post);setDraft({title:post.title,summary:post.summary,body:post.body,category:post.category});setNotice('');setError('');}}>Edit<span className="sr-only"> {post.title}</span></button></div>)}</div>}
 </section>;
}
