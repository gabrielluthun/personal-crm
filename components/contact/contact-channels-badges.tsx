"use client";

import { Badge } from "@/components/ui/badge";

type ContactChannelsBadgesProps = {
  readonly channels: readonly string[];
  readonly isLoading?: boolean;
};

export function ContactChannelsBadges({
  channels,
  isLoading = false,
}: ContactChannelsBadgesProps) {
  if (isLoading) {
    return (
      <p className="text-xs text-muted-foreground">Chargement des canaux…</p>
    );
  }

  if (channels.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Aucun canal encore — dérivé des interactions.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Canaux utilisés">
      {channels.map((channel) => (
        <li key={channel}>
          <Badge variant="secondary">{formatChannel(channel)}</Badge>
        </li>
      ))}
    </ul>
  );
}

function formatChannel(channel: string): string {
  if (channel.length === 0) {
    return channel;
  }
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}
