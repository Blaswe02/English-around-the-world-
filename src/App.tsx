import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, Settings } from 'lucide-react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { CountryGrid } from './components/Countries/CountryGrid';
import { CountryDetail } from './components/Countries/CountryDetail';
import { LessonPlayer } from './components/Lessons/LessonPlayer';
import { PassportOverview } from './components/Passport/PassportOverview';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { Modal } from './components/UI/Modal';
import { NicknameModal } from './components/UI/NicknameModal';
import { COUNTRIES, LEVELS } from './data/countries';
import {
  getSessionKey,
  setSessionKey,
  isLocallyComplete,
  loadProgressFromSupabase,
} from './services/progress';
import type { Level, NavItem, CountryConfig, CountryStatus, Lesson } from './types/curriculum';

export default function App() {
  const [level, setLevel] = useState<Level>('BASIS');
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);
  const [showNickname, setShowNickname] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Show nickname modal if no session key yet
  useEffect(() => {
    if (!getSessionKey()) setShowNickname(true);
  }, []);

  // Load progress from Supabase on mount and level change
  useEffect(() => {
    loadProgressFromSupabase(level).then(setCompletedLessons);
  }, [level]);

  const handleNickname = (nickname: string) => {
    setSessionKey(nickname);
    setShowNickname(false);
    loadProgressFromSupabase(level).then(setCompletedLessons);
  };

  const isLessonComplete = (countryId: string, lessonId: string): boolean => {
    return (
      completedLessons.has(`${countryId}__${lessonId}`) ||
      isLocallyComplete(countryId, lessonId, level)
    );
  };

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
    setSelectedLesson(null);
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
    const hasContent = lesson.url || lesson.internalLessonId;
    if (!hasContent) {
      setModal({
        title: 'Binnenkort beschikbaar',
        message: `"${lesson.title}" wordt momenteel ontwikkeld. Kom snel terug!`,
      });
      return;
    }
    // Open external links in new tab if no iframe/inline support
    if (lesson.url && !lesson.internalLessonId) {
      window.open(lesson.url, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleNavChange = (nav: NavItem) => {
    setActiveNav(nav);
    setSelectedCountry(null);
    setSelectedLesson(null);
  };

  const handleLessonBack = () => {
    setSelectedLesson(null);
    // Refresh progress after returning from a lesson
    loadProgressFromSupabase(level).then(setCompletedLessons);
  };

  const currentCountry = COUNTRIES.find((c) => c.status === 'current') ?? COUNTRIES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex">
      {showNickname && <NicknameModal onConfirm={handleNickname} />}

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

            {/* ── Lesson player (takes over full content area) ── */}
            {activeNav === 'eaatw' && selectedCountry && selectedLesson && (
              <LessonPlayer
                key={`lesson-${selectedLesson.id}`}
                lesson={selectedLesson}
                countryId={selectedCountry.id}
                level={level}
                onBack={handleLessonBack}
              />
            )}

            {activeNav === 'dashboard' && !selectedLesson && (
              <DashboardHome
                key="dashboard"
                level={level}
                countries={COUNTRIES}
                currentCountry={currentCountry}
                getCountryStatus={getCountryStatus}
                isLessonComplete={isLessonComplete}
                onCountryClick={handleCountryClick}
                onNavigate={handleNavChange}
              />
            )}

            {activeNav === 'eaatw' && !selectedCountry && !selectedLesson && (
              <CountryGrid
                key="eaatw-grid"
                countries={COUNTRIES}
                level={level}
                getCountryStatus={getCountryStatus}
                onCountryClick={handleCountryClick}
              />
            )}

            {activeNav === 'eaatw' && selectedCountry && !selectedLesson && (
              <CountryDetail
                key={`country-${selectedCountry.id}`}
                country={selectedCountry}
                level={level}
                isLessonComplete={isLessonComplete}
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

            {(activeNav === 'progress' || activeNav === 'settings') && !selectedLesson && (
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
