"use client";

import { EntrepriseSelect } from "@/components/contact/entreprise-select";
import { StatusMultiFilterControl } from "@/components/contact/status-multi-filter";
import { StatusSelect } from "@/components/contact/status-select";
import type { DataTableColumn } from "@/components/data-table/data-table";
import { ExternalLinkCell } from "@/components/data-table/external-link-cell";
import {
  HeaderSelectionCheckbox,
  SelectionCheckbox,
} from "@/components/data-table/selection-checkbox";
import {
  UrlPresenceFilterControl,
  hasUrl,
  type UrlPresenceFilter,
} from "@/components/entreprise/url-presence-filter";
import type { HeaderSelectionState } from "@/hooks/use-row-selection";
import {
  getContactDisplayName,
  type Contact,
  type ContactId,
} from "@/lib/domain/contact";
import {
  CONTACT_STATUSES,
  type ContactStatus,
} from "@/lib/domain/contact-status";
import type { EntrepriseId } from "@/lib/domain/entreprise";

export type ContactListFilters = {
  readonly entreprise: UrlPresenceFilter;
  readonly email: UrlPresenceFilter;
  readonly statuses: readonly ContactStatus[];
};

export const DEFAULT_CONTACT_LIST_FILTERS: ContactListFilters = {
  entreprise: "all",
  email: "all",
  statuses: CONTACT_STATUSES,
};

type ContactColumnsOptions = {
  readonly updatingId: ContactId | null;
  readonly isSelected: (id: ContactId) => boolean;
  readonly onToggle: (id: ContactId) => void;
  readonly headerState: HeaderSelectionState;
  readonly onToggleAll: () => void;
  readonly listFilters: ContactListFilters;
  readonly onListFiltersChange: (next: ContactListFilters) => void;
  readonly onStatusChange: (id: ContactId, status: ContactStatus) => void;
  readonly onEntrepriseChange: (
    id: ContactId,
    entrepriseId: EntrepriseId | null,
  ) => void;
};

export function createContactColumns(
  options: ContactColumnsOptions,
): DataTableColumn<Contact>[] {
  const { listFilters, onListFiltersChange } = options;

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
      header: (
        <UrlPresenceFilterControl
          label="Entreprise"
          value={listFilters.entreprise}
          onChange={(entreprise) => {
            onListFiltersChange({ ...listFilters, entreprise });
          }}
        />
      ),
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
      header: (
        <UrlPresenceFilterControl
          label="Email"
          value={listFilters.email}
          onChange={(email) => {
            onListFiltersChange({ ...listFilters, email });
          }}
        />
      ),
      cell: (row) => (
        <span className="text-muted-foreground">{row.email ?? "—"}</span>
      ),
    },
    {
      id: "status",
      header: (
        <StatusMultiFilterControl
          selected={listFilters.statuses}
          onChange={(statuses) => {
            onListFiltersChange({ ...listFilters, statuses });
          }}
        />
      ),
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

export function filterContactsByListFilters(
  items: readonly Contact[],
  filters: ContactListFilters,
): readonly Contact[] {
  const statusSet = new Set(filters.statuses);
  const filterByStatus =
    filters.statuses.length > 0 &&
    filters.statuses.length < CONTACT_STATUSES.length;

  return items.filter((item) => {
    if (filters.entreprise === "with" && item.entrepriseId === null) {
      return false;
    }
    if (filters.email === "with" && !hasUrl(item.email)) {
      return false;
    }
    if (filterByStatus && !statusSet.has(item.status)) {
      return false;
    }
    return true;
  });
}
