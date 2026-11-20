import { motion } from 'motion/react';
import { Stamp } from 'lucide-react';
import { STAMP_ICONS, STAMP_LABELS, STAMP_COLORS } from '../../data/passport';
import type { CountryConfig, CountryStatus, Level, StampType } from '../../types/curriculum';

interface PassportOverviewProps {
  countries: CountryConfig[];
  level: Level;
  getCountryStatus: (country: CountryConfig) => CountryStatus;
}

const ALL_STAMPS: StampType[] = ['fact', 'taste', 'story', 'heritage', 'diplomat', 'archive'];

export function PassportOverview({ countries, level, getCountryStatus }: PassportOverviewProps) {
  const activeCountries = countries.filter(
    (c) => getCountryStatus(c) !== 'locked' && getCountryStatus(c) !== 'future',
  );

  return (
    <motion.div
      key="passport"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Jouw Cultureel Paspoort
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Verdien stempels door gates te voltooien. Elke gate is een mijlpaal in jouw reis.
        </p>
      </div>

      {/* Passport book visual */}
      <div className="bg-indigo-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🌍</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-1">
              Haarlem College
            </p>
            <h3 className="text-2xl font-bold">English Around The World</h3>
            <p className="text-indigo-200 text-sm">Cultureel Paspoort — Niveau {level}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ALL_STAMPS.map((stamp) => (
            <div
              key={stamp}
              className="bg-white/10 border border-white/20 rounded-2xl p-3 text-center opacity-40"
              title={STAMP_LABELS[stamp]}
            >
              <span className="text-2xl block mb-1">{STAMP_ICONS[stamp]}</span>
              <p className="text-xs text-indigo-100 font-semibold leading-tight">
                {STAMP_LABELS[stamp].replace(' Stamp', '')}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-indigo-200 text-center">
          Stempels worden actief zodra de passport gates beschikbaar zijn.
        </p>
      </div>

      {/* Country gates overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Gates per land</h3>
        {activeCountries.map((country) => (
          <div
            key={country.id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{country.flag}</span>
              <div>
                <h4 className="font-bold text-slate-900">{country.title}</h4>
                <p className="text-xs text-slate-400">{country.dialectFocus}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ALL_STAMPS.map((stamp) => (
                <div
                  key={stamp}
                  className={`border rounded-xl p-2 text-center opacity-40 ${STAMP_COLORS[stamp]}`}
                >
                  <span className="text-lg block">{STAMP_ICONS[stamp]}</span>
                  <p className="text-xs font-medium leading-tight mt-0.5 hidden sm:block">
                    {STAMP_LABELS[stamp].replace(' Stamp', '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-2xl flex items-start gap-4">
        <Stamp className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-500 leading-relaxed">
          Het passport systeem wordt binnenkort gelanceerd. Elke gate geeft een stempel na het
          voltooien van de bijbehorende taak. Verzamel alle 6 stempels per land om je
          portfolio te completeren.
        </p>
      </div>
    </motion.div>
  );
}

