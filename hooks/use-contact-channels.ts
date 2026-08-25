"use client";

import { useRepositories } from "@/components/providers/repository-provider";
import { useAsyncResource } from "@/hooks/use-async-resource";
import type { ContactId } from "@/lib/domain/contact";
import { ok } from "@/lib/domain/shared/result";

export function useContactChannels(contactId: ContactId | null) {
  const { interactions } = useRepositories();

  const list = useAsyncResource(
    () =>
      contactId === null
        ? Promise.resolve(ok([] as const))
        : interactions.listByContact(contactId),
    [contactId],
  );

  const channels = uniqueChannels(
    list.data?.map((item) => item.channel) ?? [],
  );

  return {
    channels,
    isLoading: list.isLoading,
    error: list.error,
  };
}

function uniqueChannels(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of values) {
    const channel = raw.trim();
    if (channel.length === 0 || seen.has(channel)) {
      continue;
    }
    seen.add(channel);
    result.push(channel);
  }
  return result.sort((a, b) => a.localeCompare(b, "fr"));
}
