import type { JobSearchQuery } from "@/lib/domain/job-offer";
import type { JobSearchPort } from "@/lib/repositories/ports/job-search.port";
import { testBrightDataConnection } from "@/lib/tauri/bright-data";
import { searchJobs } from "@/lib/tauri/job-search";

/**
 * JobSearchPort via Tauri. Token stays in the OS keychain on the Rust side.
 */
export class TauriJobSearchRepository implements JobSearchPort {
  async search(query: JobSearchQuery) {
    return searchJobs(query);
  }

  async probeConnection() {
    return testBrightDataConnection();
  }
}
