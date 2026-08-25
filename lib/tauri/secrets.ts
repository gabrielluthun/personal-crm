import { invoke } from "@tauri-apps/api/core";

import { isTauri } from "@/lib/tauri/is-tauri";
import { repositoryError } from "@/lib/domain/shared/errors";
import { err, ok, type Result } from "@/lib/domain/shared/result";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { SecretKey } from "@/lib/repositories/ports/settings.port";

function mapInvokeError(cause: unknown): DomainError {
  const message =
    cause instanceof Error
      ? cause.message
      : typeof cause === "string"
        ? cause
        : "Erreur keychain";
  return repositoryError(message, cause);
}

/**
 * Typed wrappers around Tauri secret commands.
 * Commands never return secret values — only presence / success.
 */
export async function setSecret(
  key: SecretKey,
  value: string,
): Promise<Result<void, DomainError>> {
  if (!isTauri()) {
    return err(
      repositoryError("Les secrets keychain nécessitent l'application Tauri"),
    );
  }
  try {
    await invoke<void>("set_secret", { key, value });
    return ok(undefined);
  } catch (cause) {
    return err(mapInvokeError(cause));
  }
}

export async function hasSecret(
  key: SecretKey,
): Promise<Result<boolean, DomainError>> {
  if (!isTauri()) {
    return err(
      repositoryError("Les secrets keychain nécessitent l'application Tauri"),
    );
  }
  try {
    const present = await invoke<boolean>("has_secret", { key });
    return ok(present);
  } catch (cause) {
    return err(mapInvokeError(cause));
  }
}

export async function deleteSecret(
  key: SecretKey,
): Promise<Result<void, DomainError>> {
  if (!isTauri()) {
    return err(
      repositoryError("Les secrets keychain nécessitent l'application Tauri"),
    );
  }
  try {
    await invoke<void>("delete_secret", { key });
    return ok(undefined);
  } catch (cause) {
    return err(mapInvokeError(cause));
  }
}
