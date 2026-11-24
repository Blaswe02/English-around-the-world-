import { useState } from 'react';
import { LanguageGlobe } from './LanguageGlobe';

import { useAuth } from '../../auth/AuthProvider';
import { useNews, formatNewsDate, type NewsPost } from '../../services/news';

const postImages:Record<string,{src:string;alt:string;width:number;height:number}>={
 '735a46f8-f4e1-48dd-8847-c8cabf16cfa2':{src:'/art/news-destination-tiles.webp',alt:'Year 1 destination tiles for the UK and Australia',width:960,height:502},
 'c24b351f-fbca-4388-a91b-62cbd6f9afce':{src:'/art/news-teacher-updates.webp',alt:'The teacher portal with the News and updates editor',width:1316,height:754},
 'aad257e2-465c-44f9-8838-07724251bf92':{src:'/art/news-globe.webp',alt:'English Around the World globe showing our learning destinations',width:474,height:449}
};

const viewboxes:Record<string,string>={method:"0 0 768 512",website:"768 0 768 512",texas:"0 512 768 512",space:"768 512 768 512"};
function artwork(post:NewsPost){
 const title=post.title.toLowerCase();
 if(title.includes('nasa'))return 'space';
 if(title.includes('texas')||title.includes('first miles'))return 'texas';
 if(title.includes('online')||post.category==='Platform news')return 'website';
 return 'method';
}
export function PublicHome({onLogin,onDestinations}:{onLogin:()=>void;onDestinations:()=>void}){
 const {profile}=useAuth();
 const {posts,busy,error,reload}=useNews(false);
 const [archiveOpen,setArchiveOpen]=useState(false);
 const latestPosts=posts.slice(0,4);
 const olderPosts=posts.slice(4);
 return <div className="travel-page journal-home">
  <section className="journal-banner" aria-labelledby="journal-title">
   <p className="journal-school">HAARLEM COLLEGE · ENGLISH</p>
   <div className="journal-logo"><LanguageGlobe/><h1 id="journal-title">English Around<br/><span>the World<span className="journal-dot">.</span></span></h1></div>
   <p className="journal-description">English lessons through countries, culture, stories and more.</p>
   <div className="journal-entry"><button className="button button-coral" onClick={onLogin}><></>{profile?'Go to my journey':'Log in to my journey'}<></></button><button className="text-button" onClick={onDestinations}>Explore destinations</button></div>
   <div className="journal-tracks"><span>VMBO · Years 1–4 <small>BASIS / KADER / MAVO</small></span><span>HAVO · Years 1–3</span></div>
  </section>
  <section aria-labelledby="classroom-title" className="journal-updates">
   <div className="journal-section-heading"><p className="eyebrow">NEWS &amp; UPDATES</p><h2 id="classroom-title">Inside our classroom</h2></div>
   {busy&&<p role="status" className="journal-empty">Loading updates…</p>}
   {error&&<div role="alert" className="form-error">{error} <button className="text-button" onClick={reload}>Try again</button></div>}
   {!busy&&!error&&!posts.length&&<div className="journal-empty"><></><h3>News &amp; updates</h3><p>Classroom projects and lesson updates will appear here.</p>{profile?.role==='teacher'&&<p>Add an update in For teachers → News &amp; updates.</p>}</div>}
   {!busy&&!error&&<><div className="journal-news-grid">{latestPosts.map((post,i)=><article key={post.id} className={`journal-news-card journal-card-${i%4} journal-theme-${artwork(post)}`}>
    {postImages[post.id]?<div className="journal-card-art journal-art-screenshot"><img src={postImages[post.id].src} alt={postImages[post.id].alt} width={postImages[post.id].width} height={postImages[post.id].height} loading="lazy" decoding="async"/></div>:<div className={`journal-card-art journal-art-${artwork(post)}`} aria-hidden="true"><svg viewBox={viewboxes[artwork(post)]} preserveAspectRatio="xMidYMid slice"><image href="/art/classroom-stories.png" x="0" y="0" width="1536" height="1024"/></svg></div>}
    <div className="journal-card-copy"><div className="journal-card-meta"><span>{post.category}</span><time dateTime={post.published_at||post.created_at}>{formatNewsDate(post.published_at||post.created_at)}</time></div><h3>{post.title}</h3><p>{post.summary}</p>
     {post.body&&<details className="journal-read-more"><summary aria-label={`Read update: ${post.title}`}><span>Read update</span></summary><div className="journal-update-body">{post.body}</div></details>}
    </div>
   </article>)}</div>
   <div className="journal-archive">
    <button type="button" className="journal-archive-button" aria-expanded={archiveOpen} aria-controls="old-news-list" onClick={()=>setArchiveOpen(open=>!open)}>
     Old news <span>{olderPosts.length}</span>
    </button>
    <div id="old-news-list" className="journal-archive-panel" hidden={!archiveOpen}>
     <h3>Old news</h3>
     {olderPosts.length ? <ol className="journal-archive-list">{olderPosts.map(post=><li key={post.id}>
      <details className="journal-archive-item">
       <summary><div className="journal-archive-meta"><span>{post.category}</span><time dateTime={post.published_at||post.created_at}>{formatNewsDate(post.published_at||post.created_at)}</time></div><h4>{post.title}</h4><span className="journal-archive-read">Read update</span></summary>
       <div className="journal-archive-content"><p>{post.summary}</p>{post.body&&<div className="journal-update-body">{post.body}</div>}</div>
      </details>
     </li>)}</ol> : <p>There are no older updates yet. Previous updates will appear here when new news is published.</p>}
    </div>
   </div></>}
  </section>
 </div>;
}
