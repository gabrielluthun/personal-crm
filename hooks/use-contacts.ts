"use client";

import { useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  Contact,
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import { DISCUSSION_STATUSES } from "@/lib/domain/contact-status";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

const DEFAULT_PAGE_SIZE = 50;

export type ContactTab = "all" | "discussion";

export function useContacts() {
  const { contacts } = useRepositories();
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTabState] = useState<ContactTab>("all");
  const debouncedSearch = useDebouncedValue(search);

  const list = useAsyncResource(
    () =>
      contacts.list({
        search: debouncedSearch.trim() || undefined,
        statuses: tab === "discussion" ? DISCUSSION_STATUSES : undefined,
        pagination: { page, pageSize: DEFAULT_PAGE_SIZE },
        sort: { field: "lastName", direction: "asc" },
      }),
    [debouncedSearch, page, tab],
  );

  function setSearch(value: string): void {
    setSearchState(value);
    setPage(1);
  }

  function setTab(value: ContactTab): void {
    setTabState(value);
    setPage(1);
  }

  async function create(
    input: ContactCreateInput,
  ): Promise<Result<Contact, DomainError>> {
    const result = await contacts.create(input);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function update(
    id: ContactId,
    input: ContactUpdateInput,
  ): Promise<Result<Contact, DomainError>> {
    const result = await contacts.update(id, input);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function remove(
    id: ContactId,
  ): Promise<Result<void, DomainError>> {
    const result = await contacts.delete(id);
    if (result.ok) {
      list.reload();
    }
    return result;
  }

  async function removeMany(
    ids: readonly ContactId[],
  ): Promise<Result<void, DomainError>> {
    const result = await contacts.deleteMany(ids);
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
    tab,
    setTab,
    setPage,
    isLoading: list.isLoading,
    error: list.error,
    reload: list.reload,
    create,
    update,
    remove,
    removeMany,
    getById: (id: ContactId) => contacts.getById(id),
    listByEntreprise: (entrepriseId: EntrepriseId) =>
      contacts.listByEntreprise(entrepriseId),
  };
}
