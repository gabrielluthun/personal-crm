/**
 * Nominal string id branded by entity name.
 * Prevents accidentally mixing ContactId with EntrepriseId.
 * Values are plain UUIDs (Postgres gen_random_uuid / crypto.randomUUID).
 */

declare const brand: unique symbol;

export type Id<Brand extends string> = string & {
  readonly [brand]: Brand;
};

export type AnyId = Id<string>;

export function createId<Brand extends string>(value: string): Id<Brand> {
  return value as Id<Brand>;
}

/** Client-side UUID for mocks / offline. Supabase inserts omit id (DB default). */
export function generateId<Brand extends string>(): Id<Brand> {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return createId<Brand>(random);
}
