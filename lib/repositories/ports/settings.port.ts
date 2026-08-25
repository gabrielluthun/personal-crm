import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

/**
 * Logical secret keys. Values are stored in the OS keychain via Tauri Rust.
 * Ports never return secret values to the UI — only presence / success.
 */
export type SecretKey = "bright_data_token" | "supabase_anon_key";

export type PublicSettingKey = "supabase_url";

export type SettingsPort = {
  hasSecret(key: SecretKey): Promise<Result<boolean, DomainError>>;
  setSecret(
    key: SecretKey,
    value: string,
  ): Promise<Result<void, DomainError>>;
  deleteSecret(key: SecretKey): Promise<Result<void, DomainError>>;
  getPublicSetting(
    key: PublicSettingKey,
  ): Promise<Result<string | null, DomainError>>;
  setPublicSetting(
    key: PublicSettingKey,
    value: string,
  ): Promise<Result<void, DomainError>>;
};
