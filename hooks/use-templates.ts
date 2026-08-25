"use client";

import { useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

const DEFAULT_PAGE_SIZE = 50;

export function useTemplates() {
  const { templates } = useRepositories();
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const list = useAsyncResource(
    () =>
      templates.list({
        search: debouncedSearch.trim() || undefined,
        pagination: { page, pageSize: DEFAULT_PAGE_SIZE },
        sort: { field: "title", direction: "asc" },
      }),
    [debouncedSearch, page],
  );

  function setSearch(value: string): void {
    setSearchState(value);
    setPage(1);
  }

  async function create(
    input: MessageTemplateCreateInput,
  ): Promise<Result<MessageTemplate, DomainError>> {
    const result = await templates.create(input);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function update(
    id: TemplateId,
    input: MessageTemplateUpdateInput,
  ): Promise<Result<MessageTemplate, DomainError>> {
    const result = await templates.update(id, input);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function remove(
    id: TemplateId,
  ): Promise<Result<void, DomainError>> {
    const result = await templates.delete(id);
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
    getById: (id: TemplateId) => templates.getById(id),
  };
}
