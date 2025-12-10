// Safe Supabase initialization that doesn't crash when env vars are missing
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

// Create a safe supabase client that only initializes if env vars are present
let supabaseInstance: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured) {
  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

export const supabaseSafe = supabaseInstance;

// Re-export the original client for backwards compatibility, but throw a helpful error
export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.'
    );
  }
  return supabaseInstance;
};
