import type { JobBoardSource } from "@/lib/domain/job-board-source";
import type { JobOffer } from "@/lib/domain/job-offer";
import type { Entreprise } from "@/lib/domain/entreprise";
import { readCompanySlugFromRaw } from "@/lib/domain/job-board-source-storage";

/** Companies returned per SERP page (aligned with Rust `MAX_COMPANIES`). */
export const COMPANIES_PER_SEARCH_PAGE = 10;

export type CompanyProposition = {
  readonly id: JobOffer["id"];
  readonly companyName: string;
  readonly companySlug: string;
  readonly location: string;
  readonly activity: string | null;
  readonly websiteUrl: string | null;
  readonly linkedinUrl: string | null;
  readonly source: JobBoardSource;
  /** WTTJ company page when available; null for Indeed. */
  readonly companyBoardUrl: string | null;
  readonly offerUrl: string;
};

export type PropositionStats = {
  readonly rawCount: number;
  readonly propositionCount: number;
  readonly maxPerPage: number;
};

/**
 * One card per company. Names already in the CRM are skipped.
 * Pagination caps are enforced by the search pipeline, not here.
 */
export function buildCompanyPropositions(
  offers: readonly JobOffer[],
  entreprises: readonly Entreprise[],
): {
  readonly propositions: readonly CompanyProposition[];
  readonly stats: PropositionStats;
} {
  const knownNames = new Set(
    entreprises.map((entreprise) => normalizeName(entreprise.name)),
  );
  const knownSlugs = new Set(crmCompanySlugs(entreprises));
  const seen = new Set<string>();
  const propositions: CompanyProposition[] = [];

  for (const offer of offers) {
    const nameKey = normalizeName(offer.companyName);
    const slugKey = offer.companySlug.trim().toLowerCase();
    if (
      nameKey.length === 0 ||
      seen.has(slugKey) ||
      knownNames.has(nameKey) ||
      knownSlugs.has(slugKey)
    ) {
      continue;
    }
    seen.add(slugKey);
    propositions.push({
      id: offer.id,
      companyName: offer.companyName,
      companySlug: offer.companySlug,
      location: offer.location,
      activity: offer.descriptionSnippet,
      websiteUrl: offer.companyWebsiteUrl,
      linkedinUrl: offer.companyLinkedinUrl,
      source: offer.source,
      companyBoardUrl: companyPageFromOfferUrl(offer.offerUrl),
      offerUrl: offer.offerUrl,
    });
  }

  return {
    propositions,
    stats: {
      rawCount: offers.length,
      propositionCount: propositions.length,
      maxPerPage: COMPANIES_PER_SEARCH_PAGE,
    },
  };
}

export function formatPropositionStatus(stats: PropositionStats): string {
  return `${stats.propositionCount} proposition(s) hors base (≤${stats.maxPerPage}/page) sur ${stats.rawCount} offre(s) chargée(s).`;
}

export function formatRecruitmentContext(
  keywords: string,
  location: string | undefined,
): string {
  const place = location?.trim();
  if (place && place.length > 0) {
    return `Offres liées à « ${keywords} » à ${place} (extrait des résultats de recherche).`;
  }
  return `Offres liées à « ${keywords} » (extrait des résultats de recherche).`;
}

export function crmSearchExclusions(entreprises: readonly Entreprise[]): {
  readonly excludeSlugs: readonly string[];
  readonly excludeNames: readonly string[];
} {
  const excludeSlugs = crmCompanySlugs(entreprises);
  const excludeNames: string[] = [];
  for (const entreprise of entreprises) {
    const name = entreprise.name.trim();
    if (name.length > 0) {
      excludeNames.push(name);
    }
  }
  return { excludeSlugs, excludeNames };
}

function crmCompanySlugs(entreprises: readonly Entreprise[]): string[] {
  const slugs: string[] = [];
  for (const entreprise of entreprises) {
    const fromRaw = readCompanySlugFromRaw(entreprise.rawData);
    if (fromRaw !== null) {
      slugs.push(fromRaw);
      continue;
    }
    if (entreprise.wttjUrl) {
      const fromWttj = companySlugFromWttjUrl(entreprise.wttjUrl);
      if (fromWttj !== null) {
        slugs.push(fromWttj);
      }
    }
  }
  return slugs;
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function companyPageFromOfferUrl(offerUrl: string): string | null {
  const match = offerUrl.match(
    /^(https:\/\/(?:www\.)?welcometothejungle\.com\/fr\/companies\/[^/?#]+)/i,
  );
  return match?.[1] ?? null;
}

export function companySlugFromWttjUrl(url: string): string | null {
  const page = companyPageFromOfferUrl(url);
  if (page === null) {
    return null;
  }
  const slug = page.slice(page.lastIndexOf("/") + 1).trim().toLowerCase();
  return slug.length > 0 ? slug : null;
}
