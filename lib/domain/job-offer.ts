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
 * Welcome to the Jungle (WTTJ) search result used on the dashboard.
 */
export type JobOffer = {
  readonly id: JobOfferId;
  readonly title: string;
  readonly companyName: string;
  readonly location: string;
  readonly contractType: JobContractType;
  readonly wttjUrl: string;
  readonly companyWebsiteUrl: string | null;
  readonly companyLinkedinUrl: string | null;
  readonly publishedAt: IsoDateTime | null;
  readonly descriptionSnippet: string | null;
};

export type JobSearchQuery = {
  readonly keywords: string;
  readonly location?: string;
  readonly contractType?: JobContractType | null;
};
