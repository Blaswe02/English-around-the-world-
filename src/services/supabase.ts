import { createClient } from '@supabase/supabase-js';
import { projectUrl, projectPublishableKey } from '../auth/publicConfig';

// The learning hub also runs without a configured cloud database.
const url = import.meta.env.VITE_SUPABASE_URL?.trim() || projectUrl;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || projectPublishableKey;
function makeClient() {
  if (!url || !key) return null;
  try { return createClient(url, key); }
  catch { console.warn('Cloud progress is unavailable; using browser storage.'); return null; }
}
export const supabase = makeClient();

