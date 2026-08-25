export type SortDirection = "asc" | "desc";

export type SortSpec<Field extends string> = {
  readonly field: Field;
  readonly direction: SortDirection;
};

export type PaginationSpec = {
  readonly page: number;
  readonly pageSize: number;
};

export type ListQuery<Field extends string> = {
  readonly search?: string;
  readonly sort?: SortSpec<Field>;
  readonly pagination?: PaginationSpec;
};

export type PaginatedResult<T> = {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
};

export function normalizePagination(
  pagination: PaginationSpec | undefined,
): PaginationSpec {
  const page = Math.max(1, pagination?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, pagination?.pageSize ?? 50));
  return { page, pageSize };
}
