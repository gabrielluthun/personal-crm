"use client";

import { PlusIcon } from "lucide-react";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";

type ContactToolbarProps = {
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
  readonly onCreate: () => void;
};

export function ContactToolbar({
  search,
  onSearchChange,
  onCreate,
}: ContactToolbarProps) {
  return (
    <DataTableToolbar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Rechercher un contact…"
      searchLabel="Rechercher un contact"
      actions={
        <Button type="button" size="sm" onClick={onCreate}>
          <PlusIcon data-icon="inline-start" />
          Nouveau
        </Button>
      }
    />
  );
}
