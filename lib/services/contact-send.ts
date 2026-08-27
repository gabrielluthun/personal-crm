import type { ContactStatus } from "@/lib/domain/contact-status";
import { suggestNextStatus } from "@/lib/services/contact-follow-up";

/** Calendar date `YYYY-MM-DD` in the local timezone. */
export function todayCalendarDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Status progression after an outbound message is recorded.
 * Delegates to the follow-up pipeline rules.
 */
export function statusAfterOutboundSend(
  status: ContactStatus,
): ContactStatus | null {
  return suggestNextStatus(status);
}

/** @deprecated Prefer `statusAfterOutboundSend`. */
export function statusAfterFirstSend(
  status: ContactStatus,
): ContactStatus | null {
  return statusAfterOutboundSend(status);
}
