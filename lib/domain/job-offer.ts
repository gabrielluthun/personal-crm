import type { JobBoardSource } from "@/lib/domain/job-board-source";
import type { Id } from "@/lib/domain/shared/id";
import type { IsoDateTime } from "@/lib/domain/shared/timestamps";

export type JobOfferId = Id<"JobOffer">;

export type JobContractType =
  | "CDI"
  | "CDD"
  | "Freelance"
  | "Stage"
  | "Alternance"
  | "Autre";

/**
 * Dashboard search hit from a single job board (WTTJ or Indeed).
 */
export type JobOffer = {
  readonly id: JobOfferId;
  readonly title: string;
  readonly companyName: string;
  /** Stable company identity for pagination dedup (slug or derived key). */
  readonly companySlug: string;
  readonly location: string;
  readonly contractType: JobContractType;
  readonly source: JobBoardSource;
  /** Offer URL on the selected board. */
  readonly offerUrl: string;
  readonly companyWebsiteUrl: string | null;
  readonly companyLinkedinUrl: string | null;
  readonly publishedAt: IsoDateTime | null;
  readonly descriptionSnippet: string | null;
};

export type JobSearchQuery = {
  readonly keywords: string;
  readonly location?: string;
  readonly contractType?: JobContractType | null;
  readonly source?: JobBoardSource;
  /** 1-based SERP page (Google `start = (page - 1) * 20`). */
  readonly page?: number;
  /** Company slugs already seen this session or already in the CRM. */
  readonly excludeSlugs?: readonly string[];
  /** Company names already in the CRM (fallback without board URL). */
  readonly excludeNames?: readonly string[];
};
