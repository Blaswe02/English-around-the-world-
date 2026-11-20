import { Search, Compass, LogIn, LogOut, UserRound } from 'lucide-react';
import type { Level } from '../../types/curriculum';
import { useAuth } from '../../auth/AuthProvider';
interface Props{level:Level;levels:Level[];onLevelChange:(l:Level)=>void;query:string;onSearch:(q:string)=>void;onLogin:()=>void;onDashboard:()=>void;onLogout:()=>void;}
export function PortalHeader({level,levels,onLevelChange,query,onSearch,onLogin,onDashboard,onLogout}:Props){
 const {profile,loading}=useAuth();
 return <header className="travel-header"><div className="header-label"><Compass size={18}/><span>Your world. Your English.</span></div><label className="search-field"><Search size={18}/><input aria-label="Search destinations and lessons" placeholder="Where would you like to go?" value={query} onChange={e=>onSearch(e.target.value)}/>{query&&<button aria-label="Clear search" onClick={()=>onSearch('')}>×</button>}</label><label className="level-field"><span>Level</span><select aria-label="Choose your level" disabled={profile?.role==='student'} value={level} onChange={e=>onLevelChange(e.target.value as Level)}>{levels.map(l=><option key={l}>{l}</option>)}</select></label>{loading?<span className="auth-loading" role="status">Loading…</span>:profile?<div className="account-header"><button className="account-header-user" onClick={onDashboard} aria-label={`Learning journey of ${profile.display_name}`}><UserRound size={18}/><span>{profile.display_name}<small>{profile.role==='teacher'?'Teacher':'My journey'}</small></span></button><button className="logout-button" aria-label="Log out" title="Log out" onClick={onLogout}><LogOut size={18}/></button></div>:<button className="button button-teal header-login" onClick={onLogin}><LogIn size={17}/><span>Log in</span></button>}</header>;
}

