import { CheckCircle, Lock, Navigation, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { StatusBadge } from '../UI/StatusBadge';
import type { CountryConfig, CountryStatus, Level } from '../../types/curriculum';

interface CountryCardProps {
  country: CountryConfig;
  status: CountryStatus;
  level: Level;
  index: number;
  onClick: () => void;
}

export function CountryCard({ country, status, level, index, onClick }: CountryCardProps) {
  const lessonCount = country.lessons.filter((l) => l.levels.includes(level)).length;
  const isUnavailable = status === 'locked' || status === 'future';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl text-left transition-all duration-300 h-64 ${
        isUnavailable
          ? 'cursor-not-allowed grayscale-[0.4] opacity-75'
          : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      }`}
    >
      {/* Background image */}
      <div className="absolute inset-0 bg-slate-900">
        <img
          src={country.image}
          alt={country.title}
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="text-3xl">{country.flag}</span>
          <div
            className={`p-1.5 rounded-full backdrop-blur-md ${
              status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400'
                : status === 'current'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : status === 'development'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-500/20 text-slate-400'
            }`}
          >
            {status === 'completed' && <CheckCircle className="w-5 h-5" />}
            {status === 'current' && <Navigation className="w-5 h-5 fill-current" />}
            {(status === 'locked' || status === 'future') && <Lock className="w-5 h-5" />}
            {status === 'development' && <span className="text-sm font-bold px-1">→</span>}
          </div>
        </div>

        {/* Bottom info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400 text-xs font-medium">{country.region}</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{country.title}</h3>
          <p className="text-slate-300 text-sm mt-0.5">{country.subtitle}</p>

          <div className="flex items-center gap-2 mt-3">
            <StatusBadge status={status} />
            {lessonCount > 0 && (
              <span className="text-xs text-slate-400 font-medium bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                {lessonCount} les{lessonCount !== 1 ? 'sen' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
