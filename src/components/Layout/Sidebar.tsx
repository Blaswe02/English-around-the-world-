import { Globe2, LayoutDashboard, BarChart3, Settings, BookOpen, Stamp, PanelLeftClose, PanelLeftOpen, Compass } from 'lucide-react';
import type { NavItem } from '../../types/curriculum';
const items = [
  { id: 'dashboard', label: 'My journey', icon: LayoutDashboard },
  { id: 'eaatw', label: 'Destinations', icon: Globe2 },
  { id: 'passport', label: 'My passport', icon: Stamp },
  { id: 'progress', label: 'My progress', icon: BarChart3 },
  { id: 'teacher', label: 'For teachers', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;
interface Props { activeNav: NavItem; isOpen: boolean; onNavChange: (nav: NavItem) => void; onToggle: () => void; }
export function Sidebar({ activeNav, isOpen, onNavChange, onToggle }: Props) {
  return <aside className={`travel-sidebar ${isOpen ? '' : 'is-collapsed'}`}>
    <button className="brand" onClick={() => onNavChange('dashboard')} aria-label="English Around the World, home">
      <span className="brand-icon"><Globe2 size={27}/></span>
      <span className="brand-name">English around<br/><strong>the world<span>.</span></strong><small>HAARLEM COLLEGE</small></span>
    </button>
    <p className="nav-caption">YOUR LEARNING ADVENTURE</p>
    <nav aria-label="Main navigation">{items.map(({ id, label, icon: Icon }) =>
      <button key={id} className={`nav-item ${activeNav === id ? 'active' : ''}`} onClick={() => onNavChange(id)} title={label} aria-label={label} aria-current={activeNav === id ? 'page' : undefined}>
        <Icon size={20}/><span>{label}</span>{activeNav === id && <i/>}
      </button>)}</nav>
    <div className="sidebar-bottom"><div className="travel-note"><Compass size={28}/><p>A world of stories.<br/><strong>Your English takes you further.</strong></p></div>
      <button className="collapse-toggle" onClick={onToggle} aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}>{isOpen ? <PanelLeftClose size={19}/> : <PanelLeftOpen size={19}/>}<span>Collapse menu</span></button>
    </div>
  </aside>;
}


