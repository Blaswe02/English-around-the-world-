import {
  Globe,
  LayoutDashboard,
  BarChart3,
  Settings,
  GraduationCap,
  Menu,
  ChevronRight,
  BookOpen,
  Stamp,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { NavItem } from '../../types/curriculum';

const NAV_ITEMS: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'eaatw', label: 'English Around The World', icon: Globe },
  { id: 'passport', label: 'Paspoort & Stempels', icon: Stamp },
  { id: 'teacher', label: 'Docentenoverzicht', icon: BookOpen },
  { id: 'progress', label: 'Voortgang', icon: BarChart3 },
  { id: 'settings', label: 'Instellingen', icon: Settings },
];

interface SidebarProps {
  activeNav: NavItem;
  isOpen: boolean;
  onNavChange: (nav: NavItem) => void;
  onToggle: () => void;
}

export function Sidebar({ activeNav, isOpen, onNavChange, onToggle }: SidebarProps) {
  return (
    <aside
      className={`${isOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 fixed h-full z-30`}
    >
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 h-20">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <p className="font-bold text-sm text-slate-900 whitespace-nowrap leading-tight">
              English Around The World
            </p>
            <p className="text-xs text-slate-400 whitespace-nowrap">Haarlem College</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                active
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}
              />
              {isOpen && (
                <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
              )}
              {active && isOpen && (
                <motion.div layoutId="activeNav" className="ml-auto">
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all"
          title={isOpen ? 'Menu inklappen' : 'Menu uitklappen'}
        >
          <Menu className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm font-medium">Menu inklappen</span>}
        </button>
      </div>
    </aside>
  );
}
