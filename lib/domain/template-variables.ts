/**
 * Single source of truth for message template placeholders.
 * Never duplicate these literals — import from here.
 *
 * Canonical tokens match the French chip labels (ascii keys).
 * English spellings remain accepted as aliases for older templates.
 * `{{linkedin}}` is the contact's stored LinkedIn URL (manual / SERP),
 * not a Bright Data social enrichment.
 */

export const TEMPLATE_VARIABLES = [
  "prenom",
  "nom",
  "nom_complet",
  "entreprise",
  "email",
  "poste",
  "linkedin",
  "statut",
  "date_premier_contact",
  "prochaine_relance",
] as const;

export type TemplateVariableKey = (typeof TEMPLATE_VARIABLES)[number];

export const TEMPLATE_VARIABLE_LABELS: Record<TemplateVariableKey, string> = {
  prenom: "Prénom",
  nom: "Nom",
  nom_complet: "Nom complet",
  entreprise: "Entreprise",
  email: "Email",
  poste: "Poste",
  linkedin: "LinkedIn",
  statut: "Statut",
  date_premier_contact: "Date 1er contact",
  prochaine_relance: "Prochaine relance",
};

/** Alternate spellings (EN + variants) → canonical French keys. */
export const TEMPLATE_VARIABLE_ALIASES: Readonly<
  Record<string, TemplateVariableKey>
> = {
  first_name: "prenom",
  last_name: "nom",
  contact_name: "nom_complet",
  nom_contact: "nom_complet",
  company_name: "entreprise",
  nom_entreprise: "entreprise",
  role: "poste",
  status: "statut",
  first_contact_date: "date_premier_contact",
  next_follow_up: "prochaine_relance",
};

/** Placeholder token as it appears in template bodies, e.g. `{{prenom}}`. */
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

/** Resolves a raw placeholder name (canonical or alias) to a domain key. */
export function resolveTemplateVariableKey(
  raw: string,
): TemplateVariableKey | null {
  const key = raw.trim().toLowerCase();
  if (isTemplateVariableKey(key)) {
    return key;
  }
  return TEMPLATE_VARIABLE_ALIASES[key] ?? null;
}
