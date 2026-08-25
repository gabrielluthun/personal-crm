"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type { SecretKey } from "@/lib/repositories/ports/settings.port";

/**
 * Settings facade over SettingsPort.
 * Secret values are never returned — only presence.
 */
export function useSettings() {
  const { settings } = useRepositories();
  const [secretPresence, setSecretPresence] = useState<
    Partial<Record<SecretKey, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<DomainError | null>(null);
  const isMountedRef = useRef(true);

  const loadPresence = useEffectEvent(async () => {
    setIsLoading(true);
    setError(null);

    const bright = await settings.hasSecret("bright_data_token");

    if (!isMountedRef.current) {
      return;
    }

    if (!bright.ok) {
      setError(bright.error);
      setIsLoading(false);
      return;
    }

    setSecretPresence({
      bright_data_token: bright.value,
    });
    setIsLoading(false);
  });

  useEffect(() => {
    isMountedRef.current = true;
    void (async () => {
      await Promise.resolve();
      await loadPresence();
    })();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  async function saveSecret(
    key: SecretKey,
    value: string,
  ): Promise<Result<void, DomainError>> {
    const result = await settings.setSecret(key, value);
    if (result.ok) {
      setSecretPresence((previous) => ({ ...previous, [key]: true }));
    }
    return result;
  }

  async function clearSecret(
    key: SecretKey,
  ): Promise<Result<void, DomainError>> {
    const result = await settings.deleteSecret(key);
    if (result.ok) {
      setSecretPresence((previous) => ({ ...previous, [key]: false }));
    }
    return result;
  }

  return {
    isLoading,
    error,
    secretPresence,
    saveSecret,
    clearSecret,
  };
}
