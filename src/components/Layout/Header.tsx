import { Search, Compass } from 'lucide-react';
import type { Level } from '../../types/curriculum';
interface Props { level: Level; levels: Level[]; onLevelChange: (level: Level) => void; query: string; onSearch: (query: string) => void; nickname: string; }
export function Header({ level, levels, onLevelChange, query, onSearch, nickname }: Props) {
  return <header className="travel-header">
    <div className="header-label"><Compass size={18}/><span>Your world. Your English.</span></div>
    <label className="search-field"><Search size={18}/><input aria-label="Zoek bestemmingen en lessen" placeholder="Waar wil je naartoe?" value={query} onChange={e => onSearch(e.target.value)}/>{query && <button aria-label="Zoekopdracht wissen" onClick={() => onSearch('')}>×</button>}</label>
    <label className="level-field"><span>Niveau</span><select aria-label="Kies je niveau" value={level} onChange={e => onLevelChange(e.target.value as Level)}>{levels.map(l => <option key={l}>{l}</option>)}</select></label>
    <span className="traveller-avatar" title={nickname || 'Reiziger'}>{(nickname || 'R').slice(0,1).toUpperCase()}</span>
  </header>;
}

