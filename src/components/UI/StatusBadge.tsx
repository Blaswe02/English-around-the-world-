import type { CountryStatus } from '../../types/curriculum';

const STATUS_CONFIG: Record<
  CountryStatus,
  { label: string; className: string }
> = {
  completed: {
    label: 'Completed',
    className: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
  },
  current: {
    label: 'Active',
    className: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
  },
  development: {
    label: 'In development',
    className: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
  },
  locked: {
    label: 'Locked',
    className: 'border-slate-500/30 text-slate-300 bg-slate-500/10',
  },
  future: {
    label: 'Coming soon',
    className: 'border-slate-500/30 text-slate-300 bg-slate-500/10',
  },
};

interface StatusBadgeProps {
  status: CountryStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}


