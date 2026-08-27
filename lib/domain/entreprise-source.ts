import type { Entreprise } from "@/lib/domain/entreprise";
import type { JobBoardSource } from "@/lib/domain/job-board-source";

/**
 * Effective board source for display / filters.
 * Older CRM rows often have a WTTJ URL but no `source` in rawData yet.
 */
export function resolveEntrepriseSource(
  entreprise: Pick<Entreprise, "source" | "wttjUrl" | "targetOfferUrl">,
): JobBoardSource | null {
  if (entreprise.source !== null) {
    return entreprise.source;
  }
  if ((entreprise.wttjUrl?.trim().length ?? 0) > 0) {
    return "wttj";
  }
  const offer = entreprise.targetOfferUrl?.toLowerCase() ?? "";
  if (offer.includes("indeed.")) {
    return "indeed";
  }
  return null;
}

/** Job offer URL for the Source column (not the company board page). */
export function boardUrlForEntreprise(
  entreprise: Pick<
    Entreprise,
    "source" | "wttjUrl" | "targetOfferUrl"
  >,
): string | null {
  const offer = entreprise.targetOfferUrl?.trim() ?? "";
  if (offer.length > 0) {
    return offer;
  }
  // Legacy rows: only company page stored — better than a dead icon.
  if (resolveEntrepriseSource(entreprise) === "wttj") {
    const company = entreprise.wttjUrl?.trim() ?? "";
    return company.length > 0 ? company : null;
  }
  return null;
}
