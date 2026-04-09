import { createClient } from "@supabase/supabase-js";

// Use dummy fallback values so the app won't crash on boot if .env is missing.
// Real auth will fail and prompt user if these are active.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
