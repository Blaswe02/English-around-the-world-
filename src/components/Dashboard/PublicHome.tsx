import { LanguageGlobe } from './LanguageGlobe';
import { ArrowRight, Compass, Globe2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useNews, formatNewsDate, type NewsPost } from '../../services/news';

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
 return <div className="travel-page journal-home">
  <section className="journal-banner" aria-labelledby="journal-title">
   <p className="journal-school">HAARLEM COLLEGE · ENGLISH</p>
   <div className="journal-logo"><LanguageGlobe/><h1 id="journal-title">English Around<br/><span>the World<span className="journal-dot">.</span></span></h1></div>
   <p className="journal-description">English lessons through countries, culture, stories and more.</p>
   <div className="journal-entry"><button className="button button-coral" onClick={onLogin}><Compass size={18}/>{profile?'Go to my journey':'Log in to my journey'}<ArrowRight size={17}/></button><button className="text-button" onClick={onDestinations}>Explore destinations</button></div>
   <div className="journal-tracks"><span>VMBO · Years 1–4 <small>BASIS / KADER / MAVO</small></span><span>HAVO · Years 1–3</span></div>
  </section>
  <section aria-labelledby="classroom-title" className="journal-updates">
   <div className="journal-section-heading"><p className="eyebrow">NEWS &amp; UPDATES</p><h2 id="classroom-title">Inside our classroom</h2></div>
   {busy&&<p role="status" className="journal-empty">Loading updates…</p>}
   {error&&<div role="alert" className="form-error">{error} <button className="text-button" onClick={reload}>Try again</button></div>}
   {!busy&&!error&&!posts.length&&<div className="journal-empty"><Globe2 size={28}/><h3>News &amp; updates</h3><p>Classroom projects and lesson updates will appear here.</p>{profile?.role==='teacher'&&<p>Add an update in For teachers → News &amp; updates.</p>}</div>}
   <div className="journal-news-grid">{posts.map((post,i)=><article key={post.id} className={`journal-news-card journal-card-${i%4} journal-theme-${artwork(post)}`}>
    <div className={`journal-card-art journal-art-${artwork(post)}`} aria-hidden="true"><svg viewBox={viewboxes[artwork(post)]} preserveAspectRatio="xMidYMid slice"><image href="/art/classroom-stories.png" x="0" y="0" width="1536" height="1024"/></svg></div>
    <div className="journal-card-copy"><div className="journal-card-meta"><span>{post.category}</span><time dateTime={post.published_at!}>{formatNewsDate(post.published_at!)}</time></div><h3>{post.title}</h3><p>{post.summary}</p>
     {post.body&&<details className="journal-read-more"><summary aria-label={`Read update: ${post.title}`}><span>Read update</span><i><ArrowRight size={19}/></i></summary><div className="journal-update-body">{post.body}</div></details>}
    </div>
   </article>)}</div>
  </section>
 </div>;
}
