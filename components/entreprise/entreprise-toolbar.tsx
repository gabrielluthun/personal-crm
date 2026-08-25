"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";

type EntrepriseToolbarProps = {
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
  readonly selectedCount: number;
  readonly isDeleting?: boolean;
  readonly onCreate: () => void;
  readonly onDeleteSelected: () => void;
};

export function EntrepriseToolbar({
  search,
  onSearchChange,
  selectedCount,
  isDeleting = false,
  onCreate,
  onDeleteSelected,
}: EntrepriseToolbarProps) {
  return (
    <DataTableToolbar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Rechercher une entreprise…"
      searchLabel="Rechercher une entreprise"
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
              aria-label={`Supprimer ${selectedCount} entreprise${selectedCount > 1 ? "s" : ""}`}
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
