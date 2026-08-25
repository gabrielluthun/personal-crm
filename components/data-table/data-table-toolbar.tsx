"use client";

import type { ReactNode } from "react";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DataTableToolbarProps = {
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
  readonly searchPlaceholder?: string;
  readonly searchLabel?: string;
  readonly searchWrapperClassName?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher…",
  searchLabel = "Rechercher dans le tableau",
  searchWrapperClassName,
  actions,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-sm",
          searchWrapperClassName,
        )}
      >
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="pl-8"
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
        />
      </div>
      {actions !== undefined ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
