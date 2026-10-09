import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let authClient: SupabaseClient | null = null;

/** Browser client with session persistence — for /admin only. */
export function getSupabaseAuth(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!authClient) {
    authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "aveng_admin_auth",
      },
    });
  }
  return authClient;
}
