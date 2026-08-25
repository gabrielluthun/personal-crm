/**
 * JSON values stored in jsonb columns (Bright Data payloads, etc.).
 * Mirrors Supabase `Json` without importing infrastructure into the domain.
 */

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | { readonly [key: string]: JsonValue | undefined }
  | readonly JsonValue[];
