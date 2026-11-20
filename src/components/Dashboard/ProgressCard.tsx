
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
    { label: 'Landen voltooid', value: `${completedCount} / ${totalCountries}` },
    { label: 'Lessons for level', value: `${totalLessons}` },
    { label: 'Huidig niveau', value: level },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-4">
      <h4 className="font-bold text-slate-900 mb-2">Your progress</h4>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
        >
          
          <div>
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            <p className="font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}


