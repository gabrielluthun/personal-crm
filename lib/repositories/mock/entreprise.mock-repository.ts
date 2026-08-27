import type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";
import { MOCK_ENTREPRISES } from "@/lib/data/mocks/entreprises.mock";
import { writeJobBoardMetaToRaw } from "@/lib/domain/job-board-source-storage";
import { notFoundError } from "@/lib/domain/shared/errors";
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
import {
  InMemoryStore,
  compareStrings,
  paginateItems,
} from "@/lib/repositories/mock/in-memory-store";

export class MockEntrepriseRepository implements EntreprisePort {
  private readonly store = new InMemoryStore<Entreprise>(MOCK_ENTREPRISES);

  async list(query: EntrepriseListQuery = {}) {
    let items = [...(await this.store.all())];
    const search = query.search?.trim().toLowerCase();
    if (search) {
      items = items.filter((item) => {
        const haystack = `${item.name} ${item.location ?? ""}`.toLowerCase();
        return haystack.includes(search);
      });
    }
    const sort = query.sort ?? { field: "name", direction: "asc" };
    items.sort((left, right) => {
      if (sort.field === "name") {
        return compareStrings(left.name, right.name, sort.direction);
      }
      return compareStrings(left[sort.field], right[sort.field], sort.direction);
    });
    return ok(paginateItems(items, query.pagination));
  }

  async getById(id: EntrepriseId) {
    const found = await this.store.findById(id);
    if (!found) {
      return err(notFoundError("Entreprise", id));
    }
    return ok(found);
  }

  async create(input: EntrepriseCreateInput) {
    const timestamps = createTimestamps();
    const source = input.source ?? null;
    const created: Entreprise = {
      id: generateId<"Entreprise">(),
      name: input.name.trim(),
      linkedinUrl: input.linkedinUrl ?? null,
      websiteUrl: input.websiteUrl ?? null,
      wttjUrl: input.wttjUrl ?? null,
      location: input.location ?? null,
      targetOfferUrl: input.targetOfferUrl ?? null,
      notes: input.notes ?? null,
      source,
      rawData: writeJobBoardMetaToRaw(input.rawData ?? null, { source }),
      scrapedAt: input.scrapedAt ?? null,
      ...timestamps,
    };
    return ok(await this.store.insert(created));
  }

  async update(id: EntrepriseId, input: EntrepriseUpdateInput) {
    const current = await this.store.findById(id);
    if (!current) {
      return err(notFoundError("Entreprise", id));
    }
    const source =
      input.source === undefined ? current.source : input.source;
    const rawDataBase =
      input.rawData === undefined ? current.rawData : input.rawData;
    const updated: Entreprise = {
      ...current,
      name: input.name?.trim() ?? current.name,
      linkedinUrl:
        input.linkedinUrl === undefined ? current.linkedinUrl : input.linkedinUrl,
      websiteUrl:
        input.websiteUrl === undefined ? current.websiteUrl : input.websiteUrl,
      wttjUrl: input.wttjUrl === undefined ? current.wttjUrl : input.wttjUrl,
      location: input.location === undefined ? current.location : input.location,
      targetOfferUrl:
        input.targetOfferUrl === undefined
          ? current.targetOfferUrl
          : input.targetOfferUrl,
      notes: input.notes === undefined ? current.notes : input.notes,
      source,
      rawData: writeJobBoardMetaToRaw(rawDataBase, { source }),
      scrapedAt:
        input.scrapedAt === undefined ? current.scrapedAt : input.scrapedAt,
      ...touchUpdatedAt(current),
    };
    const saved = await this.store.replace(id, updated);
    return saved ? ok(saved) : err(notFoundError("Entreprise", id));
  }

  async delete(id: EntrepriseId) {
    const removed = await this.store.remove(id);
    return removed ? ok(undefined) : err(notFoundError("Entreprise", id));
  }

  async deleteMany(ids: readonly EntrepriseId[]) {
    await this.store.removeMany(ids);
    return ok(undefined);
  }
}
