import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client using Service Role Key (bypasses RLS for secure server writes)
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export function getServerSupabase(): SupabaseClient | null {
  const cleanUrl = supabaseUrl ? supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '') : '';

  if (!cleanUrl || !supabaseServiceRoleKey || cleanUrl.includes('placeholder')) {
    return null;
  }

  return createClient(cleanUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
