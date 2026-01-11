import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Replace these with your actual Supabase credentials
const SUPABASE_URL = "https://gvrihvxdrxrhvhhiktpu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2cmlodnhkcnhyaHZoaGlrdHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMzIzNDAsImV4cCI6MjA4MzYwODM0MH0.4YxcbvYohY8y0Xa5PaNNItPQ1bGiu9ddWGpIALpSx2c";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
