import type { PassportGate, StampType } from '../types/curriculum';

export const STAMP_LABELS: Record<StampType, string> = {
  fact: 'Fact Stamp',
  taste: 'Taste Stamp',
  story: 'Story Stamp',
  heritage: 'Heritage Stamp',
  diplomat: 'Diplomat Stamp',
  archive: 'Archive Stamp',
};

export const STAMP_ICONS: Record<StampType, string> = {
  fact: '📋',
  taste: '🍽️',
  story: '📖',
  heritage: '🏛️',
  diplomat: '🤝',
  archive: '📁',
};

export const STAMP_COLORS: Record<StampType, string> = {
  fact: 'bg-blue-50 text-blue-700 border-blue-200',
  taste: 'bg-orange-50 text-orange-700 border-orange-200',
  story: 'bg-purple-50 text-purple-700 border-purple-200',
  heritage: 'bg-amber-50 text-amber-700 border-amber-200',
  diplomat: 'bg-green-50 text-green-700 border-green-200',
  archive: 'bg-slate-50 text-slate-700 border-slate-200',
};

// Universal passport gate template — each country can override/extend these
export const DEFAULT_PASSPORT_GATES: Omit<PassportGate, 'id'>[] = [
  {
    title: 'Arrival Gate',
    domain: 'Orientation',
    npcRole: 'Gate Officer',
    missionObjective: 'Learn the basics of this country and its English',
    inputType: 'Reading + listening',
    outputType: 'Fact summary',
    skillFocus: ['reading', 'listening', 'vocabulary'],
    stampType: 'fact',
  },
  {
    title: 'Market Gate',
    domain: 'Food & Daily Life',
    npcRole: 'Market Vendor',
    missionObjective: 'Explore food culture and everyday vocabulary',
    inputType: 'Vocabulary + listening',
    outputType: 'Food recommendation',
    skillFocus: ['vocabulary', 'speaking', 'culture'],
    stampType: 'taste',
  },
  {
    title: 'Harbor Gate',
    domain: 'Tourism & Geography',
    npcRole: 'Harbor Guide',
    missionObjective: 'Discover the most important places',
    inputType: 'Reading + images',
    outputType: 'Travel recommendation',
    skillFocus: ['reading', 'writing', 'speaking'],
    stampType: 'story',
  },
  {
    title: 'Parliament Gate',
    domain: 'Identity & History',
    npcRole: 'Parliament Speaker',
    missionObjective: "Understand the country's history and national identity",
    inputType: 'Reading + discussion',
    outputType: 'Opinion paragraph',
    skillFocus: ['reading', 'writing', 'culture'],
    stampType: 'heritage',
  },
  {
    title: 'Embassy Gate',
    domain: 'Comparison & Diplomacy',
    npcRole: 'Embassy Attaché',
    missionObjective: 'Compare this country with the Netherlands',
    inputType: 'Research + discussion',
    outputType: 'Comparison table or paragraph',
    skillFocus: ['writing', 'speaking', 'reflection'],
    stampType: 'diplomat',
  },
  {
    title: 'Archive Gate',
    domain: 'Assessment & Portfolio',
    npcRole: 'Archivist',
    missionObjective: 'Reflect on what you learned and create a final output',
    inputType: 'All previous work',
    outputType: 'Portfolio entry',
    skillFocus: ['writing', 'reflection'],
    stampType: 'archive',
  },
];

