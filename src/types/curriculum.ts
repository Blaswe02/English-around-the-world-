export type Level = 'BASIS' | 'KADER' | 'MAVO' | 'HAVO';

export type CountryStatus =
  | 'completed'
  | 'current'
  | 'development'
  | 'locked'
  | 'future';

export type LessonType =
  | 'hub'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'vocabulary'
  | 'grammar'
  | 'culture'
  | 'quiz'
  | 'game'
  | 'assessment'
  | 'portfolio';

export type Skill =
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'vocabulary'
  | 'grammar'
  | 'culture'
  | 'reflection';

export type StampType =
  | 'fact'
  | 'taste'
  | 'story'
  | 'heritage'
  | 'diplomat'
  | 'archive';

export type NavItem =
  | 'dashboard'
  | 'eaatw'
  | 'passport'
  | 'teacher'
  | 'progress'
  | 'settings';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  skills: Skill[];
  levels: Level[];
  url: string;
  icon: string;
  estimatedTime?: string;
  output?: string;
  teacherNote?: string;
}

export interface PassportGate {
  id: string;
  title: string;
  domain: string;
  npcRole: string;
  missionObjective: string;
  inputType: string;
  outputType: string;
  skillFocus: Skill[];
  stampType: StampType;
}

export interface CountryConfig {
  id: string;
  title: string;
  subtitle: string;
  flag: string;
  region: string;
  status: CountryStatus;
  image: string;
  description: string;
  dialectFocus: string;
  curriculumFocus: string[];
  recommendedLevels: Level[];
  lessons: Lesson[];
  passportGates?: PassportGate[];
  teacherNotes?: string;
  portfolioOutputs?: string[];
}
