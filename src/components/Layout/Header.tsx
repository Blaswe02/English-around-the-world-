import { Search, User } from 'lucide-react';
import { LevelSelector } from '../UI/LevelSelector';
import type { Level } from '../../types/curriculum';

interface HeaderProps {
  level: Level;
  levels: Level[];
  onLevelChange: (level: Level) => void;
}

export function Header({ level, levels, onLevelChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center px-8 sticky top-0 z-20">
      <div className="flex-1 flex items-center gap-6">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek lessen, woordenschat..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <LevelSelector levels={levels} current={level} onChange={onLevelChange} />

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Student</p>
            <p className="text-xs font-bold text-indigo-600">Niveau: {level}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
