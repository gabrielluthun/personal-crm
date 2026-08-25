import type {
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import {
  notFoundError,
  repositoryError,
} from "@/lib/domain/shared/errors";
import { err, ok } from "@/lib/domain/shared/result";
import { createTimestamps } from "@/lib/domain/shared/timestamps";
import type {
  ContactListQuery,
  ContactPort,
} from "@/lib/repositories/ports/contact.port";
import { normalizePagination } from "@/lib/repositories/ports/query";
import {
  getSupabaseClient,
  type AppSupabaseClient,
} from "@/lib/supabase/client";
import { containsFilterValue } from "@/lib/supabase/filters";
import { mapContactInsert, mapContactRow } from "@/lib/supabase/mappers";
import { interpretDeleteCount } from "@/lib/repositories/supabase/interpret-delete-count";
import { mergeContactUpdate } from "@/lib/repositories/supabase/merge-contact-update";

export class SupabaseContactRepository implements ContactPort {
  constructor(private readonly client: AppSupabaseClient = getSupabaseClient()) {}

  async list(query: ContactListQuery = {}) {
    const { page, pageSize } = normalizePagination(query.pagination);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let builder = this.client.from("contacts").select("*", { count: "exact" });
    if (query.search?.trim()) {
      const term = containsFilterValue(query.search.trim());
      builder = builder.or(
        `first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term},job_title.ilike.${term},headline.ilike.${term}`,
      );
    }
    if (query.status) {
      builder = builder.eq("status", query.status);
    }
    if (query.statuses && query.statuses.length > 0) {
      builder = builder.in("status", [...query.statuses]);
    }
    if (query.entrepriseId !== undefined) {
      builder =
        query.entrepriseId === null
          ? builder.is("entreprise_id", null)
          : builder.eq("entreprise_id", query.entrepriseId);
    }
    const sort = query.sort ?? { field: "lastName", direction: "asc" };
    const columnMap = {
      lastName: "last_name",
      firstName: "first_name",
      status: "status",
      createdAt: "created_at",
      updatedAt: "updated_at",
    } as const;
    builder = builder
      .order(columnMap[sort.field], { ascending: sort.direction === "asc" })
      .range(from, to);
    const { data, error, count } = await builder;
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok({
      items: (data ?? []).map(mapContactRow),
      total: count ?? 0,
      page,
      pageSize,
    });
  }

  async listByEntreprise(entrepriseId: EntrepriseId) {
    const { data, error } = await this.client
      .from("contacts")
      .select("*")
      .eq("entreprise_id", entrepriseId)
      .order("last_name", { ascending: true });
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok((data ?? []).map(mapContactRow));
  }

  async getById(id: ContactId) {
    const { data, error } = await this.client
      .from("contacts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!data) {
      return err(notFoundError("Contact", id));
    }
    return ok(mapContactRow(data));
  }

  async create(input: ContactCreateInput) {
    const timestamps = createTimestamps();
    const { data, error } = await this.client
      .from("contacts")
      .insert(
        mapContactInsert({
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email ?? null,
          linkedinUrl: input.linkedinUrl ?? null,
          jobTitle: input.jobTitle ?? null,
          headline: input.headline ?? null,
          status: input.status ?? "À contacter",
          entrepriseId: input.entrepriseId ?? null,
          notes: input.notes ?? null,
          rawData: input.rawData ?? null,
          scrapedAt: input.scrapedAt ?? null,
          ...timestamps,
        }),
      )
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapContactRow(data));
  }

  async update(id: ContactId, input: ContactUpdateInput) {
    const current = await this.getById(id);
    if (!current.ok) {
      return current;
    }
    const updated = mergeContactUpdate(current.value, input);
    const { data, error } = await this.client
      .from("contacts")
      .update(mapContactInsert(updated))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapContactRow(data));
  }

  async delete(id: ContactId) {
    const { error, count } = await this.client
      .from("contacts")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!count) {
      return err(notFoundError("Contact", id));
    }
    return ok(undefined);
  }

  async deleteMany(ids: readonly ContactId[]) {
    if (ids.length === 0) {
      return ok(undefined);
    }
    const { error, count } = await this.client
      .from("contacts")
      .delete({ count: "exact" })
      .in("id", [...ids]);
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return interpretDeleteCount(count, ids.length, "contacts");
  }
}
