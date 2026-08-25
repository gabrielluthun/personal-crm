import { invoke } from "@tauri-apps/api/core";

import type { BrightDataProbeResult } from "@/lib/domain/bright-data-probe";
import { repositoryError, type DomainError } from "@/lib/domain/shared/errors";
import { err, ok, type Result } from "@/lib/domain/shared/result";
import { isTauri } from "@/lib/tauri/is-tauri";

type ProbeDto = {
  readonly ok: boolean;
  readonly zoneCount: number | null;
};

/**
 * Typed invoke for `test_bright_data_connection`.
 * The token is read only on the Rust side — never sent or returned.
 */
export async function testBrightDataConnection(): Promise<
  Result<BrightDataProbeResult, DomainError>
> {
  if (!isTauri()) {
    return err(
      repositoryError(
        "Le test Bright Data nécessite l'application Tauri",
      ),
    );
  }

  try {
    const probe = await invoke<ProbeDto>("test_bright_data_connection");
    if (!probe.ok) {
      return err(repositoryError("Échec du test Bright Data"));
    }
    return ok({
      ok: true,
      zoneCount: probe.zoneCount,
    });
  } catch (cause) {
    const message =
      cause instanceof Error
        ? cause.message
        : typeof cause === "string"
          ? cause
          : "Erreur de test Bright Data";
    return err(repositoryError(message, cause));
  }
}
