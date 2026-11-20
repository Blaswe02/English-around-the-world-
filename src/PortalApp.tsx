import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { PortalSidebar } from './components/Layout/PortalSidebar';
import { PortalHeader } from './components/Layout/PortalHeader';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { PublicHome } from './components/Dashboard/PublicHome';
import { ProgressOverview } from './components/Dashboard/ProgressOverview';
import { CountryGrid } from './components/Countries/CountryGrid';
import { CountryDetail } from './components/Countries/CountryDetail';
import { LessonPlayer } from './components/Lessons/LessonPlayer';
import { AccountPassport } from './components/Passport/AccountPassport';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { AccountManager } from './components/Teacher/AccountManager';
import { LearnerOverview } from './components/Teacher/LearnerOverview';
import { AccountSettings } from './components/Auth/AccountSettings';
import { LoginModal } from './components/Auth/LoginModal';
import { ImageCredits } from './components/UI/ImageCredits';
import { Modal } from './components/UI/Modal';
import { COUNTRIES, LEVELS } from './data/countries';
import { loadProgress, readLocal, writeLocal } from './services/progress';
import type { Level, NavItem, CountryConfig, CountryStatus, Lesson } from './types/curriculum';
type Intent={kind:'nav';nav:NavItem}|{kind:'country';country:CountryConfig}|{kind:'lesson';lesson:Lesson;owner:CountryConfig};
export default function PortalApp(){return <AuthProvider><Portal/></AuthProvider>;}
function Portal(){
 const {user,profile,loading,error:authError,signOut}=useAuth();
 const teacher=profile?.role==='teacher';const signedIn=!!user&&!!profile&&!loading;
 const [level,setLevel]=useState<Level>(()=>{const l=readLocal('eaatw_level');return LEVELS.includes(l as Level)?l as Level:'BASIS';});
 const [nav,setNav]=useState<NavItem>('dashboard'),[isOpen,setOpen]=useState(true),[query,setQuery]=useState('');
 const [country,setCountry]=useState<CountryConfig|null>(null),[lesson,setLesson]=useState<Lesson|null>(null);
 const [login,setLogin]=useState(false),[intent,setIntent]=useState<Intent|null>(null),[loginMessage,setLoginMessage]=useState('');
 const [modal,setModal]=useState<{title:string;message:string}|null>(null);
 const [progress,setProgress]=useState<{owner:string;level:Level;done:Set<string>}|null>(null),[progressError,setProgressError]=useState(''),[progressBusy,setProgressBusy]=useState(false),[revision,setRevision]=useState(0);
 useEffect(()=>{
  let cancelled=false;setProgress(null);setProgressError('');
  if(!signedIn){setProgressBusy(false);return;}
  setProgressBusy(true);loadProgress(level).then(done=>{if(!cancelled)setProgress({owner:user!.id,level,done});}).catch(e=>{if(!cancelled)setProgressError((e as Error).message);}).finally(()=>{if(!cancelled)setProgressBusy(false);});
  return()=>{cancelled=true;};
 },[user?.id,signedIn,level,revision]);
 const isLessonComplete=(c:string,l:string)=>signedIn&&progress?.owner===user?.id&&progress?.level===level&&progress.done.has(`${c}__${l}`);
 const getCountryStatus=(c:CountryConfig):CountryStatus=>c.status;
 const promptLogin=(next?:Intent)=>{setIntent(next||{kind:'nav',nav:'dashboard'});setLoginMessage('Log in voor je persoonlijke leerreis.');setLogin(true);};
 function navigate(next:NavItem){
  if(next!=='eaatw'&&next!=='dashboard'&&!signedIn){promptLogin({kind:'nav',nav:next});return;}
  if(next==='teacher'&&!teacher){setModal({title:'Alleen voor docenten',message:'Dit onderdeel hoort bij een docentenaccount.'});return;}
  setQuery('');setNav(next);setCountry(null);setLesson(null);window.scrollTo({top:0});
 }
 function openCountry(next:CountryConfig){
  if(!signedIn){promptLogin({kind:'country',country:next});return;}
  if(!teacher&&(next.status==='locked'||next.status==='future')){setModal({title:'Deze bestemming komt eraan',message:`De module ${next.title} staat op de planning. Je docent laat weten wanneer de lessen beschikbaar zijn.`});return;}
  setQuery('');setCountry(next);setLesson(null);setNav('eaatw');window.scrollTo({top:0});
 }
 function openLesson(next:Lesson,owner:CountryConfig){
  if(!signedIn){promptLogin({kind:'lesson',lesson:next,owner});return;}
  if(!teacher&&(owner.status==='locked'||owner.status==='future')){openCountry(owner);return;}
  if(!teacher&&!next.levels.includes(level)){setModal({title:'Een ander niveau',message:`Deze les is beschikbaar voor ${next.levels.join(', ')}.`});return;}
  if(!next.url&&!next.internalLessonId){setModal({title:'In voorbereiding',message:`De les “${next.title}” wordt nog gemaakt.`});return;}
  setQuery('');setCountry(owner);setLesson(next);setNav('eaatw');window.scrollTo({top:0});
 }
 useEffect(()=>{if(!signedIn||!intent)return;const next=intent;setIntent(null);setLogin(false);if(next.kind==='nav')navigate(next.nav);else if(next.kind==='country')openCountry(next.country);else openLesson(next.lesson,next.owner);},[signedIn,intent]);
 async function logout(){try{await signOut();setProgress(null);setIntent(null);setNav('dashboard');setCountry(null);setLesson(null);setQuery('');window.scrollTo({top:0});}catch(e){setModal({title:'Uitloggen',message:(e as Error).message});}}
 const changeLevel=(l:Level)=>{setLevel(l);writeLocal('eaatw_level',l);setLesson(null);};
 const current=COUNTRIES.find(c=>c.status==='current')||COUNTRIES[0];
 const matches=COUNTRIES.map(c=>({country:c,lessons:c.lessons.filter(l=>(teacher||l.levels.includes(level))&&`${l.title} ${l.description}`.toLowerCase().includes(query.trim().toLowerCase()))})).filter(m=>m.country.title.toLowerCase().includes(query.trim().toLowerCase())||m.lessons.length);
 let page;
 if(query.trim())page=<div className="travel-page"><div className="page-intro"><div><p className="eyebrow">VIND JOUW VOLGENDE AVONTUUR</p><h1>Zoekresultaten</h1></div><Search size={30}/></div><div className="content-panel">{matches.length?matches.map(m=><section key={m.country.id}><button className="search-result" onClick={()=>openCountry(m.country)}><span>{m.country.flag}</span><div><strong>{m.country.title}</strong><small>{m.country.subtitle}</small></div></button>{m.lessons.map(l=><button className="search-result" key={l.id} onClick={()=>openLesson(l,m.country)}><span>{l.icon}</span><div><strong>{l.title}</strong><small>{signedIn?(l.url||l.internalLessonId?'Les openen':'In voorbereiding'):'Inloggen om te openen'}</small></div></button>)}</section>):<p className="empty-state">Geen resultaten. Probeer een bestemming of onderwerp.</p>}</div></div>;
 else if(loading)page=<div className="travel-page content-panel" role="status">Account ophalen…</div>;
 else if(nav==='eaatw'&&!country)page=<CountryGrid countries={COUNTRIES} level={level} getCountryStatus={getCountryStatus} onCountryClick={openCountry}/>;
 else if(!signedIn)page=<PublicHome level={level} onLogin={()=>promptLogin()} onCountryClick={openCountry} onDestinations={()=>navigate('eaatw')}/>;
 else if(nav==='dashboard')page=<DashboardHome level={level} countries={COUNTRIES} currentCountry={current} getCountryStatus={getCountryStatus} isLessonComplete={isLessonComplete} onCountryClick={openCountry} onNavigate={navigate}/>;
 else if(nav==='eaatw'&&country&&lesson)page=progressBusy?<div className="content-panel" role="status">Voortgang ophalen…</div>:<LessonPlayer key={`${user!.id}-${lesson.id}-${level}`} lesson={lesson} countryId={country.id} level={level} initialComplete={isLessonComplete(country.id,lesson.id)} onBack={()=>{setLesson(null);setRevision(v=>v+1);window.scrollTo({top:0});}}/>;
 else if(nav==='eaatw'&&country)page=<CountryDetail key={country.id} country={country} level={level} isTeacher={teacher} isLessonComplete={isLessonComplete} onBack={()=>setCountry(null)} onLessonClick={l=>openLesson(l,country)}/>;
 else if(nav==='passport')page=<AccountPassport level={level}/>;
 else if(nav==='progress')page=<ProgressOverview countries={COUNTRIES} level={level} isLessonComplete={isLessonComplete} onCountryClick={openCountry}/>;
 else if(nav==='teacher'&&teacher)page=<div className="travel-page"><AccountManager/><LearnerOverview level={level}/><TeacherDashboard countries={COUNTRIES} level={level}/></div>;
 else if(nav==='settings')page=<AccountSettings level={level} onLevelChange={changeLevel} onPasswordChanged={async()=>{await logout();setLoginMessage('Je wachtwoord is veranderd. Log opnieuw in met je nieuwe wachtwoord.');setIntent({kind:'nav',nav:'dashboard'});setLogin(true);}}/>;
 else page=<div className="content-panel">Je hebt geen toegang tot dit onderdeel.</div>;
 return <div className="app-shell"><a className="skip-link" href="#main-content">Naar de inhoud</a><PortalSidebar activeNav={nav} isOpen={isOpen} onNavChange={navigate} onToggle={()=>setOpen(v=>!v)}/><div className={`app-content ${isOpen?'':'menu-collapsed'}`}><PortalHeader level={level} levels={LEVELS} onLevelChange={changeLevel} query={query} onSearch={setQuery} onLogin={()=>promptLogin()} onDashboard={()=>navigate('dashboard')} onLogout={()=>void logout()}/><main id="main-content" className="travel-main" tabIndex={-1}>{authError&&<p role="alert" className="form-error">{authError}</p>}{signedIn&&progressError&&<div role="alert" className="form-error">{progressError} <button className="text-button" onClick={()=>setRevision(v=>v+1)}>Opnieuw proberen</button></div>}{page}<footer className="travel-footer"><strong>English around the world. · Haarlem College</strong><span>Learn the language. Discover the world.</span><ImageCredits/></footer></main></div>{login&&!signedIn&&<LoginModal onSuccess={()=>setLogin(false)} message={loginMessage} onClose={()=>{setLogin(false);if(!signedIn)setIntent(null);}}/>}{modal&&<Modal title={modal.title} message={modal.message} onClose={()=>setModal(null)}/>}</div>;
}
