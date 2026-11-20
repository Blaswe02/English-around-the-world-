import { Globe2, BookOpen, Compass, MapPin, Headphones, MessagesSquare, PenLine, Stamp } from 'lucide-react';
import { CountryCard } from '../Countries/CountryCard';
import { useAuth } from '../../auth/AuthProvider';
import type { CountryConfig, CountryStatus, Level, NavItem } from '../../types/curriculum';
interface Props { level: Level; countries: CountryConfig[]; currentCountry: CountryConfig; getCountryStatus: (c: CountryConfig) => CountryStatus; isLessonComplete: (c: string,l: string) => boolean; onCountryClick: (c: CountryConfig) => void; onNavigate: (n: NavItem) => void; }
export function DashboardHome({ level, countries, currentCountry, getCountryStatus, isLessonComplete, onCountryClick, onNavigate }: Props) {
  const {profile}=useAuth();
  const available = currentCountry.lessons.filter(l => l.levels.includes(level) && (l.url || l.internalLessonId));
  const done = available.filter(l => isLessonComplete(currentCountry.id,l.id)).length;
  const totalDone = countries.reduce((n,c) => n + c.lessons.filter(l => l.levels.includes(level) && isLessonComplete(c.id,l.id)).length,0);
  return <div className="travel-page dashboard">
    <div className="page-intro"><div><p className="eyebrow">LET'S EXPLORE</p><h1>Hey {profile?.display_name || 'reiziger'}, klaar voor vertrek?</h1><p>Ontdek de wereld. Ontmoet nieuwe verhalen. Groei in Engels.</p></div><span className="edition-tag"><Compass size={17}/> Het avontuur begint bij jou</span></div>
    <section className="destination-hero" aria-labelledby="hero-title">
      <img src={currentCountry.image} alt="Skyline van Singapore aan Marina Bay" fetchPriority="high"/><div className="hero-shade"/>
      <div className="hero-copy"><span className="hero-kicker"><span/> JOUW HUIDIGE BESTEMMING</span><p className="hero-location"><MapPin size={15}/> {currentCountry.region}</p><h2 id="hero-title">Next stop:<br/><em>{currentCountry.title}.</em></h2><p>Street food, skyline & Singlish.<br/>Een nieuwe wereld. Een nieuw verhaal.</p><button className="button button-coral" onClick={() => onCountryClick(currentCountry)}><Compass size={19}/> {done ? 'Verder met mijn reis' : 'Ontdek Singapore'}</button></div>
      <div className="boarding-pass"><div><span>JOUW BOARDING PASS</span><strong>AMS <small>✈</small> SIN</strong></div><div className="boarding-detail"><p>NIVEAU<strong>{level}</strong></p><p>LESSEN KLAAR<strong>{done} / {available.length}</strong></p></div><div className="boarding-progress"><i style={{width: `${available.length ? done/available.length*100 : 0}%`}}/></div></div>
    </section>
    <div className="journey-stats"><div><span className="stat-icon mint"><Globe2/></span><p><strong>{countries.length}</strong><span>bestemmingen om te ontdekken</span></p></div><div><span className="stat-icon peach"><BookOpen/></span><p><strong>{totalDone}</strong><span>lessen afgerond op {level.toLowerCase()}</span></p></div><button onClick={() => onNavigate('passport')}><span className="stat-icon lilac"><Stamp/></span><p><strong>Mijn paspoort</strong><span>Bekijk je culturele reis</span></p></button></div>
    <section><div className="section-heading"><div><p className="eyebrow">EEN WERELD AAN MOGELIJKHEDEN</p><h2>Kies je volgende verhaal</h2></div><button className="text-button" onClick={() => onNavigate('eaatw')}>Alle bestemmingen</button></div><div className="destination-grid">{countries.slice(0,3).map((c,i) => <CountryCard key={c.id} country={c} status={getCountryStatus(c)} level={level} index={i} onClick={() => onCountryClick(c)}/>)}</div></section>
    <section className="learning-strip"><div><p className="eyebrow">MEER DAN WOORDJES LEREN</p><h2>Gebruik Engels in de echte wereld.</h2><p>Lees, luister, praat en schrijf terwijl je nieuwe plekken ontdekt.</p></div><div className="skill-islands">{[{icon:BookOpen,label:'Read'},{icon:Headphones,label:'Listen'},{icon:MessagesSquare,label:'Speak'},{icon:PenLine,label:'Write'}].map(({icon:Icon,label}) => <div key={label}><Icon size={23}/><span>{label}</span></div>)}</div></section>
  </div>;
}

