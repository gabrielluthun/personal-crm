import type { JobOffer } from "@/lib/domain/job-offer";
import type { Entreprise } from "@/lib/domain/entreprise";

/** Companies returned per SERP page (aligned with Rust `MAX_COMPANIES`). */
export const COMPANIES_PER_SEARCH_PAGE = 10;

export type CompanyProposition = {
  readonly id: JobOffer["id"];
  readonly companyName: string;
  readonly location: string;
  readonly activity: string | null;
  readonly websiteUrl: string | null;
  readonly linkedinUrl: string | null;
  readonly companyWttjUrl: string | null;
  readonly offerWttjUrl: string;
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
  const knownSlugs = new Set(
    entreprises
      .map((entreprise) =>
        entreprise.wttjUrl
          ? companySlugFromWttjUrl(entreprise.wttjUrl)
          : null,
      )
      .filter((slug): slug is string => slug !== null),
  );
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
      location: offer.location,
      activity: offer.descriptionSnippet,
      websiteUrl: offer.companyWebsiteUrl,
      linkedinUrl: offer.companyLinkedinUrl,
      companyWttjUrl: companyPageFromOfferUrl(offer.wttjUrl),
      offerWttjUrl: offer.wttjUrl,
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
  const excludeSlugs: string[] = [];
  const excludeNames: string[] = [];
  for (const entreprise of entreprises) {
    const slug = entreprise.wttjUrl
      ? companySlugFromWttjUrl(entreprise.wttjUrl)
      : null;
    if (slug !== null) {
      excludeSlugs.push(slug);
    }
    const name = entreprise.name.trim();
    if (name.length > 0) {
      excludeNames.push(name);
    }
  }
  return { excludeSlugs, excludeNames };
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
