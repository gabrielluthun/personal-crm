import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { requireSupabasePublicEnv } from "@/lib/config/env";
import type { Database } from "@/lib/supabase/database.types";

export type AppSupabaseClient = SupabaseClient<Database>;

let client: AppSupabaseClient | null = null;

/**
 * Lazy singleton. Uses only the public anon key (RLS-protected).
 * No Auth session — personal CRM, single-user, clé anon = secret d'accès.
 * Never put service_role in the desktop bundle.
 */
export function getSupabaseClient(): AppSupabaseClient {
  if (client) {
    return client;
  }
  const env = requireSupabasePublicEnv();
  client = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return client;
}

/** Test / reset helper — not used by production UI. */
export function resetSupabaseClient(): void {
  client = null;
}
