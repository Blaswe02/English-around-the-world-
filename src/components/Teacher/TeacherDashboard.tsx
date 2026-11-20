import { motion } from 'motion/react';
import { BookMarked, Users, Target, FileText } from 'lucide-react';
import { SKILL_LABELS, SKILL_COLORS } from '../../data/lessonTypes';
import type { CountryConfig, Level, CountryStatus } from '../../types/curriculum';

interface TeacherDashboardProps {
  countries: CountryConfig[];
  level: Level;
}

const STATUS_LABEL: Record<CountryStatus, string> = {
  completed: 'Prototype / Archive',
  current: 'Active — current module',
  development: 'In development',
  locked: 'Planned',
  future: 'Future expansion',
};

const STATUS_COLOR: Record<CountryStatus, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  current: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  development: 'bg-amber-50 text-amber-700 border-amber-100',
  locked: 'bg-slate-50 text-slate-600 border-slate-200',
  future: 'bg-slate-50 text-slate-500 border-slate-200',
};

export function TeacherDashboard({ countries, level }: TeacherDashboardProps) {
  return (
    <motion.div
      key="teacher"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <BookMarked className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Curriculum overview
          </h2>
        </div>
        <p className="text-slate-500 mt-1 font-medium">
          Curriculum map — English Around The World — Haarlem College
        </p>
      </div>

      {/* Notice */}
      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl mb-8">
        <p className="text-sm text-amber-700 font-medium">
          This overview is for teachers. Explore the lesson structure, skills, portfolio
          outputs and teacher notes for each module. Content is still being developed.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total modules',
            value: countries.length,
            icon: Target,
            color: 'bg-indigo-50 text-indigo-600',
          },
          {
            label: 'Modules with content',
            value: countries.filter((c) => c.status === 'current' || c.status === 'completed').length,
            icon: Users,
            color: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Lessons (level)',
            value: countries.reduce(
              (sum, c) => sum + c.lessons.filter((l) => l.levels.includes(level)).length,
              0,
            ),
            icon: BookMarked,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Portfolio outputs',
            value: countries.reduce((sum, c) => sum + (c.portfolioOutputs?.length ?? 0), 0),
            icon: FileText,
            color: 'bg-purple-50 text-purple-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Module table */}
      <div className="space-y-6">
        {countries.map((country) => {
          const lessonsForLevel = country.lessons.filter((l) => l.levels.includes(level));
          const allSkills = [
            ...new Set(country.lessons.flatMap((l) => l.skills)),
          ];

          return (
            <div
              key={country.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden"
            >
              {/* Country header */}
              <div className="flex items-center gap-4 p-6 border-b border-slate-100">
                <span className="text-3xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{country.title}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[country.status]}`}
                    >
                      {STATUS_LABEL[country.status]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {country.subtitle} · {country.region} · Dialect: {country.dialectFocus}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-slate-900">{lessonsForLevel.length}</p>
                  <p className="text-xs text-slate-400">lessons ({level})</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills covered */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Skills in module
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {allSkills.map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs font-medium px-2 py-0.5 rounded-md border ${SKILL_COLORS[skill]}`}
                      >
                        {SKILL_LABELS[skill]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio outputs */}
                {country.portfolioOutputs && country.portfolioOutputs.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Portfolio outputs
                    </p>
                    <ul className="space-y-1">
                      {country.portfolioOutputs.map((output, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-1.5">
                          <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Teacher notes */}
                {country.teacherNotes && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Teacher notes
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">
                      {country.teacherNotes}
                    </p>
                  </div>
                )}

                {/* Lesson list */}
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Lessons for level {level}
                  </p>
                  {lessonsForLevel.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lessonsForLevel.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                        >
                          <span className="text-xl shrink-0">{lesson.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {lesson.title}
                            </p>
                            {lesson.output && (
                              <p className="text-xs text-slate-400 truncate">→ {lesson.output}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No lessons available for level {level}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
        <p className="text-sm text-slate-500 leading-relaxed">
          <strong className="text-slate-700">CEFR levels:</strong> BASIS = pre-A2, KADER = A2,
          MAVO = A2–B1, HAVO = B1. Change the level in the header to preview different versions.
          Teacher notes describe the intended learning activities.
        </p>
      </div>
    </motion.div>
  );
}


