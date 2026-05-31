import { useState } from 'react';
import { ChevronLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { VocabularyLesson } from './VocabularyLesson';
import { DialogueLesson } from './DialogueLesson';
import { markLessonComplete } from '../../services/progress';
import { hawkerVocab, hawkerQuiz } from '../../lessons/singapore/hawkerData';
import { singlishPhrases, singlishQuiz } from '../../lessons/singapore/singlishData';
import { mrtVocab, mrtDialogue } from '../../lessons/singapore/mrtData';
import type { Lesson, Level } from '../../types/curriculum';

interface LessonPlayerProps {
  lesson: Lesson;
  countryId: string;
  level: Level;
  onBack: () => void;
}

// Map internalLessonId → component renderer
function renderInlineLesson(
  lessonId: string,
  onComplete: () => void,
): React.ReactNode {
  switch (lessonId) {
    case 'sg-hawker-inline':
      return (
        <VocabularyLesson
          title="Hawker Culture Vocabulary"
          intro="Singapore's hawker centres are famous all over the world. Learn the most important dishes and food words before you visit!"
          vocab={hawkerVocab}
          quiz={hawkerQuiz}
          onComplete={onComplete}
        />
      );
    case 'sg-singlish-inline':
      return (
        <VocabularyLesson
          title="Singlish — Singapore's Unique Dialect"
          intro="Singlish is a mix of English, Malay, Tamil and Mandarin. It's not wrong English — it's a real dialect with its own rules. Learn the most common expressions!"
          vocab={singlishPhrases}
          quiz={singlishQuiz}
          onComplete={onComplete}
        />
      );
    case 'sg-mrt-inline':
      return (
        <DialogueLesson
          title="Getting Around by MRT"
          intro="Read the dialogues, then answer the comprehension questions. Pay attention to how people ask for help and give directions in Singapore."
          dialogues={mrtDialogue}
          onComplete={onComplete}
        />
      );
    default:
      return null;
  }
}

export function LessonPlayer({ lesson, countryId, level, onBack }: LessonPlayerProps) {
  const [completed, setCompleted] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const handleComplete = async () => {
    await markLessonComplete(countryId, lesson.id, level);
    setCompleted(true);
  };

  const isInline = !!lesson.internalLessonId;
  const isExternal = !!lesson.url;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Terug
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{lesson.icon}</span>
            <h2 className="text-xl font-bold text-slate-900">{lesson.title}</h2>
            {completed && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
          </div>
          <p className="text-sm text-slate-500 mt-0.5 ml-9">{lesson.description}</p>
        </div>
        {isExternal && (
          <a
            href={lesson.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Nieuw venster
          </a>
        )}
      </div>

      {/* Completed banner */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Les voltooid!</p>
            <p className="text-xs text-emerald-600">Je voortgang is opgeslagen.</p>
          </div>
          <button
            onClick={onBack}
            className="ml-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Terug naar module
          </button>
        </motion.div>
      )}

      {/* Inline lesson */}
      {isInline && !completed && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          {renderInlineLesson(lesson.internalLessonId!, handleComplete)}
        </div>
      )}

      {/* External iframe */}
      {isExternal && !isInline && !iframeError && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-slate-400 ml-2 font-mono truncate max-w-xs">
                {lesson.url}
              </span>
            </div>
            {!completed && (
              <button
                onClick={handleComplete}
                className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                ✓ Markeer als klaar
              </button>
            )}
          </div>
          <iframe
            src={lesson.url}
            title={lesson.title}
            className="w-full h-[70vh] border-0"
            onError={() => setIframeError(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      )}

      {/* Iframe blocked fallback */}
      {isExternal && !isInline && iframeError && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Les opent in een nieuw venster
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Deze les kan niet ingeklapt worden. Klik hieronder om hem in een nieuw tabblad te openen.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              Open les →
            </a>
            {!completed && (
              <button
                onClick={handleComplete}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-all"
              >
                ✓ Markeer als klaar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
