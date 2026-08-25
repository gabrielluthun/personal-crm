import { normalizePagination } from "@/lib/repositories/ports/query";
import type {
  PaginatedResult,
  PaginationSpec,
  SortDirection,
} from "@/lib/repositories/ports/query";

const DEFAULT_LATENCY_MS = 80;

export type EntityWithId = {
  readonly id: string;
};

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

export async function simulateLatency(
  ms: number = DEFAULT_LATENCY_MS,
): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Mutable in-memory collection with defensive cloning on read/write.
 */
export class InMemoryStore<T extends EntityWithId> {
  private items: T[];

  constructor(seed: readonly T[]) {
    this.items = seed.map((item) => cloneValue(item));
  }

  async all(): Promise<readonly T[]> {
    await simulateLatency();
    return this.items.map((item) => cloneValue(item));
  }

  async findById(id: string): Promise<T | null> {
    await simulateLatency();
    const found = this.items.find((item) => item.id === id);
    return found ? cloneValue(found) : null;
  }

  async insert(item: T): Promise<T> {
    await simulateLatency();
    const cloned = cloneValue(item);
    this.items = [...this.items, cloned];
    return cloneValue(cloned);
  }

  async replace(id: string, item: T): Promise<T | null> {
    await simulateLatency();
    const index = this.items.findIndex((current) => current.id === id);
    if (index < 0) {
      return null;
    }
    const cloned = cloneValue(item);
    this.items = [
      ...this.items.slice(0, index),
      cloned,
      ...this.items.slice(index + 1),
    ];
    return cloneValue(cloned);
  }

  async remove(id: string): Promise<boolean> {
    await simulateLatency();
    const before = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    return this.items.length < before;
  }

  async removeMany(ids: readonly string[]): Promise<number> {
    await simulateLatency();
    const idSet = new Set(ids);
    const before = this.items.length;
    this.items = this.items.filter((item) => !idSet.has(item.id));
    return before - this.items.length;
  }
}

export function paginateItems<T>(
  items: readonly T[],
  pagination: PaginationSpec | undefined,
): PaginatedResult<T> {
  const { page, pageSize } = normalizePagination(pagination);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

export function compareStrings(
  left: string,
  right: string,
  direction: SortDirection,
): number {
  const result = left.localeCompare(right, "fr", { sensitivity: "base" });
  return direction === "asc" ? result : -result;
}
