import { useEffect, useState } from 'react';

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
import { TeacherAccountManager } from './components/Teacher/TeacherAccountManager';
import { AccountManager } from './components/Teacher/AccountManager';
import { LearnerOverview } from './components/Teacher/LearnerOverview';
import { ModuleManager } from './components/Teacher/ModuleManager';
import { NewsManager } from './components/Teacher/NewsManager';
import { AccountSettings } from './components/Auth/AccountSettings';
import { LoginModal } from './components/Auth/LoginModal';
import { ImageCredits } from './components/UI/ImageCredits';
import { Modal } from './components/UI/Modal';
import { COUNTRIES, LEVELS, getDestinationYear } from './data/countries';
import { useModuleAccess } from './services/moduleAccess';
import { loadProgress, readLocal, writeLocal } from './services/progress';
import type { Level, NavItem, CountryConfig, CountryStatus, Lesson } from './types/curriculum';
type Intent={kind:'nav';nav:NavItem}|{kind:'country';country:CountryConfig}|{kind:'lesson';lesson:Lesson;owner:CountryConfig};
export default function PortalApp(){return <AuthProvider><Portal/></AuthProvider>;}
function Portal(){
 const {user,profile,loading,error:authError,signOut}=useAuth();
 const teacher=profile?.role==='teacher',signedIn=!!user&&!!profile&&!loading;
 const [previewLevel,setPreviewLevel]=useState<Level>(()=>{const l=readLocal('eaatw_level');return LEVELS.includes(l as Level)?l as Level:'BASIS';});
 const level=profile?.role==='student'&&profile.study_level?profile.study_level:previewLevel;
 const [year,setYear]=useState(1);
 useEffect(()=>{if(profile?.role==='student')setYear(profile.study_year||1);},[profile?.user_id,profile?.study_year,profile?.study_level]);
 useEffect(()=>{if(level==='HAVO'&&year>3)setYear(3);},[level,year]);
 const [nav,setNav]=useState<NavItem>('home'),[isOpen,setOpen]=useState(true),[query,setQuery]=useState('');
 const [country,setCountry]=useState<CountryConfig|null>(null),[lesson,setLesson]=useState<Lesson|null>(null);
 const [login,setLogin]=useState(false),[intent,setIntent]=useState<Intent|null>(null),[loginMessage,setLoginMessage]=useState('');
 const [modal,setModal]=useState<{title:string;message:string}|null>(null),[revision,setRevision]=useState(0);
 const access=useModuleAccess(signedIn?user?.id:undefined,revision);
 const [progress,setProgress]=useState<{owner:string;level:Level;year:number;done:Set<string>}|null>(null),[progressError,setProgressError]=useState(''),[progressBusy,setProgressBusy]=useState(false);
 useEffect(()=>{
  let cancelled=false;setProgress(null);setProgressError('');
  if(!signedIn){setProgressBusy(false);return;}
  setProgressBusy(true);loadProgress(level,year).then(done=>{if(!cancelled)setProgress({owner:user!.id,level,year,done});}).catch(e=>{if(!cancelled)setProgressError((e as Error).message);}).finally(()=>{if(!cancelled)setProgressBusy(false);});
  return()=>{cancelled=true;};
 },[user?.id,signedIn,level,year,revision]);
 const isLessonComplete=(c:string,l:string)=>!!(signedIn&&progress?.owner===user?.id&&progress?.level===level&&progress.year===year&&progress.done.has(`${c}__${l}`));
 const studentOpen=(c:CountryConfig)=>profile?.study_year===getDestinationYear(c.id)&&access.rows.some(r=>r.country_id===c.id&&r.study_year===getDestinationYear(c.id)&&r.study_level===level&&r.is_open);
 const canOpen=(c:CountryConfig)=>teacher||studentOpen(c);
 const getCountryStatus=(c:CountryConfig):CountryStatus=>studentOpen(c)?'current':'locked';
 const promptLogin=(next?:Intent)=>{setIntent(next||{kind:'nav',nav:'dashboard'});setLoginMessage('Log in to continue your learning journey.');setLogin(true);};
 function navigate(next:NavItem){
  if(next!=='eaatw'&&next!=='home'&&!signedIn){promptLogin({kind:'nav',nav:next});return;}
  if(next==='teacher'&&!teacher){setModal({title:'Teachers only',message:'This section is for teacher accounts.'});return;}
  setQuery('');setNav(next);setCountry(null);setLesson(null);window.scrollTo({top:0});
 }
 function openCountry(next:CountryConfig){
  if(!signedIn){promptLogin({kind:'country',country:next});return;}
  if(!canOpen(next)){setModal({title:'Your teacher opens this destination',message:`${next.title} is locked for Year ${year} ${level}. Your teacher decides when your group can start.`});return;}
  setYear(getDestinationYear(next.id));setQuery('');setCountry(next);setLesson(null);setNav('eaatw');window.scrollTo({top:0});
 }
 function openLesson(next:Lesson,owner:CountryConfig){
  if(!signedIn){promptLogin({kind:'lesson',lesson:next,owner});return;}
  if(!canOpen(owner)){openCountry(owner);return;}
  if(!teacher&&!next.levels.includes(level)){setModal({title:'A different level',message:`This lesson is available for ${next.levels.join(', ')}.`});return;}
  if(!next.url&&!next.internalLessonId){setModal({title:'Coming soon',message:`The lesson “${next.title}” is still being developed.`});return;}
  setQuery('');setCountry(owner);setLesson(next);setNav('eaatw');window.scrollTo({top:0});
 }
 useEffect(()=>{if(!signedIn||!intent||!access.ready||access.busy)return;const next=intent;setIntent(null);setLogin(false);if(next.kind==='nav')navigate(next.nav);else if(next.kind==='country')openCountry(next.country);else openLesson(next.lesson,next.owner);},[signedIn,intent,access.ready,access.busy]);
 async function logout(){try{await signOut();setProgress(null);setIntent(null);setNav('home');setCountry(null);setLesson(null);setQuery('');window.scrollTo({top:0});}catch(e){setModal({title:'Log out',message:(e as Error).message});}}
 const changeLevel=(l:Level)=>{if(profile?.role==='student')return;setPreviewLevel(l);writeLocal('eaatw_level',l);setCountry(null);setLesson(null);};
 const changeYear=(y:number)=>{setYear(y);setCountry(null);setLesson(null);};
 const matches=COUNTRIES.map(c=>({country:c,lessons:c.lessons.filter(l=>`${l.title} ${l.description}`.toLowerCase().includes(query.trim().toLowerCase()))})).filter(m=>m.country.title.toLowerCase().includes(query.trim().toLowerCase())||m.lessons.length);
 let page;
 if(loading)page=<div className="travel-page content-panel" role="status">Loading your account…</div>;
 else if(query.trim())page=<div className="travel-page"><div className="page-intro"><div><p className="eyebrow">FIND YOUR NEXT ADVENTURE</p><h1>Search results</h1></div></div>{matches.length?matches.map(m=><section className="content-panel" key={m.country.id}><button className="text-button" onClick={()=>openCountry(m.country)}>{m.country.title}</button>{m.lessons.map(l=><button className="search-result" key={l.id} onClick={()=>openLesson(l,m.country)}><div><strong>{l.title}</strong><small>{!signedIn?'Log in to open':canOpen(m.country)?l.url||l.internalLessonId?'Open lessonson':'Coming soon':'Locked by your teacher'}</small></div></button>)}</section>):<p className="empty-state">No results. Try a destination or topic.</p>}</div>;
 else if(nav==='home')page=<PublicHome onLogin={()=>signedIn?navigate('dashboard'):promptLogin()} onDestinations={()=>navigate('eaatw')}/>;
 else if(nav==='eaatw'&&!country)page=<div className="travel-page">{signedIn&&<p>Year {year} · {level}{teacher?' · Teacher preview':'. Your teacher controls module access.'}</p>}<CountryGrid countries={COUNTRIES} level={level} getCountryStatus={getCountryStatus} onCountryClick={openCountry}/></div>;
 else if(!signedIn)page=<PublicHome onLogin={()=>promptLogin()} onDestinations={()=>navigate('eaatw')}/>;
 else if(nav==='dashboard')page=<DashboardHome level={level} year={year} onYearChange={changeYear} access={access.rows} countries={COUNTRIES.filter(c=>getDestinationYear(c.id)===year)} getCountryStatus={getCountryStatus} isLessonComplete={isLessonComplete} onCountryClick={openCountry} onNavigate={navigate}/>;
 else if(nav==='eaatw'&&country&&!canOpen(country))page=<div className="content-panel locked-year"><></><h1>This destination is locked.</h1><p>Your teacher controls access for Year {year} {level}. Your completed work is kept.</p><button className="button button-teal" onClick={()=>navigate('dashboard')}>Back to my journey</button></div>;
 else if(nav==='eaatw'&&country&&lesson)page=progressBusy?<div className="content-panel" role="status">Loading your progress…</div>:<LessonPlayer key={`${user!.id}-${lesson.id}-${level}-${year}`} lesson={lesson} countryId={country.id} level={level} year={year} initialComplete={isLessonComplete(country.id,lesson.id)} onBack={()=>{setLesson(null);setRevision(v=>v+1);window.scrollTo({top:0});}}/>;
 else if(nav==='eaatw'&&country)page=<CountryDetail key={country.id} country={country} level={level} isTeacher={teacher} isLessonComplete={isLessonComplete} onBack={()=>setCountry(null)} onLessonClick={l=>openLesson(l,country)}/>;
 else if(nav==='passport')page=<AccountPassport level={level} year={year}/>;
 else if(nav==='progress')page=<ProgressOverview countries={COUNTRIES} level={level} year={year} isLessonComplete={isLessonComplete} onCountryClick={openCountry}/>;
 else if(nav==='teacher'&&teacher)page=<div className="travel-page"><div className="page-intro"><div><p className="eyebrow">YOUR TEACHING SPACE</p><h1>{profile?.is_admin?'Administration':'Guide the journey.'}</h1><p>Manage updates, students, module access and progress.</p></div></div>{profile?.is_admin&&<TeacherAccountManager/>}<NewsManager/><ModuleManager rows={access.rows} onChange={()=>setRevision(v=>v+1)}/><AccountManager/><LearnerOverview/><TeacherDashboard countries={COUNTRIES} level={level}/></div>;
 else if(nav==='settings')page=<AccountSettings level={level} onLevelChange={changeLevel} onPasswordChanged={async()=>{await logout();setLoginMessage('Your password has changed. Log in again with your new password.');setIntent({kind:'nav',nav:'dashboard'});setLogin(true);}}/>;
 else page=<div className="content-panel">You do not have access to this section.</div>;
 return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to content</a><PortalSidebar activeNav={nav} isOpen={isOpen} onNavChange={navigate} onToggle={()=>setOpen(v=>!v)}/><div className={`app-content ${isOpen?'':'menu-collapsed'}`}><PortalHeader level={level} levels={LEVELS} onLevelChange={changeLevel} query={query} onSearch={setQuery} onLogin={()=>promptLogin()} onDashboard={()=>navigate('dashboard')} onLogout={()=>void logout()}/><main id="main-content" className="travel-main" tabIndex={-1}>{authError&&<p role="alert" className="form-error">{authError}</p>}{signedIn&&(progressError||access.error)&&<div role="alert" className="form-error">{progressError||access.error} <button className="text-button" onClick={()=>setRevision(v=>v+1)}>Try again</button></div>}{page}<footer className="travel-footer"><strong>English around the world. · Haarlem College</strong><span>Haarlem College · English</span><ImageCredits/></footer></main></div>{login&&!signedIn&&<LoginModal onSuccess={()=>setLogin(false)} message={loginMessage} onClose={()=>{setLogin(false);if(!signedIn)setIntent(null);}}/>}{modal&&<Modal title={modal.title} message={modal.message} onClose={()=>setModal(null)}/>}</div>;
}
