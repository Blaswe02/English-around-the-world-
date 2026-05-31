import { supabase } from './supabase';

const SESSION_KEY = 'eaatw_session_key';

export function getSessionKey(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionKey(nickname: string): void {
  localStorage.setItem(SESSION_KEY, nickname.trim().toLowerCase());
}

// ── localStorage helpers (instant, always available) ──────────────────────────

function lsKey(countryId: string, lessonId: string, level: string) {
  return `eaatw_done_${countryId}_${lessonId}_${level}`;
}

function markLocalComplete(countryId: string, lessonId: string, level: string) {
  localStorage.setItem(lsKey(countryId, lessonId, level), 'true');
}

export function isLocallyComplete(countryId: string, lessonId: string, level: string): boolean {
  return localStorage.getItem(lsKey(countryId, lessonId, level)) === 'true';
}

// ── Supabase sync ─────────────────────────────────────────────────────────────

export async function markLessonComplete(
  countryId: string,
  lessonId: string,
  level: string,
): Promise<void> {
  // Always write to localStorage first (instant feedback)
  markLocalComplete(countryId, lessonId, level);

  const sessionKey = getSessionKey();
  if (!sessionKey) return;

  await supabase.from('lesson_progress').upsert(
    { session_key: sessionKey, country_id: countryId, lesson_id: lessonId, level },
    { onConflict: 'session_key,country_id,lesson_id,level' },
  );
}

export async function loadProgressFromSupabase(level: string): Promise<Set<string>> {
  const sessionKey = getSessionKey();
  const done = new Set<string>();
  if (!sessionKey) return done;

  const { data } = await supabase
    .from('lesson_progress')
    .select('country_id,lesson_id')
    .eq('session_key', sessionKey)
    .eq('level', level);

  data?.forEach((row) => done.add(`${row.country_id}__${row.lesson_id}`));
  return done;
}

// ── Country completion (for status badge) ─────────────────────────────────────

export function markCountryComplete(countryId: string, level: string) {
  localStorage.setItem(`eaatw_${countryId}_completed_${level}`, 'true');
}
