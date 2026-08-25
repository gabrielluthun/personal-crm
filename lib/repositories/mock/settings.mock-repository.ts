import { validationError } from "@/lib/domain/shared/errors";
import { err, ok } from "@/lib/domain/shared/result";
import type {
  PublicSettingKey,
  SecretKey,
  SettingsPort,
} from "@/lib/repositories/ports/settings.port";

/**
 * In-memory settings for the mock DI mode.
 * Secrets are tracked by presence only — values are never stored or returned.
 */
export class MockSettingsRepository implements SettingsPort {
  private readonly secrets = new Set<SecretKey>();
  private readonly publicSettings = new Map<PublicSettingKey, string>();

  async hasSecret(key: SecretKey) {
    return ok(this.secrets.has(key));
  }

  async setSecret(key: SecretKey, value: string) {
    if (value.trim().length === 0) {
      return err(validationError("Le secret ne peut pas être vide"));
    }
    this.secrets.add(key);
    return ok(undefined);
  }

  async deleteSecret(key: SecretKey) {
    this.secrets.delete(key);
    return ok(undefined);
  }

  async getPublicSetting(key: PublicSettingKey) {
    return ok(this.publicSettings.get(key) ?? null);
  }

  async setPublicSetting(key: PublicSettingKey, value: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      this.publicSettings.delete(key);
    } else {
      this.publicSettings.set(key, trimmed);
    }
    return ok(undefined);
  }
}
