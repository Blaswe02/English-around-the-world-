import { useState } from 'react';

import { motion } from 'motion/react';
import { DestinationMaterials } from './DestinationMaterials';
import { LessonCard } from './LessonCard';
import { DEFAULT_PASSPORT_GATES, STAMP_ICONS, STAMP_LABELS, STAMP_COLORS } from '../../data/passport';
import type { CountryConfig, Lesson, Level } from '../../types/curriculum';

type DetailTab = 'lessons' | 'handouts' | 'extra' | 'passport' | 'teacher';

interface CountryDetailProps {
  isTeacher?: boolean;
  country: CountryConfig;
  level: Level;
  isLessonComplete: (countryId: string, lessonId: string) => boolean;
  onBack: () => void;
  onLessonClick: (lesson: Lesson) => void;
}

export function CountryDetail({ country, level, isTeacher=false, isLessonComplete, onBack, onLessonClick }: CountryDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('lessons');

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'lessons', label: 'Lessons' },
    { id: 'handouts', label: 'Keyterms & handouts' },
    { id: 'extra', label: 'Extra materials' },
    { id: 'passport', label: 'Passport' },
    { id: 'teacher', label: 'Teacher' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-6 transition-colors"
      >
        <></>
        All destinations
      </button>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-60 mb-8">
        <img
          src={country.image}
          alt={country.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex items-end gap-4">
            
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <></>
                <span>{country.region}</span>
                <span className="text-slate-500">·</span>
                <span>{country.dialectFocus}</span>
              </div>
              <h2 className="text-3xl font-bold text-white">{country.title}</h2>
              <p className="text-slate-300 text-sm">{country.subtitle}</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed mt-3">
            {country.description}
          </p>
        </div>
      </div>

      {/* Level notice */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50 rounded-xl">
        <></>
        <span className="text-sm font-semibold text-indigo-700">
          Lessons for <strong>{level}</strong>. Your teacher assigns your level and opens your destinations.
        </span>
      </div>

      {/* Tabs */}
      <div className="lesson-tabs flex gap-2 mb-6 border-b border-slate-200 pb-1">
        {tabs.filter(tab=>tab.id!=='teacher'||isTeacher).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 -mb-px'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Lessons Tab ── */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {country.lessons.filter(l => isTeacher || l.levels.includes(level)).map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              level={level}
              index={i}
              isComplete={isLessonComplete(country.id, lesson.id)}
              onClick={() => onLessonClick(lesson)}
            />
          ))}
        </div>
      )}

      {(activeTab==='handouts'||activeTab==='extra')&&<DestinationMaterials key={activeTab} countryId={country.id} countryTitle={country.title} category={activeTab==='handouts'?'handout':'extra'} level={level} isTeacher={isTeacher}/>}
      {/* ── Passport Tab ── */}
      {activeTab === 'passport' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Cultural Passport — {country.title}
            </h3>
            <p className="text-sm text-slate-500">
              Each gate has a task. Your teacher awards a passport stamp when you complete it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_PASSPORT_GATES.map((gate, i) => (
              <div
                key={i}
                className="p-5 bg-white border border-slate-200 rounded-2xl opacity-60"
              >
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{gate.title}</h4>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STAMP_COLORS[gate.stampType]}`}
                      >
                        {STAMP_LABELS[gate.stampType]}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 font-semibold mb-1">{gate.domain}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {gate.missionObjective}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>Input: {gate.inputType}</span>
                      <span>Output: {gate.outputType}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400 text-center">
            Passport tasks are being developed. Your teacher will guide you.
          </p>
        </div>
      )}

      {/* ── Teacher Tab ── */}
      {activeTab === 'teacher' && isTeacher && (
        <div className="space-y-6">
          <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
            <h3 className="font-bold text-amber-800 mb-1 text-sm">Curriculum overview</h3>
            <p className="text-xs text-amber-700">
              This section is for teachers.
            </p>
          </div>

          {country.teacherNotes && (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2 text-sm">Teacher notes</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{country.teacherNotes}</p>
            </div>
          )}

          <div className="p-6 bg-white border border-slate-200 rounded-2xl">
            <h4 className="font-bold text-slate-900 mb-3 text-sm">Curriculum focus</h4>
            <div className="flex flex-wrap gap-2">
              {country.curriculumFocus.map((focus) => (
                <span
                  key={focus}
                  className="text-xs font-medium px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-full"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {country.portfolioOutputs && country.portfolioOutputs.length > 0 && (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Portfolio outputs</h4>
              <ul className="space-y-2">
                {country.portfolioOutputs.map((output, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6 bg-white border border-slate-200 rounded-2xl">
            <h4 className="font-bold text-slate-900 mb-3 text-sm">
              Lessons with teacher notes
            </h4>
            <div className="space-y-3">
              {country.lessons
                .filter((l) => l.teacherNote)
                .map((lesson) => (
                  <div key={lesson.id} className="flex items-start gap-3">
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{lesson.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        {lesson.teacherNote}
                      </p>
                    </div>
                  </div>
                ))}
              {country.lessons.filter((l) => l.teacherNote).length === 0 && (
                <p className="text-sm text-slate-400">
                  No teacher notes are available for this module.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}


