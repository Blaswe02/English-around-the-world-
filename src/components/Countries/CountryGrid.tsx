import { motion } from 'motion/react';
import { CountryCard } from './CountryCard';
import type { CountryConfig, CountryStatus, Level } from '../../types/curriculum';

interface CountryGridProps {
  countries: CountryConfig[];
  level: Level;
  getCountryStatus: (country: CountryConfig) => CountryStatus;
  onCountryClick: (country: CountryConfig) => void;
}

export function CountryGrid({
  countries,
  level,
  getCountryStatus,
  onCountryClick,
}: CountryGridProps) {
  return (
    <motion.div
      key="eaatw-list"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          English Around The World
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          Ontdek Engelse dialecten en culturen over de hele wereld.{' '}
          <strong className="text-slate-700">Niveau: {level}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {countries.map((country, index) => (
          <CountryCard
            key={country.id}
            country={country}
            status={getCountryStatus(country)}
            level={level}
            index={index}
            onClick={() => onCountryClick(country)}
          />
        ))}
      </div>
    </motion.div>
  );
}
