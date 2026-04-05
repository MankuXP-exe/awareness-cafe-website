import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the service role key.
 * BYPASSES RLS — use only in server-side API routes for admin operations.
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
