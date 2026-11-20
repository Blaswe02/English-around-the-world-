import { Globe, BookOpen, Star } from 'lucide-react';
import type { Level } from '../../types/curriculum';

interface ProgressCardProps {
  completedCount: number;
  totalCountries: number;
  totalLessons: number;
  level: Level;
}

export function ProgressCard({
  completedCount,
  totalCountries,
  totalLessons,
  level,
}: ProgressCardProps) {
  const stats = [
    { label: 'Landen voltooid', value: `${completedCount} / ${totalCountries}`, icon: Globe },
    { label: 'Lessen voor niveau', value: `${totalLessons}`, icon: BookOpen },
    { label: 'Huidig niveau', value: level, icon: Star },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-4">
      <h4 className="font-bold text-slate-900 mb-2">Jouw voortgang</h4>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
        >
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            <p className="font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

