"use client";

import { useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import type { JobOffer, JobSearchQuery } from "@/lib/domain/job-offer";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

export type JobSearchStatus = "idle" | "loading" | "success" | "error";

/**
 * Dashboard job / lead search. Idle until the first explicit `search()` call.
 */
export function useJobSearch() {
  const { jobSearch } = useRepositories();
  const [offers, setOffers] = useState<readonly JobOffer[]>([]);
  const [error, setError] = useState<DomainError | null>(null);
  const [status, setStatus] = useState<JobSearchStatus>("idle");
  const [lastQuery, setLastQuery] = useState<JobSearchQuery | null>(null);

  async function search(
    query: JobSearchQuery,
  ): Promise<Result<readonly JobOffer[], DomainError>> {
    setStatus("loading");
    setError(null);
    setLastQuery(query);

    const result = await jobSearch.search(query);
    if (result.ok) {
      setOffers(result.value);
      setError(null);
      setStatus("success");
    } else {
      setError(result.error);
      setStatus("error");
    }
    return result;
  }

  async function reload(): Promise<Result<readonly JobOffer[], DomainError> | null> {
    if (lastQuery === null) {
      return null;
    }
    return search(lastQuery);
  }

  function clear(): void {
    setOffers([]);
    setError(null);
    setStatus("idle");
    setLastQuery(null);
  }

  return {
    offers,
    error,
    status,
    isLoading: status === "loading",
    isIdle: status === "idle",
    hasSearched: status !== "idle",
    lastQuery,
    search,
    reload,
    clear,
  };
}
