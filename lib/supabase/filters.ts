/**
 * Helpers to build PostgREST filters from user input.
 *
 * A raw search term must never be concatenated into a filter string: inside
 * `.or()`, `,` starts a new clause and `.` separates column, operator and
 * value, so a term like `john.doe` breaks the query and `a,status.eq.Refus`
 * widens it.
 */

const LIKE_METACHARACTERS = /[\\%_*]/g;
const QUOTED_VALUE_SPECIALS = /["\\]/g;

/**
 * Escapes ILIKE metacharacters so the term matches literally.
 * `*` is included because PostgREST rewrites it to `%` before Postgres runs.
 */
export function escapeLikeTerm(term: string): string {
  return term.replace(LIKE_METACHARACTERS, (character) => `\\${character}`);
}

/** Wraps a value in double quotes so PostgREST reads it as a single operand. */
export function quoteFilterValue(value: string): string {
  const escaped = value.replace(
    QUOTED_VALUE_SPECIALS,
    (character) => `\\${character}`,
  );
  return `"${escaped}"`;
}

/** Literal `contains` pattern, safe to interpolate into an `.or()` clause. */
export function containsFilterValue(term: string): string {
  return quoteFilterValue(`%${escapeLikeTerm(term)}%`);
}

/** Literal `contains` pattern for the single-column `.ilike()` builder. */
export function containsPattern(term: string): string {
  return `%${escapeLikeTerm(term)}%`;
}
