import type {
  Interaction,
  InteractionCreateInput,
  InteractionId,
  InteractionUpdateInput,
} from "@/lib/domain/interaction";
import type { ContactId } from "@/lib/domain/contact";
import {
  notFoundError,
  repositoryError,
} from "@/lib/domain/shared/errors";
import { err, ok } from "@/lib/domain/shared/result";
import { toIsoDateTime } from "@/lib/domain/shared/timestamps";
import type {
  InteractionListQuery,
  InteractionPort,
} from "@/lib/repositories/ports/interaction.port";
import { normalizePagination } from "@/lib/repositories/ports/query";
import {
  getSupabaseClient,
  type AppSupabaseClient,
} from "@/lib/supabase/client";
import {
  mapInteractionInsert,
  mapInteractionRow,
} from "@/lib/supabase/mappers";

export class SupabaseInteractionRepository implements InteractionPort {
  constructor(private readonly client: AppSupabaseClient = getSupabaseClient()) {}

  async list(query: InteractionListQuery = {}) {
    const { page, pageSize } = normalizePagination(query.pagination);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let builder = this.client
      .from("interactions")
      .select("*", { count: "exact" });
    if (query.contactId) {
      builder = builder.eq("contact_id", query.contactId);
    }
    if (query.responseReceived !== undefined) {
      builder = builder.eq("response_received", query.responseReceived);
    }
    const sort = query.sort ?? { field: "sentAt", direction: "desc" };
    const column = sort.field === "channel" ? "channel" : "sent_at";
    builder = builder
      .order(column, { ascending: sort.direction === "asc" })
      .range(from, to);
    const { data, error, count } = await builder;
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok({
      items: (data ?? []).map(mapInteractionRow),
      total: count ?? 0,
      page,
      pageSize,
    });
  }

  async listByContact(contactId: ContactId) {
    const { data, error } = await this.client
      .from("interactions")
      .select("*")
      .eq("contact_id", contactId)
      .order("sent_at", { ascending: false });
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok((data ?? []).map(mapInteractionRow));
  }

  async getById(id: InteractionId) {
    const { data, error } = await this.client
      .from("interactions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!data) {
      return err(notFoundError("Interaction", id));
    }
    return ok(mapInteractionRow(data));
  }

  async create(input: InteractionCreateInput) {
    const { data, error } = await this.client
      .from("interactions")
      .insert(
        mapInteractionInsert({
          contactId: input.contactId,
          templateId: input.templateId ?? null,
          channel: input.channel.trim(),
          messageSent: input.messageSent,
          sentAt: input.sentAt ?? toIsoDateTime(new Date()),
          responseReceived: input.responseReceived ?? false,
        }),
      )
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapInteractionRow(data));
  }

  async update(id: InteractionId, input: InteractionUpdateInput) {
    const current = await this.getById(id);
    if (!current.ok) {
      return current;
    }
    const updated: Interaction = {
      ...current.value,
      templateId:
        input.templateId === undefined
          ? current.value.templateId
          : input.templateId,
      channel: input.channel?.trim() ?? current.value.channel,
      messageSent: input.messageSent ?? current.value.messageSent,
      sentAt: input.sentAt ?? current.value.sentAt,
      responseReceived:
        input.responseReceived === undefined
          ? current.value.responseReceived
          : input.responseReceived,
    };
    const { data, error } = await this.client
      .from("interactions")
      .update(mapInteractionInsert(updated))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return err(repositoryError(error.message, error));
    }
    return ok(mapInteractionRow(data));
  }

  async delete(id: InteractionId) {
    const { error, count } = await this.client
      .from("interactions")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) {
      return err(repositoryError(error.message, error));
    }
    if (!count) {
      return err(notFoundError("Interaction", id));
    }
    return ok(undefined);
  }
}
