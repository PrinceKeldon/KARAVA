import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Replace these with your actual Supabase credentials
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY
);
