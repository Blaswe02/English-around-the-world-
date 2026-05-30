import { Plane, ChevronRight, Globe, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ProgressCard } from './ProgressCard';
import type { CountryConfig, CountryStatus, Level, NavItem } from '../../types/curriculum';

interface DashboardHomeProps {
  level: Level;
  countries: CountryConfig[];
  currentCountry: CountryConfig;
  getCountryStatus: (country: CountryConfig) => CountryStatus;
  onCountryClick: (country: CountryConfig) => void;
  onNavigate: (nav: NavItem) => void;
}

export function DashboardHome({
  level,
  countries,
  currentCountry,
  getCountryStatus,
  onCountryClick,
  onNavigate,
}: DashboardHomeProps) {
  const completedCount = countries.filter(
    (c) => getCountryStatus(c) === 'completed',
  ).length;

  const totalLessons = countries.reduce(
    (sum, c) => sum + c.lessons.filter((l) => l.levels.includes(level)).length,
    0,
  );

  const currentLessons = currentCountry.lessons.filter((l) => l.levels.includes(level));

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto"
    >
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welkom terug!</h2>
        <p className="text-slate-500 mt-1 font-medium">
          Klaar om verder te reizen? Niveau:{' '}
          <strong className="text-slate-700">{level}</strong>
        </p>
      </div>

      {/* Top row: current destination + progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current destination card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div className="md:w-5/12 relative h-48 md:h-auto shrink-0">
            <img
              src={currentCountry.image}
              alt={currentCountry.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden md:block" />
          </div>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Plane className="w-4 h-4" />
              <span>Huidige bestemming</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {currentCountry.flag} {currentCountry.title}
            </h3>
            <p className="text-slate-500 mb-2 text-sm leading-relaxed">
              {currentCountry.description}
            </p>
            <p className="text-xs text-slate-400 mb-5">
              {currentLessons.length} les{currentLessons.length !== 1 ? 'sen' : ''} beschikbaar voor niveau {level}
            </p>
            <button
              onClick={() => {
                onCountryClick(currentCountry);
                onNavigate('eaatw');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 self-start"
            >
              Doorgaan met leren
            </button>
          </div>
        </div>

        {/* Progress */}
        <ProgressCard
          completedCount={completedCount}
          totalCountries={countries.length}
          totalLessons={totalLessons}
          level={level}
        />
      </div>

      {/* Countries overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Alle bestemmingen</h3>
          <button
            onClick={() => onNavigate('eaatw')}
            className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
          >
            Bekijk alle <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {countries.map((country) => {
            const status = getCountryStatus(country);
            const lessonCount = country.lessons.filter((l) => l.levels.includes(level)).length;
            const isUnavailable = status === 'locked' || status === 'future';
            return (
              <button
                key={country.id}
                onClick={() => {
                  onCountryClick(country);
                  if (!isUnavailable) onNavigate('eaatw');
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isUnavailable
                    ? 'border-slate-200 opacity-60 cursor-not-allowed'
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer'
                }`}
              >
                <div className="text-2xl mb-2">{country.flag}</div>
                <p className="font-bold text-sm text-slate-900">{country.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lessonCount > 0 ? `${lessonCount} lessen` : 'Geen lessen'}
                </p>
                <div
                  className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    status === 'completed'
                      ? 'text-emerald-600'
                      : status === 'current'
                        ? 'text-indigo-600'
                        : status === 'development'
                          ? 'text-amber-600'
                          : 'text-slate-400'
                  }`}
                >
                  {status === 'completed' && '✓ Voltooid'}
                  {status === 'current' && '→ Actief'}
                  {status === 'development' && '⚙ In ontwikkeling'}
                  {status === 'locked' && '🔒 Vergrendeld'}
                  {status === 'future' && '🔜 Binnenkort'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EAATW intro blurb */}
      <div className="mt-6 p-6 bg-indigo-50 rounded-2xl flex items-start gap-4">
        <Globe className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-indigo-900 mb-1">
            English Around The World — Haarlem College
          </p>
          <p className="text-sm text-indigo-700 leading-relaxed">
            In dit project reis je virtueel door Engelssprekende landen. Elke module heeft lessen,
            opdrachten, cultuurvocabulaire en een eigen dialect. Kies een land en begin je reis!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
