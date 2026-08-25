/**
 * Public environment variables. All NEXT_PUBLIC_* values are baked into the
 * client bundle — never put secrets here.
 */

export type PublicEnv = {
  readonly supabaseUrl: string | null;
  readonly supabaseAnonKey: string | null;
};

export type SupabasePublicEnv = {
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
};

function readOptional(name: string): string | null {
  const value = process.env[name];
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: readOptional("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: readOptional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function hasSupabasePublicEnv(): boolean {
  const env = getPublicEnv();
  return env.supabaseUrl !== null && env.supabaseAnonKey !== null;
}

/**
 * Throws when Supabase public credentials are missing.
 * Call this only when switching the DI container to the Supabase adapters.
 */
export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const env = getPublicEnv();
  if (env.supabaseUrl === null || env.supabaseAnonKey === null) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.local.example to .env.local and fill the public values.",
    );
  }
  return {
    supabaseUrl: env.supabaseUrl,
    supabaseAnonKey: env.supabaseAnonKey,
  };
}
