import type { Level } from '../../types/curriculum';

interface LevelSelectorProps {
  levels: Level[];
  current: Level;
  onChange: (level: Level) => void;
}

export function LevelSelector({ levels, current, onChange }: LevelSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
      {levels.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            current === l
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
