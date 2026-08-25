"use client";

import type { DataTableColumn } from "@/components/data-table/data-table";
import { ExternalLinkCell } from "@/components/data-table/external-link-cell";
import {
  HeaderSelectionCheckbox,
  SelectionCheckbox,
} from "@/components/data-table/selection-checkbox";
import type { HeaderSelectionState } from "@/hooks/use-row-selection";
import type { Entreprise, EntrepriseId } from "@/lib/domain/entreprise";

type EntrepriseColumnsOptions = {
  readonly isSelected: (id: EntrepriseId) => boolean;
  readonly onToggle: (id: EntrepriseId) => void;
  readonly headerState: HeaderSelectionState;
  readonly onToggleAll: () => void;
};

export function createEntrepriseColumns(
  options: EntrepriseColumnsOptions,
): DataTableColumn<Entreprise>[] {
  return [
    {
      id: "select",
      headerClassName: "w-10",
      className: "w-10",
      header: (
        <HeaderSelectionCheckbox
          state={options.headerState}
          onToggleAll={options.onToggleAll}
        />
      ),
      cell: (row) => (
        <SelectionCheckbox
          checked={options.isSelected(row.id)}
          aria-label={`Sélectionner ${row.name}`}
          onCheckedChange={() => {
            options.onToggle(row.id);
          }}
        />
      ),
    },
    {
      id: "name",
      header: "Nom",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      id: "linkedin",
      header: "LinkedIn",
      cell: (row) => (
        <ExternalLinkCell href={row.linkedinUrl} label="LinkedIn" />
      ),
    },
    {
      id: "website",
      header: "Site web",
      cell: (row) => (
        <ExternalLinkCell href={row.websiteUrl} label="Site web" />
      ),
    },
    {
      id: "wttj",
      header: "Welcome to the Jungle",
      cell: (row) => (
        <ExternalLinkCell href={row.wttjUrl} label="WTTJ" />
      ),
    },
  ];
}
