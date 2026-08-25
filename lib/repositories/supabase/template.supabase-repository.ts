import type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";
import {
  notFoundError,
  repositoryError,
} from "@/lib/domain/shared/errors";
import { err, ok } from "@/lib/domain/shared/result";
import {
  createTimestamps,
  touchUpdatedAt,
} from "@/lib/domain/shared/timestamps";
import type {
  TemplateListQuery,
  TemplatePort,
} from "@/lib/repositories/ports/template.port";
import { normalizePagination } from "@/lib/repositories/ports/query";
import {
  getSupabaseClient,
  type AppSupabaseClient,
} from "@/lib/supabase/client";
import { containsFilterValue } from "@/lib/supabase/filters";
import { mapTemplateInsert, mapTemplateRow } from "@/lib/supabase/mappers";

export class SupabaseTemplateRepository implements TemplatePort {
  constructor(private readonly client: AppSupabaseClient = getSupabaseClient()) {}

  async list(query: TemplateListQuery = {}) {
    const { page, pageSize } = normalizePagination(query.pagination);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let builder = this.client.from("templates").select("*", { count: "exact" });
    if (query.search?.trim()) {
      const term = containsFilterValue(query.search.trim());
      builder = builder.or(
        `title.ilike.${term},description.ilike.${term},body.ilike.${term},channel.ilike.${term}`,
      );
    }
    const sort = query.sort ?? { field: "title", direction: "asc" };
    const columnMap = {
      title: "title",
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
      items: (data ?? []).map(mapTemplateRow),
      total: count ?? 0,
      page,
      pageSize,
    });
  }

  async getById(id: TemplateId) {
    const { data, error } = await this.client
      .from("templates")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!data) {
      return err(notFoundError("Template", id));
    }
    return ok(mapTemplateRow(data));
  }

  async create(input: MessageTemplateCreateInput) {
    const timestamps = createTimestamps();
    const { data, error } = await this.client
      .from("templates")
      .insert(
        mapTemplateInsert({
          title: input.title.trim(),
          body: input.body,
          description: input.description ?? null,
          channel: input.channel?.trim() || "linkedin",
          subject: input.subject ?? null,
          ...timestamps,
        }),
      )
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapTemplateRow(data));
  }

  async update(id: TemplateId, input: MessageTemplateUpdateInput) {
    const current = await this.getById(id);
    if (!current.ok) {
      return current;
    }
    const updated: MessageTemplate = {
      ...current.value,
      title: input.title?.trim() ?? current.value.title,
      body: input.body ?? current.value.body,
      description:
        input.description === undefined
          ? current.value.description
          : input.description,
      channel: input.channel?.trim() ?? current.value.channel,
      subject:
        input.subject === undefined ? current.value.subject : input.subject,
      ...touchUpdatedAt(current.value),
    };
    const { data, error } = await this.client
      .from("templates")
      .update(mapTemplateInsert(updated))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapTemplateRow(data));
  }

  async delete(id: TemplateId) {
    const { error, count } = await this.client
      .from("templates")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!count) {
      return err(notFoundError("Template", id));
    }
    return ok(undefined);
  }
}
