import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VocabItem {
  word: string;
  translation: string;
  emoji?: string;
  example?: string;
}

interface QuizQ {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface VocabularyLessonProps {
  title: string;
  intro: string;
  vocab: VocabItem[];
  quiz?: QuizQ[];
  onComplete: () => void;
}

export function VocabularyLesson({ title, intro, vocab, quiz, onComplete }: VocabularyLessonProps) {
  const [phase, setPhase] = useState<'cards' | 'quiz' | 'done'>('cards');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const card = vocab[cardIndex];
  const question = quiz?.[quizIndex];
  const progress = ((cardIndex) / vocab.length) * 100;

  const nextCard = () => {
    setFlipped(false);
    if (cardIndex < vocab.length - 1) {
      setCardIndex((i) => i + 1);
    } else {
      setPhase(quiz && quiz.length > 0 ? 'quiz' : 'done');
    }
  };

  const prevCard = () => {
    setFlipped(false);
    if (cardIndex > 0) setCardIndex((i) => i - 1);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question?.correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    if (quiz && quizIndex < quiz.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      setPhase('done');
    }
  };

  // ── Flashcard phase ──────────────────────────────────────────────────────────
  if (phase === 'cards') {
    return (
      <div className="max-w-xl mx-auto">
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{intro}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-medium shrink-0">
            {cardIndex + 1} / {vocab.length}
          </span>
        </div>

        {/* Flashcard */}
        <div
          className="cursor-pointer select-none"
          onClick={() => setFlipped((f) => !f)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cardIndex}-${flipped}`}
              initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`rounded-3xl border-2 p-10 text-center min-h-52 flex flex-col items-center justify-center gap-4 transition-colors ${
                flipped
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              {!flipped ? (
                <>
                  <span className="text-5xl">{card.emoji}</span>
                  <h3 className="text-2xl font-bold text-slate-900">{card.word}</h3>
                  <p className="text-xs text-slate-400">Tik om te draaien →</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-indigo-700 leading-snug">
                    {card.translation}
                  </p>
                  {card.example && (
                    <p className="text-sm text-slate-500 italic mt-2 max-w-xs leading-relaxed">
                      "{card.example}"
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3">Tik op de kaart om de vertaling te zien</p>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevCard}
            disabled={cardIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Vorige
          </button>
          <button
            onClick={() => { setCardIndex(0); setFlipped(false); }}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"
            title="Opnieuw"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={nextCard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all"
          >
            {cardIndex < vocab.length - 1 ? 'Volgende' : quiz && quiz.length > 0 ? 'Quiz →' : 'Klaar →'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz phase ───────────────────────────────────────────────────────────────
  if (phase === 'quiz' && question) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Quiz — vraag {quizIndex + 1} van {quiz!.length}
          </span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${((quizIndex) / quiz!.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 leading-snug">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correct;
              const showResult = selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium text-sm transition-all ${
                    showResult
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-800'
                  }`}
                >
                  <span className="font-bold mr-3 text-slate-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 bg-slate-50 rounded-2xl"
            >
              <p className={`text-sm font-semibold mb-1 ${selected === question.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                {selected === question.correct ? '✓ Goed!' : '✗ Niet helemaal...'}
              </p>
              {question.explanation && (
                <p className="text-sm text-slate-600 leading-relaxed">{question.explanation}</p>
              )}
              <button
                onClick={nextQuestion}
                className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all"
              >
                {quizIndex < quiz!.length - 1 ? 'Volgende vraag →' : 'Resultaat bekijken →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // ── Done phase ───────────────────────────────────────────────────────────────
  const passed = !quiz || quiz.length === 0 || score >= Math.ceil(quiz.length * 0.6);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center"
    >
      <div className={`w-20 h-20 ${passed ? 'bg-emerald-50' : 'bg-amber-50'} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
        <CheckCircle className={`w-10 h-10 ${passed ? 'text-emerald-500' : 'text-amber-500'}`} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        {passed ? 'Les voltooid! 🎉' : 'Goed geprobeerd!'}
      </h3>
      {quiz && quiz.length > 0 && (
        <p className="text-slate-500 mb-2">
          Score: <strong className="text-slate-900">{score} / {quiz.length}</strong>
        </p>
      )}
      <p className="text-slate-500 mb-8 leading-relaxed">
        {passed
          ? 'Je voortgang is opgeslagen. Je kunt doorgaan naar de volgende les.'
          : 'Probeer de les nog een keer om je score te verbeteren.'}
      </p>
      <div className="flex gap-3 justify-center">
        {!passed && (
          <button
            onClick={() => { setPhase('cards'); setCardIndex(0); setFlipped(false); setQuizIndex(0); setSelected(null); setScore(0); }}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            Opnieuw proberen
          </button>
        )}
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200"
        >
          {passed ? 'Verder →' : 'Toch doorgaan'}
        </button>
      </div>
    </motion.div>
  );
}
