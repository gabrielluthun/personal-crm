import type { ContactStatus } from "@/lib/domain/contact-status";

/** Calendar date `YYYY-MM-DD` in the local timezone. */
export function todayCalendarDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * After a first outbound message, move "À contacter" → "Contacté".
 * Other statuses stay untouched.
 */
export function statusAfterFirstSend(
  status: ContactStatus,
): ContactStatus | null {
  if (status === "À contacter") {
    return "Contacté";
  }
  return null;
}
