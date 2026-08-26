import type { Contact } from "@/lib/domain/contact";
import { getContactDisplayName } from "@/lib/domain/contact";
import type { Entreprise } from "@/lib/domain/entreprise";
import type { TemplateVariableValues } from "@/lib/services/template-renderer";

/** Suggested delay before a follow-up when no dedicated field exists yet. */
const DEFAULT_FOLLOW_UP_DAYS = 7;

/**
 * Maps a contact (+ optional company) to template placeholder values.
 * Uses the best available contact fields; dates fall back to creation day.
 */
export function buildTemplateValues(
  contact: Contact,
  entreprise: Entreprise | null,
): TemplateVariableValues {
  const anchorDate =
    contact.lastMessageSentAt ?? toCalendarDate(contact.createdAt);
  const followUpDate = addCalendarDays(anchorDate, DEFAULT_FOLLOW_UP_DAYS);

  return {
    prenom: contact.firstName.trim(),
    nom: contact.lastName.trim(),
    nom_complet: getContactDisplayName(contact),
    entreprise: entreprise?.name.trim() ?? "",
    email: contact.email?.trim() ?? "",
    poste: (contact.jobTitle ?? contact.headline)?.trim() ?? "",
    linkedin: contact.linkedinUrl?.trim() ?? "",
    statut: contact.status,
    date_premier_contact: formatDateFr(anchorDate),
    prochaine_relance: formatDateFr(followUpDate),
  };
}

function toCalendarDate(isoDateTime: string): string {
  return isoDateTime.slice(0, 10);
}

function formatDateFr(calendarDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(calendarDate);
  if (match === null) {
    return calendarDate;
  }
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function addCalendarDays(calendarDate: string, days: number): string {
  const date = new Date(`${calendarDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
