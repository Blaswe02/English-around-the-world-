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
  initialComplete: boolean;
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

export function LessonPlayer({ lesson, countryId, level, onBack, initialComplete }: LessonPlayerProps) {
 const [completed,setCompleted]=useState(initialComplete);
 const [review,setReview]=useState(false);
 const [saveError,setSaveError]=useState(''),[saving,setSaving]=useState(false);
 const handleComplete=async()=>{if(saving)return;setSaving(true);setSaveError('');try{await markLessonComplete(countryId,lesson.id,level);setCompleted(true);setReview(false);}catch(err){setSaveError((err as Error).message);}finally{setSaving(false);}};
 return <div className="travel-page max-w-4xl">
   <button onClick={onBack} className="text-button mb-6">Terug naar de lessen</button>
   <div className="page-intro"><div><p className="eyebrow">YOUR NEXT CHAPTER · {level}</p><h1>{lesson.title}</h1><p>{lesson.description}</p></div><span className="text-4xl">{lesson.icon}</span></div>
   {saveError&&<p role="alert" className="form-error mb-4">{saveError}</p>}{saving&&<p role="status">Voortgang opslaan...</p>}
   {completed&&<div role="status" className="content-panel flex flex-wrap items-center gap-4"><CheckCircle className="text-emerald-700"/><div className="flex-1"><h2>Les afgerond!</h2><p>Je voortgang is opgeslagen in je account.</p></div><button className="button button-teal" onClick={onBack}>Verder reizen</button>{lesson.internalLessonId&&<button className="text-button" onClick={()=>setReview(v=>!v)}>{review?'Oefening sluiten':'Nog eens oefenen'}</button>}</div>}
   {lesson.internalLessonId&&(!completed||review)&&<div className="content-panel">{renderInlineLesson(lesson.internalLessonId,handleComplete)}</div>}
   {lesson.url&&!lesson.internalLessonId&&<div className="content-panel"><div className="stat-icon mint mb-5"><ExternalLink/></div><h2>Deze les heeft een eigen reiswereld.</h2><p className="mb-6">Open de les in een nieuw tabblad. Kom hier terug wanneer je klaar bent en bewaar je voortgang.</p><div className="flex flex-wrap gap-3"><a className="button button-teal" href={lesson.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={18}/>Open les</a>{!completed&&<button className="button bg-slate-100 text-slate-700" onClick={handleComplete}>Ik heb de les afgerond</button>}</div></div>}
 </div>;
}

