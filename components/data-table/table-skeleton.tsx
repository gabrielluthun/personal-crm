"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableSkeletonProps = {
  readonly columnCount?: number;
  readonly rowCount?: number;
};

export function TableSkeleton({
  columnCount = 4,
  rowCount = 6,
}: TableSkeletonProps) {
  const columns = Array.from({ length: columnCount }, (_, index) => index);
  const rows = Array.from({ length: rowCount }, (_, index) => index);

  return (
    <Table aria-busy="true" aria-label="Chargement du tableau">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row}>
            {columns.map((column) => (
              <TableCell key={column}>
                <Skeleton className="h-4 w-full max-w-40" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
