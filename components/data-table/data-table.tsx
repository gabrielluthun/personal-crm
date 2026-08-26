"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/data-table/empty-state";
import { TableSkeleton } from "@/components/data-table/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<TRow> = {
  readonly id: string;
  readonly header: ReactNode;
  readonly cell: (row: TRow) => ReactNode;
  readonly className?: string;
  readonly headerClassName?: string;
};

type DataTableProps<TRow> = {
  readonly columns: readonly DataTableColumn<TRow>[];
  readonly rows: readonly TRow[];
  readonly getRowId: (row: TRow) => string;
  readonly isLoading?: boolean;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyAction?: ReactNode;
  readonly selectedIds?: ReadonlySet<string>;
  readonly onRowClick?: (row: TRow) => void;
  readonly className?: string;
  /** Keeps the header row visible while the parent scrolls (also when empty). */
  readonly stickyHeader?: boolean;
};

export function DataTable<TRow>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  emptyTitle = "Aucun résultat",
  emptyDescription,
  emptyAction,
  selectedIds,
  onRowClick,
  className,
  stickyHeader = false,
}: DataTableProps<TRow>) {
  if (isLoading && rows.length === 0) {
    return <TableSkeleton columnCount={columns.length} />;
  }

  const isEmpty = !isLoading && rows.length === 0;

  if (isEmpty && !stickyHeader) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <Table
      className={className}
      containerClassName={stickyHeader ? "overflow-visible" : undefined}
    >
      <TableHeader
        className={
          stickyHeader
            ? "sticky top-0 z-10 bg-background [&_tr]:border-b"
            : undefined
        }
      >
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(
                stickyHeader && "bg-background",
                column.headerClassName,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isEmpty ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="p-0">
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                action={emptyAction}
              />
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const rowId = getRowId(row);
            const selected = selectedIds?.has(rowId) ?? false;
            const clickable = onRowClick !== undefined;

            return (
              <TableRow
                key={rowId}
                data-state={selected ? "selected" : undefined}
                className={cn(clickable && "cursor-pointer")}
                onClick={
                  clickable
                    ? () => {
                        onRowClick(row);
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
