import { MOCK_TEMPLATES } from "@/lib/data/mocks/templates.mock";
import type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";
import { notFoundError } from "@/lib/domain/shared/errors";
import { generateId } from "@/lib/domain/shared/id";
import { err, ok } from "@/lib/domain/shared/result";
import {
  createTimestamps,
  touchUpdatedAt,
} from "@/lib/domain/shared/timestamps";
import type {
  TemplateListQuery,
  TemplatePort,
} from "@/lib/repositories/ports/template.port";
import {
  InMemoryStore,
  compareStrings,
  paginateItems,
} from "@/lib/repositories/mock/in-memory-store";

export class MockTemplateRepository implements TemplatePort {
  private readonly store = new InMemoryStore<MessageTemplate>(MOCK_TEMPLATES);

  async list(query: TemplateListQuery = {}) {
    let items = [...(await this.store.all())];
    const search = query.search?.trim().toLowerCase();
    if (search) {
      items = items.filter((item) => {
        const haystack =
          `${item.title} ${item.description ?? ""} ${item.body} ${item.channel}`.toLowerCase();
        return haystack.includes(search);
      });
    }
    const sort = query.sort ?? { field: "title", direction: "asc" };
    items.sort((left, right) =>
      compareStrings(String(left[sort.field]), String(right[sort.field]), sort.direction),
    );
    return ok(paginateItems(items, query.pagination));
  }

  async getById(id: TemplateId) {
    const found = await this.store.findById(id);
    return found ? ok(found) : err(notFoundError("Template", id));
  }

  async create(input: MessageTemplateCreateInput) {
    const created: MessageTemplate = {
      id: generateId<"Template">(),
      title: input.title.trim(),
      body: input.body,
      description: input.description ?? null,
      channel: input.channel?.trim() || "linkedin",
      subject: input.subject ?? null,
      ...createTimestamps(),
    };
    return ok(await this.store.insert(created));
  }

  async update(id: TemplateId, input: MessageTemplateUpdateInput) {
    const current = await this.store.findById(id);
    if (!current) {
      return err(notFoundError("Template", id));
    }
    const updated: MessageTemplate = {
      ...current,
      title: input.title?.trim() ?? current.title,
      body: input.body ?? current.body,
      description:
        input.description === undefined ? current.description : input.description,
      channel: input.channel?.trim() ?? current.channel,
      subject: input.subject === undefined ? current.subject : input.subject,
      ...touchUpdatedAt(current),
    };
    const saved = await this.store.replace(id, updated);
    return saved ? ok(saved) : err(notFoundError("Template", id));
  }

  async delete(id: TemplateId) {
    const removed = await this.store.remove(id);
    return removed ? ok(undefined) : err(notFoundError("Template", id));
  }
}
