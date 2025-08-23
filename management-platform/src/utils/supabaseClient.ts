import { createClient } from '@supabase/supabase-js';

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if valid credentials are provided
export const supabase = (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-project-url') || supabaseAnonKey.includes('your-supabase-anon-key')) 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey); 