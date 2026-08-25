import {
  deleteSecret,
  hasSecret,
  setSecret,
} from "@/lib/tauri/secrets";
import type { SecretKey, SettingsPort } from "@/lib/repositories/ports/settings.port";

/**
 * SettingsPort backed by the OS keychain.
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
}
