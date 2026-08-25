"use client";

import { EntrepriseSelect } from "@/components/contact/entreprise-select";
import { StatusSelect } from "@/components/contact/status-select";
import type { DataTableColumn } from "@/components/data-table/data-table";
import { ExternalLinkCell } from "@/components/data-table/external-link-cell";
import {
  HeaderSelectionCheckbox,
  SelectionCheckbox,
} from "@/components/data-table/selection-checkbox";
import type { HeaderSelectionState } from "@/hooks/use-row-selection";
import {
  getContactDisplayName,
  type Contact,
  type ContactId,
} from "@/lib/domain/contact";
import type { ContactStatus } from "@/lib/domain/contact-status";
import type { EntrepriseId } from "@/lib/domain/entreprise";

type ContactColumnsOptions = {
  readonly updatingId: ContactId | null;
  readonly isSelected: (id: ContactId) => boolean;
  readonly onToggle: (id: ContactId) => void;
  readonly headerState: HeaderSelectionState;
  readonly onToggleAll: () => void;
  readonly onStatusChange: (
    id: ContactId,
    status: ContactStatus,
  ) => void;
  readonly onEntrepriseChange: (
    id: ContactId,
    entrepriseId: EntrepriseId | null,
  ) => void;
};

export function createContactColumns(
  options: ContactColumnsOptions,
): DataTableColumn<Contact>[] {
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
          aria-label={`Sélectionner ${getContactDisplayName(row)}`}
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
        <span className="font-medium text-foreground">
          {getContactDisplayName(row)}
        </span>
      ),
    },
    {
      id: "entreprise",
      header: "Entreprise",
      cell: (row) => (
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <EntrepriseSelect
            value={row.entrepriseId}
            disabled={options.updatingId === row.id}
            aria-label={`Entreprise de ${getContactDisplayName(row)}`}
            triggerClassName="max-w-48"
            onValueChange={(entrepriseId) => {
              options.onEntrepriseChange(row.id, entrepriseId);
            }}
          />
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => (
        <span className="text-muted-foreground">{row.email ?? "—"}</span>
      ),
    },
    {
      id: "status",
      header: "Statut",
      cell: (row) => (
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <StatusSelect
            value={row.status}
            disabled={options.updatingId === row.id}
            aria-label={`Statut de ${getContactDisplayName(row)}`}
            onValueChange={(status) => {
              options.onStatusChange(row.id, status);
            }}
          />
        </div>
      ),
    },
    {
      id: "linkedin",
      header: "Connexion LinkedIn",
      cell: (row) => (
        <ExternalLinkCell href={row.linkedinUrl} label="LinkedIn" />
      ),
    },
  ];
}
