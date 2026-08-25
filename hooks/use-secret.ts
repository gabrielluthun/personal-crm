"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type { SecretKey } from "@/lib/repositories/ports/settings.port";

/**
 * Single-secret helper for Settings UI.
 * Exposes presence only — never the stored value.
 */
export function useSecret(key: SecretKey) {
  const { settings } = useRepositories();
  const [configured, setConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<DomainError | null>(null);

  const refresh = useEffectEvent(async () => {
    setIsLoading(true);
    setError(null);
    const result = await settings.hasSecret(key);
    if (!result.ok) {
      setError(result.error);
      setIsLoading(false);
      return;
    }
    setConfigured(result.value);
    setIsLoading(false);
  });

  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      await refresh();
    })();
  }, [key]);

  async function save(value: string): Promise<Result<void, DomainError>> {
    setIsSaving(true);
    setError(null);
    const result = await settings.setSecret(key, value);
    setIsSaving(false);
    if (result.ok) {
      setConfigured(true);
    } else {
      setError(result.error);
    }
    return result;
  }

  async function clear(): Promise<Result<void, DomainError>> {
    setIsSaving(true);
    setError(null);
    const result = await settings.deleteSecret(key);
    setIsSaving(false);
    if (result.ok) {
      setConfigured(false);
    } else {
      setError(result.error);
    }
    return result;
  }

  return {
    configured,
    isLoading,
    isSaving,
    error,
    save,
    clear,
  };
}
