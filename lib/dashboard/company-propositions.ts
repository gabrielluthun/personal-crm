import type { JobOffer } from "@/lib/domain/job-offer";
import type { Entreprise } from "@/lib/domain/entreprise";

const MAX_PROPOSITIONS = 10;

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
  readonly maxPropositions: number;
};

/**
 * One card per company, skip names already in the CRM, cap at 10.
 */
export function buildCompanyPropositions(
  offers: readonly JobOffer[],
  entreprises: readonly Entreprise[],
): {
  readonly propositions: readonly CompanyProposition[];
  readonly stats: PropositionStats;
} {
  const known = new Set(
    entreprises.map((entreprise) => normalizeName(entreprise.name)),
  );
  const seen = new Set<string>();
  const propositions: CompanyProposition[] = [];

  for (const offer of offers) {
    const key = normalizeName(offer.companyName);
    if (key.length === 0 || seen.has(key) || known.has(key)) {
      continue;
    }
    seen.add(key);
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
    if (propositions.length >= MAX_PROPOSITIONS) {
      break;
    }
  }

  return {
    propositions,
    stats: {
      rawCount: offers.length,
      propositionCount: propositions.length,
      maxPropositions: MAX_PROPOSITIONS,
    },
  };
}

export function formatPropositionStatus(stats: PropositionStats): string {
  return `${stats.propositionCount} proposition(s) hors base (max. ${stats.maxPropositions}) sur ${stats.rawCount} résultat(s) bruts.`;
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

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function companyPageFromOfferUrl(offerUrl: string): string | null {
  const match = offerUrl.match(
    /^(https:\/\/(?:www\.)?welcometothejungle\.com\/fr\/companies\/[^/?#]+)/i,
  );
  return match?.[1] ?? null;
}
