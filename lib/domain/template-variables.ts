/**
 * Single source of truth for message template placeholders.
 * Never duplicate these literals — import from here.
 */

export const TEMPLATE_VARIABLES = [
  "nom_entreprise",
  "nom_contact",
  "poste",
  "ville",
] as const;

export type TemplateVariableKey = (typeof TEMPLATE_VARIABLES)[number];

export const TEMPLATE_VARIABLE_LABELS: Record<TemplateVariableKey, string> = {
  nom_entreprise: "Nom de l'entreprise",
  nom_contact: "Nom du contact",
  poste: "Poste",
  ville: "Ville",
};

/** Placeholder token as it appears in template bodies, e.g. `{{poste}}`. */
export function templateVariableToken(key: TemplateVariableKey): string {
  return `{{${key}}}`;
}

export function isTemplateVariableKey(
  value: unknown,
): value is TemplateVariableKey {
  return (
    typeof value === "string" &&
    (TEMPLATE_VARIABLES as readonly string[]).includes(value)
  );
}
