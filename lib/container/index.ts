import {
  createRepositories,
  type AppRepositories,
  type DataSource,
} from "@/lib/container/registry";

let instance: AppRepositories | null = null;

/** Singleton composition root — the only place that owns repository instances. */
export function getRepositories(): AppRepositories {
  if (instance === null) {
    instance = createRepositories();
  }
  return instance;
}

/** Replace the singleton (tests / explicit DataSource override). */
export function setRepositories(repositories: AppRepositories): void {
  instance = repositories;
}

/** Drop the singleton so the next getRepositories() rebuilds it. */
export function resetRepositories(): void {
  instance = null;
}

export function createRepositoriesFor(
  source: DataSource,
): AppRepositories {
  return createRepositories(source);
}

export type { AppRepositories, DataSource };
