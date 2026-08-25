import type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";
import {
  notFoundError,
  repositoryError,
} from "@/lib/domain/shared/errors";
import { generateId } from "@/lib/domain/shared/id";
import { err, ok } from "@/lib/domain/shared/result";
import {
  createTimestamps,
  touchUpdatedAt,
} from "@/lib/domain/shared/timestamps";
import type {
  EntrepriseListQuery,
  EntreprisePort,
} from "@/lib/repositories/ports/entreprise.port";
import { normalizePagination } from "@/lib/repositories/ports/query";
import {
  getSupabaseClient,
  type AppSupabaseClient,
} from "@/lib/supabase/client";
import { containsPattern } from "@/lib/supabase/filters";
import {
  mapEntrepriseRow,
  mapEntrepriseToInsert,
} from "@/lib/supabase/mappers";

export class SupabaseEntrepriseRepository implements EntreprisePort {
  constructor(private readonly client: AppSupabaseClient = getSupabaseClient()) {}

  async list(query: EntrepriseListQuery = {}) {
    const { page, pageSize } = normalizePagination(query.pagination);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let builder = this.client
      .from("entreprises")
      .select("*", { count: "exact" });
    if (query.search?.trim()) {
      builder = builder.ilike("name", containsPattern(query.search.trim()));
    }
    const sort = query.sort ?? { field: "name", direction: "asc" };
    const column =
      sort.field === "name"
        ? "name"
        : sort.field === "createdAt"
          ? "created_at"
          : "updated_at";
    builder = builder
      .order(column, { ascending: sort.direction === "asc" })
      .range(from, to);
    const { data, error, count } = await builder;
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok({
      items: (data ?? []).map(mapEntrepriseRow),
      total: count ?? 0,
      page,
      pageSize,
    });
  }

  async getById(id: EntrepriseId) {
    const { data, error } = await this.client
      .from("entreprises")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!data) {
      return err(notFoundError("Entreprise", id));
    }
    return ok(mapEntrepriseRow(data));
  }

  async create(input: EntrepriseCreateInput) {
    const timestamps = createTimestamps();
    const entity: Entreprise = {
      id: generateId<"Entreprise">("ent"),
      name: input.name.trim(),
      linkedinUrl: input.linkedinUrl ?? null,
      websiteUrl: input.websiteUrl ?? null,
      wttjUrl: input.wttjUrl ?? null,
      notes: input.notes ?? null,
      ...timestamps,
    };
    const { data, error } = await this.client
      .from("entreprises")
      .insert(mapEntrepriseToInsert(entity))
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapEntrepriseRow(data));
  }

  async update(id: EntrepriseId, input: EntrepriseUpdateInput) {
    const current = await this.getById(id);
    if (!current.ok) {
      return current;
    }
    const updated: Entreprise = {
      ...current.value,
      name: input.name?.trim() ?? current.value.name,
      linkedinUrl:
        input.linkedinUrl === undefined
          ? current.value.linkedinUrl
          : input.linkedinUrl,
      websiteUrl:
        input.websiteUrl === undefined
          ? current.value.websiteUrl
          : input.websiteUrl,
      wttjUrl:
        input.wttjUrl === undefined ? current.value.wttjUrl : input.wttjUrl,
      notes: input.notes === undefined ? current.value.notes : input.notes,
      ...touchUpdatedAt(current.value),
    };
    const { data, error } = await this.client
      .from("entreprises")
      .update(mapEntrepriseToInsert(updated))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapEntrepriseRow(data));
  }

  async delete(id: EntrepriseId) {
    const { error, count } = await this.client
      .from("entreprises")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!count) {
      return err(notFoundError("Entreprise", id));
    }
    return ok(undefined);
  }

  async deleteMany(ids: readonly EntrepriseId[]) {
    if (ids.length === 0) {
      return ok(undefined);
    }
    const { error } = await this.client
      .from("entreprises")
      .delete()
      .in("id", [...ids]);
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(undefined);
  }
}
