import type { ContactId } from "@/lib/domain/contact";
import type {
  Interaction,
  InteractionCreateInput,
  InteractionId,
  InteractionUpdateInput,
} from "@/lib/domain/interaction";
import { notFoundError } from "@/lib/domain/shared/errors";
import { generateId } from "@/lib/domain/shared/id";
import { err, ok } from "@/lib/domain/shared/result";
import { toIsoDateTime } from "@/lib/domain/shared/timestamps";
import type {
  InteractionListQuery,
  InteractionPort,
} from "@/lib/repositories/ports/interaction.port";
import {
  InMemoryStore,
  compareStrings,
  paginateItems,
} from "@/lib/repositories/mock/in-memory-store";

export class MockInteractionRepository implements InteractionPort {
  private readonly store = new InMemoryStore<Interaction>([]);

  async list(query: InteractionListQuery = {}) {
    let items = [...(await this.store.all())];
    if (query.contactId) {
      items = items.filter((item) => item.contactId === query.contactId);
    }
    if (query.responseReceived !== undefined) {
      items = items.filter(
        (item) => item.responseReceived === query.responseReceived,
      );
    }
    const sort = query.sort ?? { field: "sentAt", direction: "desc" };
    items.sort((left, right) =>
      compareStrings(String(left[sort.field]), String(right[sort.field]), sort.direction),
    );
    return ok(paginateItems(items, query.pagination));
  }

  async listByContact(contactId: ContactId) {
    const items = (await this.store.all()).filter(
      (item) => item.contactId === contactId,
    );
    return ok(items);
  }

  async getById(id: InteractionId) {
    const found = await this.store.findById(id);
    return found ? ok(found) : err(notFoundError("Interaction", id));
  }

  async create(input: InteractionCreateInput) {
    const created: Interaction = {
      id: generateId<"Interaction">(),
      contactId: input.contactId,
      templateId: input.templateId ?? null,
      channel: input.channel.trim(),
      messageSent: input.messageSent,
      sentAt: input.sentAt ?? toIsoDateTime(new Date()),
      responseReceived: input.responseReceived ?? false,
    };
    return ok(await this.store.insert(created));
  }

  async update(id: InteractionId, input: InteractionUpdateInput) {
    const current = await this.store.findById(id);
    if (!current) {
      return err(notFoundError("Interaction", id));
    }
    const updated: Interaction = {
      ...current,
      templateId:
        input.templateId === undefined ? current.templateId : input.templateId,
      channel: input.channel?.trim() ?? current.channel,
      messageSent: input.messageSent ?? current.messageSent,
      sentAt: input.sentAt ?? current.sentAt,
      responseReceived:
        input.responseReceived === undefined
          ? current.responseReceived
          : input.responseReceived,
    };
    const saved = await this.store.replace(id, updated);
    return saved ? ok(saved) : err(notFoundError("Interaction", id));
  }

  async delete(id: InteractionId) {
    const removed = await this.store.remove(id);
    return removed ? ok(undefined) : err(notFoundError("Interaction", id));
  }
}
