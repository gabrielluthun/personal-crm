import {
  TEMPLATE_VARIABLES,
  resolveTemplateVariableKey,
  templateVariableToken,
  type TemplateVariableKey,
} from "@/lib/domain/template-variables";

export type TemplateVariableValues = Partial<
  Record<TemplateVariableKey, string>
>;

export type TemplateRenderResult = {
  readonly rendered: string;
  readonly missing: readonly TemplateVariableKey[];
  readonly used: readonly TemplateVariableKey[];
};

const PLACEHOLDER_PATTERN = /\{\{\s*([a-z_]+)\s*\}\}/gi;

/**
 * Pure interpolation of `{{variable}}` placeholders.
 * Unknown tokens are left as-is; known keys without values are listed in `missing`.
 * French aliases (e.g. `{{nom_contact}}`) resolve to canonical English keys.
 */
export function renderTemplate(
  body: string,
  values: TemplateVariableValues,
): TemplateRenderResult {
  const usedSet = new Set<TemplateVariableKey>();
  const missingSet = new Set<TemplateVariableKey>();

  const rendered = body.replace(
    PLACEHOLDER_PATTERN,
    (match, rawKey: string) => {
      const key = resolveTemplateVariableKey(rawKey);
      if (key === null) {
        return match;
      }

      usedSet.add(key);
      const value = values[key]?.trim();
      if (value === undefined || value.length === 0) {
        missingSet.add(key);
        return match;
      }
      return value;
    },
  );

  return {
    rendered,
    missing: TEMPLATE_VARIABLES.filter((key) => missingSet.has(key)),
    used: TEMPLATE_VARIABLES.filter((key) => usedSet.has(key)),
  };
}

/** Lists placeholders present in a body, in domain order. */
export function listTemplateVariablesInBody(
  body: string,
): readonly TemplateVariableKey[] {
  const found = new Set<TemplateVariableKey>();
  for (const match of body.matchAll(PLACEHOLDER_PATTERN)) {
    const key = resolveTemplateVariableKey(match[1] ?? "");
    if (key !== null) {
      found.add(key);
    }
  }
  return TEMPLATE_VARIABLES.filter((key) => found.has(key));
}

export function formatMissingVariables(
  missing: readonly TemplateVariableKey[],
): string {
  return missing.map((key) => templateVariableToken(key)).join(", ");
}
