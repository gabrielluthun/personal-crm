"use client";

import Link from "next/link";

type FollowUpReminderProps = {
  readonly count: number;
};

/** Discrete dashboard nudge when contacts are due for follow-up. */
export function FollowUpReminder({ count }: FollowUpReminderProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
      {count === 1
        ? "1 contact à relancer aujourd’hui."
        : `${count} contacts à relancer aujourd’hui.`}{" "}
      <Link
        href="/contact/"
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        Ouvrir Contacts
      </Link>
    </p>
  );
}
