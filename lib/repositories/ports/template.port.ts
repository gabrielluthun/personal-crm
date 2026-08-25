import type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import type { ListQuery, PaginatedResult } from "@/lib/repositories/ports/query";

export type TemplateSortField = "title" | "createdAt" | "updatedAt";

export type TemplateListQuery = ListQuery<TemplateSortField>;

export type TemplatePort = {
  list(
    query?: TemplateListQuery,
  ): Promise<Result<PaginatedResult<MessageTemplate>, DomainError>>;
  getById(id: TemplateId): Promise<Result<MessageTemplate, DomainError>>;
  create(
    input: MessageTemplateCreateInput,
  ): Promise<Result<MessageTemplate, DomainError>>;
  update(
    id: TemplateId,
    input: MessageTemplateUpdateInput,
  ): Promise<Result<MessageTemplate, DomainError>>;
  delete(id: TemplateId): Promise<Result<void, DomainError>>;
};
