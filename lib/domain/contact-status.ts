/**
 * Single source of truth for contact pipeline statuses.
 * Never duplicate these literals elsewhere — import from here.
 */

export const CONTACT_STATUSES = [
  "À contacter",
  "Contacté",
  "Relance 1",
  "Relance 2",
  "En discussion",
  "Call prévu",
  "Refus",
  "Terminé",
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

/** Badge variants aligned with shadcn/ui `badgeVariants`. */
export type ContactStatusBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost";

export const CONTACT_STATUS_BADGE_VARIANT: Record<
  ContactStatus,
  ContactStatusBadgeVariant
> = {
  "À contacter": "outline",
  Contacté: "secondary",
  "Relance 1": "secondary",
  "Relance 2": "secondary",
  "En discussion": "default",
  "Call prévu": "default",
  Refus: "destructive",
  Terminé: "ghost",
};

export function isContactStatus(value: unknown): value is ContactStatus {
  return (
    typeof value === "string" &&
    (CONTACT_STATUSES as readonly string[]).includes(value)
  );
}

export function getContactStatusBadgeVariant(
  status: ContactStatus,
): ContactStatusBadgeVariant {
  return CONTACT_STATUS_BADGE_VARIANT[status];
}
