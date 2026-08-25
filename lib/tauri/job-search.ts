import { invoke } from "@tauri-apps/api/core";

import type { JobOffer, JobSearchQuery } from "@/lib/domain/job-offer";
import { repositoryError, type DomainError } from "@/lib/domain/shared/errors";
import { err, ok, type Result } from "@/lib/domain/shared/result";
import { isTauri } from "@/lib/tauri/is-tauri";

/**
 * Typed invoke for `search_jobs`.
 * The Bright Data token is read only on the Rust side — never sent or returned.
 */
export async function searchJobs(
  query: JobSearchQuery,
): Promise<Result<readonly JobOffer[], DomainError>> {
  if (!isTauri()) {
    return err(
      repositoryError("La recherche d'offres nécessite l'application Tauri"),
    );
  }

  try {
    const offers = await invoke<JobOffer[]>("search_jobs", {
      query: {
        keywords: query.keywords,
        location: query.location ?? null,
        contractType: query.contractType ?? null,
      },
    });
    return ok(offers);
  } catch (cause) {
    const message =
      cause instanceof Error
        ? cause.message
        : typeof cause === "string"
          ? cause
          : "Erreur de recherche d'offres";
    return err(repositoryError(message, cause));
  }
}
