"use client";

import { GlobeIcon } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table/data-table";
import {
  HeaderSelectionCheckbox,
  SelectionCheckbox,
} from "@/components/data-table/selection-checkbox";
import { UrlIconLink } from "@/components/entreprise/url-icon-link";
import {
  UrlPresenceFilterControl,
  type UrlPresenceFilter,
} from "@/components/entreprise/url-presence-filter";
import type { HeaderSelectionState } from "@/hooks/use-row-selection";
import type { Entreprise, EntrepriseId } from "@/lib/domain/entreprise";

export type EntrepriseUrlFilters = {
  readonly linkedin: UrlPresenceFilter;
  readonly website: UrlPresenceFilter;
  readonly wttj: UrlPresenceFilter;
};

type EntrepriseColumnsOptions = {
  readonly isSelected: (id: EntrepriseId) => boolean;
  readonly onToggle: (id: EntrepriseId) => void;
  readonly headerState: HeaderSelectionState;
  readonly onToggleAll: () => void;
  readonly urlFilters: EntrepriseUrlFilters;
  readonly onUrlFiltersChange: (next: EntrepriseUrlFilters) => void;
};

export function createEntrepriseColumns(
  options: EntrepriseColumnsOptions,
): DataTableColumn<Entreprise>[] {
  const { urlFilters, onUrlFiltersChange } = options;

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
      headerClassName: "w-28",
      className: "w-28",
      header: (
        <UrlPresenceFilterControl
          label="LinkedIn"
          value={urlFilters.linkedin}
          onChange={(linkedin) => {
            onUrlFiltersChange({ ...urlFilters, linkedin });
          }}
        />
      ),
      cell: (row) => (
        <UrlIconLink href={row.linkedinUrl} label="LinkedIn">
          <LinkedInMark />
        </UrlIconLink>
      ),
    },
    {
      id: "website",
      headerClassName: "w-28",
      className: "w-28",
      header: (
        <UrlPresenceFilterControl
          label="Site"
          value={urlFilters.website}
          onChange={(website) => {
            onUrlFiltersChange({ ...urlFilters, website });
          }}
        />
      ),
      cell: (row) => (
        <UrlIconLink href={row.websiteUrl} label="Site web">
          <GlobeIcon aria-hidden />
        </UrlIconLink>
      ),
    },
    {
      id: "wttj",
      headerClassName: "w-28",
      className: "w-28",
      header: (
        <UrlPresenceFilterControl
          label="WTTJ"
          value={urlFilters.wttj}
          onChange={(wttj) => {
            onUrlFiltersChange({ ...urlFilters, wttj });
          }}
        />
      ),
      cell: (row) => (
        <UrlIconLink href={row.wttjUrl} label="Welcome to the Jungle">
          <span className="text-xs font-semibold" aria-hidden>
            W
          </span>
        </UrlIconLink>
      ),
    },
  ];
}

function LinkedInMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S.02 4.88.02 3.5 1.14 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.5h4.56V23H.22V8.5zM8.34 8.5h4.37v1.98h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7V23h-4.56v-6.7c0-1.6-.03-3.65-2.22-3.65-2.22 0-2.56 1.73-2.56 3.53V23H8.34V8.5z" />
    </svg>
  );
}

export function hasUrl(value: string | null | undefined): boolean {
  return (value?.trim().length ?? 0) > 0;
}

export function filterEntreprisesByUrlPresence(
  items: readonly Entreprise[],
  filters: EntrepriseUrlFilters,
): readonly Entreprise[] {
  return items.filter((item) => {
    if (filters.linkedin === "with" && !hasUrl(item.linkedinUrl)) {
      return false;
    }
    if (filters.website === "with" && !hasUrl(item.websiteUrl)) {
      return false;
    }
    if (filters.wttj === "with" && !hasUrl(item.wttjUrl)) {
      return false;
    }
    return true;
  });
}
