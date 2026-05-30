import { ExternalLink, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { LESSON_TYPE_LABELS, LESSON_TYPE_COLORS, SKILL_LABELS, SKILL_COLORS } from '../../data/lessonTypes';
import type { Lesson, Level } from '../../types/curriculum';

interface LessonCardProps {
  lesson: Lesson;
  level: Level;
  index: number;
  onClick: () => void;
}

export function LessonCard({ lesson, level, index, onClick }: LessonCardProps) {
  const isForLevel = lesson.levels.includes(level);
  const isAvailable = !!lesson.url && isForLevel;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={onClick}
      className={`group p-6 bg-white border rounded-3xl text-left transition-all ${
        !isForLevel
          ? 'border-slate-200 opacity-50 cursor-not-allowed'
          : isAvailable
            ? 'border-slate-200 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
            : 'border-slate-200 hover:border-slate-300 cursor-pointer'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <span className="text-3xl shrink-0">{lesson.icon}</span>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 leading-snug">{lesson.title}</h4>
            {isAvailable ? (
              <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            ) : !isForLevel ? (
              <span className="text-xs text-slate-400 shrink-0 mt-0.5">Ander niveau</span>
            ) : (
              <span className="text-xs text-slate-400 shrink-0 mt-0.5">Binnenkort</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{lesson.description}</p>

          {/* Type + time */}
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${LESSON_TYPE_COLORS[lesson.type]}`}
            >
              {LESSON_TYPE_LABELS[lesson.type]}
            </span>
            {lesson.estimatedTime && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {lesson.estimatedTime}
              </span>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {lesson.skills.map((skill) => (
              <span
                key={skill}
                className={`text-xs font-medium px-2 py-0.5 rounded-md border ${SKILL_COLORS[skill]}`}
              >
                {SKILL_LABELS[skill]}
              </span>
            ))}
          </div>

          {/* Level badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {lesson.levels.map((lvl) => (
              <span
                key={lvl}
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  lvl === level
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                {lvl}
              </span>
            ))}
          </div>

          {/* Output */}
          {lesson.output && isForLevel && (
            <p className="mt-3 text-xs text-slate-400 italic">
              Output: {lesson.output}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
