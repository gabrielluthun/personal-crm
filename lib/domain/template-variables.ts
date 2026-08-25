/**
 * Single source of truth for message template placeholders.
 * Never duplicate these literals — import from here.
 *
 * Chip labels are French; tokens inserted in subject/body are English keys.
 * `{{linkedin}}` is the contact's stored LinkedIn URL (manual / SERP),
 * not a Bright Data social enrichment.
 */

export const TEMPLATE_VARIABLES = [
  "first_name",
  "last_name",
  "company_name",
  "email",
  "role",
  "linkedin",
  "status",
  "first_contact_date",
  "next_follow_up",
] as const;

export type TemplateVariableKey = (typeof TEMPLATE_VARIABLES)[number];

export const TEMPLATE_VARIABLE_LABELS: Record<TemplateVariableKey, string> = {
  first_name: "Prénom",
  last_name: "Nom",
  company_name: "Entreprise",
  email: "Email",
  role: "Role",
  linkedin: "LinkedIn",
  status: "Statut",
  first_contact_date: "Date 1er contact",
  next_follow_up: "Prochaine relance",
};

/** Placeholder token as it appears in template bodies, e.g. `{{first_name}}`. */
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
