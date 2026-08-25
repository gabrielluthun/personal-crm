import type { ContactStatus } from "@/lib/domain/contact-status";
import type {
  Contact,
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type { ListQuery, PaginatedResult } from "@/lib/repositories/ports/query";

export type ContactSortField =
  | "lastName"
  | "firstName"
  | "status"
  | "createdAt"
  | "updatedAt";

export type ContactListQuery = ListQuery<ContactSortField> & {
  readonly status?: ContactStatus | null;
  readonly statuses?: readonly ContactStatus[];
  readonly entrepriseId?: EntrepriseId | null;
};

export type ContactPort = {
  list(
    query?: ContactListQuery,
  ): Promise<Result<PaginatedResult<Contact>, DomainError>>;
  listByEntreprise(
    entrepriseId: EntrepriseId,
  ): Promise<Result<readonly Contact[], DomainError>>;
  getById(id: ContactId): Promise<Result<Contact, DomainError>>;
  create(input: ContactCreateInput): Promise<Result<Contact, DomainError>>;
  update(
    id: ContactId,
    input: ContactUpdateInput,
  ): Promise<Result<Contact, DomainError>>;
  delete(id: ContactId): Promise<Result<void, DomainError>>;
  deleteMany(ids: readonly ContactId[]): Promise<Result<void, DomainError>>;
};
