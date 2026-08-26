"use client";

import type { Interaction } from "@/lib/domain/interaction";

type ContactInteractionHistoryProps = {
  readonly items: readonly Interaction[];
  readonly isLoading?: boolean;
};

export function ContactInteractionHistory({
  items,
  isLoading = false,
}: ContactInteractionHistoryProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-foreground">
        Historique des envois
      </h3>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">Chargement…</p>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Aucun message enregistré pour ce contact.
        </p>
      ) : null}

      {items.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-border p-3"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{formatChannel(item.channel)}</span>
                <span aria-hidden>·</span>
                <time dateTime={item.sentAt}>{formatSentAt(item.sentAt)}</time>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {item.messageSent}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function formatChannel(channel: string): string {
  if (channel.length === 0) {
    return channel;
  }
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

function formatSentAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
