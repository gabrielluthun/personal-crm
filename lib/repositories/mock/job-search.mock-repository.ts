import { MOCK_JOB_OFFERS } from "@/lib/data/mocks/job-offers.mock";
import type { JobOffer, JobSearchQuery } from "@/lib/domain/job-offer";
import { ok } from "@/lib/domain/shared/result";
import type { JobSearchPort } from "@/lib/repositories/ports/job-search.port";
import { simulateLatency } from "@/lib/repositories/mock/in-memory-store";

const PAGE_COMPANY_CAP = 10;

/**
 * Browser stand-in for Bright Data SERP (Tauri only in production).
 * Filters local fixture rows — no real network.
 */
export class MockJobSearchRepository implements JobSearchPort {
  async search(query: JobSearchQuery) {
    await simulateLatency(120);
    const keywords = query.keywords.trim().toLowerCase();
    const location = query.location?.trim().toLowerCase();
    const page = Math.max(1, query.page ?? 1);
    const excludedSlugs = new Set(
      (query.excludeSlugs ?? []).map((slug) => slug.trim().toLowerCase()),
    );
    const excludedNames = new Set(
      (query.excludeNames ?? []).map((name) => name.trim().toLowerCase()),
    );

    const filtered = MOCK_JOB_OFFERS.filter((offer) => {
      const matchesKeywords =
        keywords.length === 0 ||
        offer.title.toLowerCase().includes(keywords) ||
        offer.companyName.toLowerCase().includes(keywords) ||
        (offer.descriptionSnippet?.toLowerCase().includes(keywords) ?? false);

      const matchesLocation =
        !location ||
        location.length === 0 ||
        offer.location.toLowerCase().includes(location);

      const matchesContract =
        !query.contractType || offer.contractType === query.contractType;

      const slug = offer.companySlug.toLowerCase();
      const name = offer.companyName.trim().toLowerCase();
      if (excludedSlugs.has(slug) || excludedNames.has(name)) {
        return false;
      }

      return matchesKeywords && matchesLocation && matchesContract;
    });

    const seen = new Set<string>();
    const pageCompanies: string[] = [];
    for (const offer of filtered) {
      const slug = offer.companySlug.toLowerCase();
      if (seen.has(slug)) {
        continue;
      }
      seen.add(slug);
      pageCompanies.push(slug);
    }

    const start = (page - 1) * PAGE_COMPANY_CAP;
    const allowed = new Set(pageCompanies.slice(start, start + PAGE_COMPANY_CAP));
    const items: JobOffer[] = filtered.filter((offer) =>
      allowed.has(offer.companySlug.toLowerCase()),
    );

    return ok(items);
  }

  async probeConnection() {
    await simulateLatency(80);
    return ok({ ok: true as const, zoneCount: null });
  }
}
