import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, Settings } from 'lucide-react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { CountryGrid } from './components/Countries/CountryGrid';
import { CountryDetail } from './components/Countries/CountryDetail';
import { PassportOverview } from './components/Passport/PassportOverview';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { Modal } from './components/UI/Modal';
import { COUNTRIES, LEVELS } from './data/countries';
import type { Level, NavItem, CountryConfig, CountryStatus, Lesson } from './types/curriculum';

export default function App() {
  const [level, setLevel] = useState<Level>('BASIS');
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(null);
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);

  const getCountryStatus = (country: CountryConfig): CountryStatus => {
    const completed =
      localStorage.getItem(`eaatw_${country.id}_completed_${level}`) === 'true';
    return completed ? 'completed' : country.status;
  };

  const handleCountryClick = (country: CountryConfig) => {
    const status = getCountryStatus(country);
    if (status === 'locked' || status === 'future') {
      setModal({
        title: 'Nog niet ontgrendeld',
        message: `De ${country.title} module is nog niet beschikbaar. Rond de huidige module af om verder te reizen!`,
      });
      return;
    }
    setSelectedCountry(country);
    setActiveNav('eaatw');
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.levels.includes(level)) {
      setModal({
        title: 'Niet beschikbaar voor dit niveau',
        message: `Deze les is beschikbaar voor: ${lesson.levels.join(', ')}. Wissel van niveau in de header.`,
      });
      return;
    }
    if (!lesson.url) {
      setModal({
        title: 'Binnenkort beschikbaar',
        message: `"${lesson.title}" wordt momenteel ontwikkeld. Kom snel terug!`,
      });
      return;
    }
    window.open(lesson.url, '_blank', 'noopener,noreferrer');
  };

  const handleNavChange = (nav: NavItem) => {
    setActiveNav(nav);
    setSelectedCountry(null);
  };

  const currentCountry = COUNTRIES.find((c) => c.status === 'current') ?? COUNTRIES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex">
      <Sidebar
        activeNav={activeNav}
        isOpen={isSidebarOpen}
        onNavChange={handleNavChange}
        onToggle={() => setIsSidebarOpen((o) => !o)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}
      >
        <Header level={level} levels={LEVELS} onLevelChange={setLevel} />

        <main className="p-8">
          <AnimatePresence mode="wait">
            {activeNav === 'dashboard' && (
              <DashboardHome
                key="dashboard"
                level={level}
                countries={COUNTRIES}
                currentCountry={currentCountry}
                getCountryStatus={getCountryStatus}
                onCountryClick={handleCountryClick}
                onNavigate={handleNavChange}
              />
            )}

            {activeNav === 'eaatw' && !selectedCountry && (
              <CountryGrid
                key="eaatw-grid"
                countries={COUNTRIES}
                level={level}
                getCountryStatus={getCountryStatus}
                onCountryClick={handleCountryClick}
              />
            )}

            {activeNav === 'eaatw' && selectedCountry && (
              <CountryDetail
                key={`country-${selectedCountry.id}`}
                country={selectedCountry}
                level={level}
                onBack={() => setSelectedCountry(null)}
                onLessonClick={handleLessonClick}
              />
            )}

            {activeNav === 'passport' && (
              <PassportOverview
                key="passport"
                countries={COUNTRIES}
                level={level}
                getCountryStatus={getCountryStatus}
              />
            )}

            {activeNav === 'teacher' && (
              <TeacherDashboard key="teacher" countries={COUNTRIES} level={level} />
            )}

            {(activeNav === 'progress' || activeNav === 'settings') && (
              <PlaceholderPage key={activeNav} navId={activeNav} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {modal && (
        <Modal title={modal.title} message={modal.message} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function PlaceholderPage({ navId }: { navId: string }) {
  const config: Record<string, { label: string; icon: React.ElementType }> = {
    progress: { label: 'Voortgang', icon: BarChart3 },
    settings: { label: 'Instellingen', icon: Settings },
  };
  const { label, icon: Icon } = config[navId] ?? { label: navId, icon: BarChart3 };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
        <Icon className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{label}</h2>
      <p className="text-slate-500 max-w-md">
        Deze sectie wordt momenteel ontwikkeld. Kom snel terug!
      </p>
    </motion.div>
  );
}
