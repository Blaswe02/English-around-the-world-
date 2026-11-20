import type { LessonType, Skill } from '../types/curriculum';

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  hub: 'Hub',
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  culture: 'Culture',
  quiz: 'Quiz',
  game: 'Game',
  assessment: 'Assessment',
  portfolio: 'Portfolio',
};

export const LESSON_TYPE_COLORS: Record<LessonType, string> = {
  hub: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  reading: 'bg-blue-50 text-blue-700 border-blue-100',
  listening: 'bg-purple-50 text-purple-700 border-purple-100',
  speaking: 'bg-orange-50 text-orange-700 border-orange-100',
  writing: 'bg-green-50 text-green-700 border-green-100',
  vocabulary: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  grammar: 'bg-red-50 text-red-700 border-red-100',
  culture: 'bg-pink-50 text-pink-700 border-pink-100',
  quiz: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  game: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  assessment: 'bg-amber-50 text-amber-700 border-amber-100',
  portfolio: 'bg-teal-50 text-teal-700 border-teal-100',
};

export const SKILL_LABELS: Record<Skill, string> = {
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
  listening: 'Listening',
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  culture: 'Culture',
  reflection: 'Reflection',
};

export const SKILL_COLORS: Record<Skill, string> = {
  reading: 'bg-blue-50 text-blue-600 border-blue-100',
  writing: 'bg-green-50 text-green-600 border-green-100',
  speaking: 'bg-orange-50 text-orange-600 border-orange-100',
  listening: 'bg-purple-50 text-purple-600 border-purple-100',
  vocabulary: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  grammar: 'bg-red-50 text-red-600 border-red-100',
  culture: 'bg-pink-50 text-pink-600 border-pink-100',
  reflection: 'bg-teal-50 text-teal-600 border-teal-100',
};

