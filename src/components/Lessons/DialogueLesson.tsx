import { useState } from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DialogueLine {
  speaker: string;
  text: string;
}

interface DialogueQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface Dialogue {
  id: string;
  title: string;
  lines: DialogueLine[];
  questions: DialogueQuestion[];
}

interface DialogueLessonProps {
  title: string;
  intro: string;
  dialogues: Dialogue[];
  onComplete: () => void;
}

export function DialogueLesson({ title, intro, dialogues, onComplete }: DialogueLessonProps) {
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [phase, setPhase] = useState<'read' | 'quiz' | 'done'>('read');
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const dialogue = dialogues[dialogueIdx];

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (answers[qIdx] !== undefined && answers[qIdx] !== null) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = aIdx;
    setAnswers(newAnswers);
    if (aIdx === dialogue.questions[qIdx].correct) setScore((s) => s + 1);
  };

  const goNext = () => {
    if (dialogueIdx < dialogues.length - 1) {
      setDialogueIdx((i) => i + 1);
      setPhase('read');
      setAnswers([]);
    } else {
      setAllDone(true);
    }
  };

  const allAnswered = dialogue.questions.every((_, i) => answers[i] !== undefined && answers[i] !== null);

  if (allDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Dialogen voltooid! 🎉</h3>
        <p className="text-slate-500 mb-8">
          Score: <strong className="text-slate-900">{score}</strong> van alle vragen goed.
        </p>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200"
        >
          Les afronden →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{intro}</p>

      {dialogues.length > 1 && (
        <div className="flex gap-2 mb-6">
          {dialogues.map((d, i) => (
            <span
              key={d.id}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                i === dialogueIdx
                  ? 'bg-indigo-600 text-white'
                  : i < dialogueIdx
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}

      {/* Dialogue */}
      {phase === 'read' && (
        <motion.div key={`read-${dialogueIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-900 text-sm">{dialogue.title}</h3>
            </div>
            <div className="space-y-3">
              {dialogue.lines.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${line.speaker === 'Tourist' || line.speaker === 'Local' ? '' : ''}`}
                >
                  <span className="text-xs font-bold text-indigo-600 w-20 shrink-0 pt-1">
                    {line.speaker}:
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">
                    "{line.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all"
          >
            Answer the questions →
          </button>
        </motion.div>
      )}

      {/* Quiz */}
      {phase === 'quiz' && (
        <motion.div key={`quiz-${dialogueIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="space-y-6">
            {dialogue.questions.map((q, qi) => (
              <div key={qi} className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="font-semibold text-slate-900 mb-3 text-sm">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, ai) => {
                    const answered = answers[qi] !== null && answers[qi] !== undefined;
                    const isSelected = answers[qi] === ai;
                    const isCorrect = ai === q.correct;
                    return (
                      <button
                        key={ai}
                        onClick={() => handleAnswer(qi, ai)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          answered
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : isSelected
                                ? 'bg-rose-50 border-rose-400 text-rose-800'
                                : 'bg-white border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {allAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={goNext}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              {dialogueIdx < dialogues.length - 1 ? 'Next dialogue →' : 'Finish →'}
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}


