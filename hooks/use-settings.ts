"use client";

import { useEffect, useEffectEvent, useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type {
  PublicSettingKey,
  SecretKey,
} from "@/lib/repositories/ports/settings.port";

/**
 * Settings facade over SettingsPort.
 * Secret values are never returned — only presence.
 */
export function useSettings() {
  const { settings } = useRepositories();
  const [secretPresence, setSecretPresence] = useState<
    Partial<Record<SecretKey, boolean>>
  >({});
  const [publicSettings, setPublicSettings] = useState<
    Partial<Record<PublicSettingKey, string | null>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<DomainError | null>(null);

  const loadPresence = useEffectEvent(async () => {
    setIsLoading(true);
    setError(null);

    const [bright, supabaseKey, supabaseUrl] = await Promise.all([
      settings.hasSecret("bright_data_token"),
      settings.hasSecret("supabase_anon_key"),
      settings.getPublicSetting("supabase_url"),
    ]);

    if (!bright.ok) {
      setError(bright.error);
      setIsLoading(false);
      return;
    }
    if (!supabaseKey.ok) {
      setError(supabaseKey.error);
      setIsLoading(false);
      return;
    }
    if (!supabaseUrl.ok) {
      setError(supabaseUrl.error);
      setIsLoading(false);
      return;
    }

    setSecretPresence({
      bright_data_token: bright.value,
      supabase_anon_key: supabaseKey.value,
    });
    setPublicSettings({
      supabase_url: supabaseUrl.value,
    });
    setIsLoading(false);
  });

  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      await loadPresence();
    })();
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

  async function savePublicSetting(
    key: PublicSettingKey,
    value: string,
  ): Promise<Result<void, DomainError>> {
    const result = await settings.setPublicSetting(key, value);
    if (result.ok) {
      setPublicSettings((previous) => ({
        ...previous,
        [key]: value.trim().length === 0 ? null : value.trim(),
      }));
    }
    return result;
  }

  return {
    isLoading,
    error,
    secretPresence,
    publicSettings,
    saveSecret,
    clearSecret,
    savePublicSetting,
  };
}
