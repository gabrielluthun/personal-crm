import type { Contact } from "@/lib/domain/contact";
import type { ContactStatus } from "@/lib/domain/contact-status";
import type { MessageTemplate, TemplateId } from "@/lib/domain/template";

/** Days without outbound message before a contact is due for follow-up. */
export const DEFAULT_FOLLOW_UP_DAYS = 7;

/** Statuses that can appear in the « À relancer » view. */
export const FOLLOW_UP_STATUSES: readonly ContactStatus[] = [
  "Contacté",
  "Relance 1",
  "Relance 2",
] as const;

/** Statuses shown in the « En discussion » pipeline view. */
export const DISCUSSION_VIEW_STATUSES: readonly ContactStatus[] = [
  "En discussion",
  "Call prévu",
] as const;

export type ContactPipelineView = "all" | "follow_up" | "discussion";

/**
 * Contact is due when last outbound message (or creation day) is older
 * than N days and status is still in the follow-up pipeline.
 */
export function isDueForFollowUp(
  contact: Contact,
  now: Date = new Date(),
  days: number = DEFAULT_FOLLOW_UP_DAYS,
): boolean {
  if (!FOLLOW_UP_STATUSES.includes(contact.status)) {
    return false;
  }
  const anchor =
    contact.lastMessageSentAt ?? toCalendarDate(contact.createdAt);
  const dueOn = addCalendarDays(anchor, days);
  return dueOn <= todayCalendarDate(now);
}

export function filterContactsByPipelineView(
  items: readonly Contact[],
  view: ContactPipelineView,
  now: Date = new Date(),
): readonly Contact[] {
  if (view === "all") {
    return items;
  }
  if (view === "discussion") {
    return items.filter((item) =>
      DISCUSSION_VIEW_STATUSES.includes(item.status),
    );
  }
  return items.filter((item) => isDueForFollowUp(item, now));
}

export function countDueForFollowUp(
  items: readonly Contact[],
  now: Date = new Date(),
): number {
  return items.filter((item) => isDueForFollowUp(item, now)).length;
}

/** Next status after recording an outbound send. */
export function suggestNextStatus(
  status: ContactStatus,
): ContactStatus | null {
  if (status === "À contacter") {
    return "Contacté";
  }
  if (status === "Contacté") {
    return "Relance 1";
  }
  if (status === "Relance 1") {
    return "Relance 2";
  }
  return null;
}

/**
 * Picks a template for the contact status using title/description hints.
 * Falls back to null when nothing matches.
 */
export function suggestTemplateId(
  status: ContactStatus,
  templates: readonly MessageTemplate[],
): TemplateId | null {
  if (templates.length === 0) {
    return null;
  }
  const needle = suggestionNeedle(status);
  if (needle === null) {
    return null;
  }
  const match = templates.find((template) => {
    const haystack = `${template.title} ${template.description ?? ""}`.toLowerCase();
    return haystack.includes(needle);
  });
  return match?.id ?? null;
}

function suggestionNeedle(status: ContactStatus): string | null {
  if (status === "À contacter") {
    return "icebreaker";
  }
  if (status === "Contacté") {
    return "relance 1";
  }
  if (status === "Relance 1" || status === "Relance 2") {
    return "relance 2";
  }
  if (status === "Call prévu") {
    return "confirmation call";
  }
  return null;
}

function todayCalendarDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toCalendarDate(isoDateTime: string): string {
  return isoDateTime.slice(0, 10);
}

function addCalendarDays(calendarDate: string, days: number): string {
  const date = new Date(`${calendarDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
