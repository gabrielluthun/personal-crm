import { repositoryError } from "@/lib/domain/shared/errors";
import type { DomainError } from "@/lib/domain/shared/errors";
import { err, ok, type Result } from "@/lib/domain/shared/result";

/** Interprets PostgREST delete counts under RLS (0 rows ≠ HTTP error). */
export function interpretDeleteCount(
  count: number | null,
  requested: number,
  entityPlural: string,
): Result<void, DomainError> {
  if (count === null || count === 0) {
    return err(
      repositoryError(
        "Suppression refusée ou aucune ligne trouvée (vérifier les policies RLS).",
      ),
    );
  }
  if (count < requested) {
    return err(
      repositoryError(
        `Seulement ${count} sur ${requested} ${entityPlural} supprimé(e)s.`,
      ),
    );
  }
  return ok(undefined);
}
