import type {
  Interaction,
  InteractionCreateInput,
  InteractionId,
  InteractionUpdateInput,
} from "@/lib/domain/interaction";
import type { ContactId } from "@/lib/domain/contact";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type { ListQuery, PaginatedResult } from "@/lib/repositories/ports/query";

export type InteractionSortField = "sentAt" | "channel";

export type InteractionListQuery = ListQuery<InteractionSortField> & {
  readonly contactId?: ContactId;
  readonly responseReceived?: boolean;
};

export type InteractionPort = {
  list(
    query?: InteractionListQuery,
  ): Promise<Result<PaginatedResult<Interaction>, DomainError>>;
  listByContact(
    contactId: ContactId,
  ): Promise<Result<readonly Interaction[], DomainError>>;
  getById(id: InteractionId): Promise<Result<Interaction, DomainError>>;
  create(
    input: InteractionCreateInput,
  ): Promise<Result<Interaction, DomainError>>;
  update(
    id: InteractionId,
    input: InteractionUpdateInput,
  ): Promise<Result<Interaction, DomainError>>;
  delete(id: InteractionId): Promise<Result<void, DomainError>>;
};
