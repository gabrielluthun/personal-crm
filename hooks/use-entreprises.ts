"use client";

import { useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

const DEFAULT_PAGE_SIZE = 50;

export function useEntreprises() {
  const { entreprises } = useRepositories();
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const list = useAsyncResource(
    () =>
      entreprises.list({
        search: debouncedSearch.trim() || undefined,
        pagination: { page, pageSize: DEFAULT_PAGE_SIZE },
        sort: { field: "name", direction: "asc" },
      }),
    [debouncedSearch, page],
  );

  function setSearch(value: string): void {
    setSearchState(value);
    setPage(1);
  }

  async function create(
    input: EntrepriseCreateInput,
  ): Promise<Result<Entreprise, DomainError>> {
    const result = await entreprises.create(input);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function update(
    id: EntrepriseId,
    input: EntrepriseUpdateInput,
  ): Promise<Result<Entreprise, DomainError>> {
    const result = await entreprises.update(id, input);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function remove(
    id: EntrepriseId,
  ): Promise<Result<void, DomainError>> {
    const result = await entreprises.delete(id);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function removeMany(
    ids: readonly EntrepriseId[],
  ): Promise<Result<void, DomainError>> {
    const result = await entreprises.deleteMany(ids);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  return {
    items: list.data?.items ?? [],
    total: list.data?.total ?? 0,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search,
    setSearch,
    setPage,
    isLoading: list.isLoading,
    error: list.error,
    reload: list.reload,
    create,
    update,
    remove,
    removeMany,
    getById: (id: EntrepriseId) => entreprises.getById(id),
  };
}
