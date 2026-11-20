import { Globe2, LayoutDashboard, BarChart3, Settings, BookOpen, Stamp, PanelLeftClose, PanelLeftOpen, Compass } from 'lucide-react';
import type { NavItem } from '../../types/curriculum';
const items = [
  { id: 'dashboard', label: 'Mijn reis', icon: LayoutDashboard },
  { id: 'eaatw', label: 'Bestemmingen', icon: Globe2 },
  { id: 'passport', label: 'Mijn paspoort', icon: Stamp },
  { id: 'progress', label: 'Mijn voortgang', icon: BarChart3 },
  { id: 'teacher', label: 'Voor docenten', icon: BookOpen },
  { id: 'settings', label: 'Instellingen', icon: Settings },
] as const;
interface Props { activeNav: NavItem; isOpen: boolean; onNavChange: (nav: NavItem) => void; onToggle: () => void; }
export function Sidebar({ activeNav, isOpen, onNavChange, onToggle }: Props) {
  return <aside className={`travel-sidebar ${isOpen ? '' : 'is-collapsed'}`}>
    <button className="brand" onClick={() => onNavChange('dashboard')} aria-label="English Around the World, startpagina">
      <span className="brand-icon"><Globe2 size={27}/></span>
      <span className="brand-name">English around<br/><strong>the world<span>.</span></strong><small>HAARLEM COLLEGE</small></span>
    </button>
    <p className="nav-caption">JOUW LEERAVONTUUR</p>
    <nav aria-label="Hoofdnavigatie">{items.map(({ id, label, icon: Icon }) =>
      <button key={id} className={`nav-item ${activeNav === id ? 'active' : ''}`} onClick={() => onNavChange(id)} title={label} aria-label={label} aria-current={activeNav === id ? 'page' : undefined}>
        <Icon size={20}/><span>{label}</span>{activeNav === id && <i/>}
      </button>)}</nav>
    <div className="sidebar-bottom"><div className="travel-note"><Compass size={28}/><p>Een wereld aan verhalen.<br/><strong>Jouw Engels brengt je verder.</strong></p></div>
      <button className="collapse-toggle" onClick={onToggle} aria-label={isOpen ? 'Menu inklappen' : 'Menu uitklappen'}>{isOpen ? <PanelLeftClose size={19}/> : <PanelLeftOpen size={19}/>}<span>Menu inklappen</span></button>
    </div>
  </aside>;
}

