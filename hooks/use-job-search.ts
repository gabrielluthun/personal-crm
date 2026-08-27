"use client";

import { useRef, useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import type { JobOffer, JobSearchQuery } from "@/lib/domain/job-offer";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

export type JobSearchStatus = "idle" | "loading" | "success" | "error";

const COMPANIES_PER_PAGE = 10;

type SearchExtras = {
  readonly excludeSlugs?: readonly string[];
  readonly excludeNames?: readonly string[];
};

/**
 * Dashboard job / lead search. Idle until the first explicit `search()` call.
 * `searchNext` loads the following SERP page while skipping known slugs.
 */
export function useJobSearch() {
  const { jobSearch } = useRepositories();
  const [offers, setOffers] = useState<readonly JobOffer[]>([]);
  const [error, setError] = useState<DomainError | null>(null);
  const [status, setStatus] = useState<JobSearchStatus>("idle");
  const [lastQuery, setLastQuery] = useState<JobSearchQuery | null>(null);
  const [page, setPage] = useState(1);
  const [seenSlugs, setSeenSlugs] = useState<readonly string[]>([]);
  const [lastBatchCompanyCount, setLastBatchCompanyCount] = useState(0);
  const [crmExcludeSlugs, setCrmExcludeSlugs] = useState<readonly string[]>(
    [],
  );
  const [crmExcludeNames, setCrmExcludeNames] = useState<readonly string[]>(
    [],
  );
  const generationRef = useRef(0);

  async function runSearch(
    query: JobSearchQuery,
    options: {
      readonly append: boolean;
      readonly page: number;
      readonly excludeSlugs: readonly string[];
      readonly excludeNames: readonly string[];
    },
  ): Promise<Result<readonly JobOffer[], DomainError>> {
    generationRef.current += 1;
    const generation = generationRef.current;
    setStatus("loading");
    setError(null);

    const result = await jobSearch.search({
      ...query,
      page: options.page,
      excludeSlugs: options.excludeSlugs,
      excludeNames: options.excludeNames,
    });

    if (generation !== generationRef.current) {
      return result;
    }

    if (result.ok) {
      const batchSlugs = uniqueSlugs(result.value);
      setOffers((previous) =>
        options.append ? mergeOffers(previous, result.value) : result.value,
      );
      setSeenSlugs((previous) =>
        options.append
          ? uniqueStrings([...previous, ...batchSlugs])
          : batchSlugs,
      );
      setLastBatchCompanyCount(batchSlugs.length);
      setPage(options.page);
      setError(null);
      setStatus("success");
    } else {
      setError(result.error);
      setStatus("error");
    }
    return result;
  }

  async function search(
    query: JobSearchQuery,
    extras: SearchExtras = {},
  ): Promise<Result<readonly JobOffer[], DomainError>> {
    const excludeSlugs = extras.excludeSlugs ?? [];
    const excludeNames = extras.excludeNames ?? [];
    setLastQuery(query);
    setCrmExcludeSlugs(excludeSlugs);
    setCrmExcludeNames(excludeNames);
    setSeenSlugs([]);
    setLastBatchCompanyCount(0);
    return runSearch(query, {
      append: false,
      page: 1,
      excludeSlugs,
      excludeNames,
    });
  }

  async function searchNext(): Promise<Result<readonly JobOffer[], DomainError> | null> {
    if (lastQuery === null) {
      return null;
    }
    const excludeSlugs = uniqueStrings([...crmExcludeSlugs, ...seenSlugs]);
    return runSearch(lastQuery, {
      append: true,
      page: page + 1,
      excludeSlugs,
      excludeNames: crmExcludeNames,
    });
  }

  async function reload(): Promise<Result<readonly JobOffer[], DomainError> | null> {
    if (lastQuery === null) {
      return null;
    }
    return search(lastQuery, {
      excludeSlugs: crmExcludeSlugs,
      excludeNames: crmExcludeNames,
    });
  }

  function clear(): void {
    generationRef.current += 1;
    setOffers([]);
    setError(null);
    setStatus("idle");
    setLastQuery(null);
    setPage(1);
    setSeenSlugs([]);
    setLastBatchCompanyCount(0);
    setCrmExcludeSlugs([]);
    setCrmExcludeNames([]);
  }

  return {
    offers,
    error,
    status,
    page,
    isLoading: status === "loading",
    isIdle: status === "idle",
    hasSearched: status !== "idle",
    canLoadMore:
      status === "success" && lastBatchCompanyCount >= COMPANIES_PER_PAGE,
    lastQuery,
    search,
    searchNext,
    reload,
    clear,
  };
}

function uniqueSlugs(offers: readonly JobOffer[]): string[] {
  return uniqueStrings(offers.map((offer) => offer.companySlug));
}

function uniqueStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of values) {
    const value = raw.trim().toLowerCase();
    if (value.length === 0 || seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
  }
  return result;
}

function mergeOffers(
  previous: readonly JobOffer[],
  next: readonly JobOffer[],
): readonly JobOffer[] {
  const seen = new Set(previous.map((offer) => offer.id));
  const merged = [...previous];
  for (const offer of next) {
    if (seen.has(offer.id)) {
      continue;
    }
    seen.add(offer.id);
    merged.push(offer);
  }
  return merged;
}
