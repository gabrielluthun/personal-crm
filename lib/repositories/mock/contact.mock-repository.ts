import { MOCK_CONTACTS } from "@/lib/data/mocks/contacts.mock";
import type {
  Contact,
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import { notFoundError } from "@/lib/domain/shared/errors";
import { generateId } from "@/lib/domain/shared/id";
import { err, ok } from "@/lib/domain/shared/result";
import {
  createTimestamps,
  touchUpdatedAt,
} from "@/lib/domain/shared/timestamps";
import type {
  ContactListQuery,
  ContactPort,
} from "@/lib/repositories/ports/contact.port";
import {
  InMemoryStore,
  compareStrings,
  paginateItems,
} from "@/lib/repositories/mock/in-memory-store";

export class MockContactRepository implements ContactPort {
  private readonly store = new InMemoryStore<Contact>(MOCK_CONTACTS);

  async list(query: ContactListQuery = {}) {
    let items = [...(await this.store.all())];
    const search = query.search?.trim().toLowerCase();
    if (search) {
      items = items.filter((item) => {
        const haystack =
          `${item.firstName} ${item.lastName} ${item.email ?? ""} ${item.jobTitle ?? ""} ${item.headline ?? ""}`.toLowerCase();
        return haystack.includes(search);
      });
    }
    if (query.status) {
      items = items.filter((item) => item.status === query.status);
    }
    if (query.statuses && query.statuses.length > 0) {
      const allowed = new Set(query.statuses);
      items = items.filter((item) => allowed.has(item.status));
    }
    if (query.entrepriseId !== undefined) {
      items = items.filter((item) => item.entrepriseId === query.entrepriseId);
    }
    const sort = query.sort ?? { field: "lastName", direction: "asc" };
    items.sort((left, right) =>
      compareStrings(String(left[sort.field]), String(right[sort.field]), sort.direction),
    );
    return ok(paginateItems(items, query.pagination));
  }

  async listByEntreprise(entrepriseId: EntrepriseId) {
    const items = (await this.store.all()).filter(
      (item) => item.entrepriseId === entrepriseId,
    );
    return ok(items);
  }

  async getById(id: ContactId) {
    const found = await this.store.findById(id);
    return found ? ok(found) : err(notFoundError("Contact", id));
  }

  async create(input: ContactCreateInput) {
    const created: Contact = {
      id: generateId<"Contact">(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email ?? null,
      linkedinUrl: input.linkedinUrl ?? null,
      phone: input.phone ?? null,
      whatsapp: input.whatsapp ?? null,
      jobTitle: input.jobTitle ?? null,
      headline: input.headline ?? null,
      status: input.status ?? "À contacter",
      entrepriseId: input.entrepriseId ?? null,
      notes: input.notes ?? null,
      lastMessageSentAt: input.lastMessageSentAt ?? null,
      rawData: input.rawData ?? null,
      scrapedAt: input.scrapedAt ?? null,
      ...createTimestamps(),
    };
    return ok(await this.store.insert(created));
  }

  async update(id: ContactId, input: ContactUpdateInput) {
    const current = await this.store.findById(id);
    if (!current) {
      return err(notFoundError("Contact", id));
    }
    const updated: Contact = {
      ...current,
      firstName: input.firstName?.trim() ?? current.firstName,
      lastName: input.lastName?.trim() ?? current.lastName,
      email: input.email === undefined ? current.email : input.email,
      linkedinUrl:
        input.linkedinUrl === undefined ? current.linkedinUrl : input.linkedinUrl,
      phone: input.phone === undefined ? current.phone : input.phone,
      whatsapp: input.whatsapp === undefined ? current.whatsapp : input.whatsapp,
      jobTitle: input.jobTitle === undefined ? current.jobTitle : input.jobTitle,
      headline: input.headline === undefined ? current.headline : input.headline,
      status: input.status ?? current.status,
      entrepriseId:
        input.entrepriseId === undefined
          ? current.entrepriseId
          : input.entrepriseId,
      notes: input.notes === undefined ? current.notes : input.notes,
      lastMessageSentAt:
        input.lastMessageSentAt === undefined
          ? current.lastMessageSentAt
          : input.lastMessageSentAt,
      rawData: input.rawData === undefined ? current.rawData : input.rawData,
      scrapedAt:
        input.scrapedAt === undefined ? current.scrapedAt : input.scrapedAt,
      ...touchUpdatedAt(current),
    };
    const saved = await this.store.replace(id, updated);
    return saved ? ok(saved) : err(notFoundError("Contact", id));
  }

  async delete(id: ContactId) {
    const removed = await this.store.remove(id);
    return removed ? ok(undefined) : err(notFoundError("Contact", id));
  }

  async deleteMany(ids: readonly ContactId[]) {
    if (ids.length === 0) {
      return ok(undefined);
    }
    const removed = await this.store.removeMany(ids);
    if (removed === 0) {
      return err(notFoundError("Contact"));
    }
    return ok(undefined);
  }
}
