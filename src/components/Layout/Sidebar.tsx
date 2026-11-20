
import type { NavItem } from '../../types/curriculum';
const items = [
  { id: 'dashboard', label: 'My journey' },
  { id: 'eaatw', label: 'Destinations' },
  { id: 'passport', label: 'My passport' },
  { id: 'progress', label: 'My progress' },
  { id: 'teacher', label: 'For teachers' },
  { id: 'settings', label: 'Settings' },
] as const;
interface Props { activeNav: NavItem; isOpen: boolean; onNavChange: (nav: NavItem) => void; onToggle: () => void; }
export function Sidebar({ activeNav, isOpen, onNavChange, onToggle }: Props) {
  return <aside className={`travel-sidebar ${isOpen ? '' : 'is-collapsed'}`}>
    <button className="brand" onClick={() => onNavChange('dashboard')} aria-label="English Around the World, home">
      
      <span className="brand-name">English around<br/><strong>the world<span>.</span></strong><small>HAARLEM COLLEGE</small></span>
    </button>
    <p className="nav-caption">YOUR LEARNING ADVENTURE</p>
    <nav aria-label="Main navigation">{items.map(({ id, label }) =>
      <button key={id} className={`nav-item ${activeNav === id ? 'active' : ''}`} onClick={() => onNavChange(id)} title={label} aria-label={label} aria-current={activeNav === id ? 'page' : undefined}>
        <span>{label}</span>{activeNav === id && <i/>}
      </button>)}</nav>
    <div className="sidebar-bottom"><div className="travel-note"><></><p>A world of stories.<br/><strong>Your English takes you further.</strong></p></div>
      <button className="collapse-toggle" onClick={onToggle} aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}>{isOpen ? <></> : <></>}<span>Collapse menu</span></button>
    </div>
  </aside>;
}


