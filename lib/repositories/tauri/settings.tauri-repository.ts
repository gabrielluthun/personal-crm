import {
  deleteSecret,
  hasSecret,
  setSecret,
} from "@/lib/tauri/secrets";
import { ok } from "@/lib/domain/shared/result";
import type {
  PublicSettingKey,
  SecretKey,
  SettingsPort,
} from "@/lib/repositories/ports/settings.port";

const PUBLIC_STORAGE_PREFIX = "personal-crm:setting:";

/**
 * SettingsPort backed by OS keychain (secrets) + localStorage (public values).
 * Secret values never cross IPC back to the frontend.
 */
export class TauriSettingsRepository implements SettingsPort {
  async hasSecret(key: SecretKey) {
    return hasSecret(key);
  }

  async setSecret(key: SecretKey, value: string) {
    return setSecret(key, value);
  }

  async deleteSecret(key: SecretKey) {
    return deleteSecret(key);
  }

  async getPublicSetting(key: PublicSettingKey) {
    if (typeof window === "undefined") {
      return ok(null);
    }
    const value = window.localStorage.getItem(PUBLIC_STORAGE_PREFIX + key);
    return ok(value);
  }

  async setPublicSetting(key: PublicSettingKey, value: string) {
    if (typeof window === "undefined") {
      return ok(undefined);
    }
    const trimmed = value.trim();
    const storageKey = PUBLIC_STORAGE_PREFIX + key;
    if (trimmed.length === 0) {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, trimmed);
    }
    return ok(undefined);
  }
}
