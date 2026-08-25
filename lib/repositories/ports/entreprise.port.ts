import type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type { ListQuery, PaginatedResult } from "@/lib/repositories/ports/query";

export type EntrepriseSortField = "name" | "createdAt" | "updatedAt";

export type EntrepriseListQuery = ListQuery<EntrepriseSortField>;

export type EntreprisePort = {
  list(
    query?: EntrepriseListQuery,
  ): Promise<Result<PaginatedResult<Entreprise>, DomainError>>;
  getById(id: EntrepriseId): Promise<Result<Entreprise, DomainError>>;
  create(
    input: EntrepriseCreateInput,
  ): Promise<Result<Entreprise, DomainError>>;
  update(
    id: EntrepriseId,
    input: EntrepriseUpdateInput,
  ): Promise<Result<Entreprise, DomainError>>;
  delete(id: EntrepriseId): Promise<Result<void, DomainError>>;
  deleteMany(ids: readonly EntrepriseId[]): Promise<Result<void, DomainError>>;
};
