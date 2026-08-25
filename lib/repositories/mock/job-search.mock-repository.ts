import { MOCK_JOB_OFFERS } from "@/lib/data/mocks/job-offers.mock";
import type { JobOffer, JobSearchQuery } from "@/lib/domain/job-offer";
import { ok } from "@/lib/domain/shared/result";
import type { JobSearchPort } from "@/lib/repositories/ports/job-search.port";
import { simulateLatency } from "@/lib/repositories/mock/in-memory-store";

/**
 * Stand-in for Bright Data MCP collection via Tauri.
 * Filters fixture WTTJ-like rows locally until the Rust bridge lands.
 */
export class MockJobSearchRepository implements JobSearchPort {
  async search(query: JobSearchQuery) {
    await simulateLatency(120);
    const keywords = query.keywords.trim().toLowerCase();
    const location = query.location?.trim().toLowerCase();

    const items: JobOffer[] = MOCK_JOB_OFFERS.filter((offer) => {
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

      return matchesKeywords && matchesLocation && matchesContract;
    });

    return ok(items);
  }
}
