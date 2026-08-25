"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";

type ContactToolbarProps = {
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
  readonly selectedCount: number;
  readonly isDeleting?: boolean;
  readonly onCreate: () => void;
  readonly onDeleteSelected: () => void;
};

export function ContactToolbar({
  search,
  onSearchChange,
  selectedCount,
  isDeleting = false,
  onCreate,
  onDeleteSelected,
}: ContactToolbarProps) {
  return (
    <DataTableToolbar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Rechercher un contact…"
      searchLabel="Rechercher un contact"
      searchWrapperClassName="max-w-none flex-1"
      className="gap-3 sm:items-center"
      actions={
        <>
          {selectedCount > 0 ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              aria-label={`Supprimer ${selectedCount} contact${selectedCount > 1 ? "s" : ""}`}
              onClick={onDeleteSelected}
            >
              <Trash2Icon data-icon="inline-start" />
              Supprimer ({selectedCount})
            </Button>
          ) : null}
          <Button type="button" size="sm" onClick={onCreate}>
            <PlusIcon data-icon="inline-start" />
            Nouveau
          </Button>
        </>
      }
    />
  );
}
