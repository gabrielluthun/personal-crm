import type { BrightDataProbeResult } from "@/lib/domain/bright-data-probe";
import type { JobOffer, JobSearchQuery } from "@/lib/domain/job-offer";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

/**
 * Port for job / lead collection.
 *
 * Production path: Tauri Rust command reads the Bright Data token from the OS
 * keychain and queries Bright Data. The token never crosses the IPC boundary
 * into the frontend. Mock adapters return fixture JobOffer rows.
 */
export type JobSearchPort = {
  search(
    query: JobSearchQuery,
  ): Promise<Result<readonly JobOffer[], DomainError>>;
  /** Lightweight API probe — validates the keychain token without searching. */
  probeConnection(): Promise<Result<BrightDataProbeResult, DomainError>>;
};
