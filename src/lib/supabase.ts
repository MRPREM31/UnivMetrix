import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface MetalPriceObservationRow {
  id: string;
  metal: string;
  purity: string | null;
  currency: string;
  unit: string;
  price: number;
  ask_price: number | null;
  bid_price: number | null;
  high_price: number | null;
  low_price: number | null;
  change_amount: number | null;
  change_percent: number | null;
  observed_at: string;
  provider: string;
  source_status: 'verified' | 'preliminary' | 'demo';
  is_published: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      metal_price_observations: {
        Row: MetalPriceObservationRow;
        Insert: Omit<MetalPriceObservationRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<MetalPriceObservationRow>;
      };
    };
    Views: {
      v_latest_metal_prices: {
        Row: Omit<MetalPriceObservationRow, 'created_at' | 'updated_at' | 'is_published'>;
      };
    };
  };
}

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Clean URL to prevent issues if /rest/v1 or trailing slash was included
const supabaseUrl = rawSupabaseUrl
  ? rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
  : '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
