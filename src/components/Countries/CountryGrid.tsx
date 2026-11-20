
import { CountryCard } from './CountryCard';
import { DESTINATION_YEARS } from '../../data/countries';
import type { CountryConfig, CountryStatus, Level } from '../../types/curriculum';

interface Props {
  countries: CountryConfig[];
  level: Level;
  getCountryStatus: (country: CountryConfig) => CountryStatus;
  onCountryClick: (country: CountryConfig) => void;
}

export function CountryGrid({ countries, level, getCountryStatus, onCountryClick }: Props) {
  return <div className="travel-page">
    <div className="page-intro">
      <div><p className="eyebrow">YOUR WORLD IS WAITING</p><h1>Where does your story begin?</h1><p>Your destinations, year by year. Each stop is one school period.</p></div>
      <></>
    </div>
    {DESTINATION_YEARS.filter(group => level !== 'HAVO' || group.year <= 3).map(group => {
      const destinations = group.destinations.map(destination => countries.find(country => country.id === destination.id)).filter((country): country is CountryConfig => Boolean(country));
      if (!destinations.length) return null;
      return <section className="year-modules" key={group.year} aria-labelledby={`destination-year-${group.year}`}>
        <div className="section-heading"><div><p className="eyebrow">YOUR LEARNING JOURNEY</p><h2 id={`destination-year-${group.year}`}>Year {group.year}</h2></div><span className="year-access-count">{destinations.length} periods</span></div>
        <div className="destination-grid">{destinations.map((country, index) =>
          <CountryCard key={country.id} country={country} status={getCountryStatus(country)} level={level} index={index} onClick={() => onCountryClick(country)} />
        )}</div>
      </section>;
    })}
  </div>;
}
