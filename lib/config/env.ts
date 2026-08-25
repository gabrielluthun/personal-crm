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

function readOptional(value: string | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Each variable must be read as a literal `process.env.NAME` member access:
 * Next.js only substitutes those at build time. `process.env[name]` survives
 * the build and resolves to an empty shim in the webview.
 */
export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: readOptional(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: readOptional(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
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
