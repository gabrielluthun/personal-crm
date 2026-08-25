"use client";

import { DataTable } from "@/components/data-table/data-table";
import {
  createEntrepriseColumns,
  filterEntreprisesByUrlPresence,
  type EntrepriseUrlFilters,
} from "@/components/entreprise/entreprise-columns";
import type { RowSelection } from "@/hooks/use-row-selection";
import type { Entreprise, EntrepriseId } from "@/lib/domain/entreprise";

type EntrepriseTableProps = {
  readonly items: readonly Entreprise[];
  readonly isLoading: boolean;
  readonly selection: RowSelection<EntrepriseId>;
  readonly urlFilters: EntrepriseUrlFilters;
  readonly onUrlFiltersChange: (next: EntrepriseUrlFilters) => void;
  readonly onRowClick: (entreprise: Entreprise) => void;
};

export function EntrepriseTable({
  items,
  isLoading,
  selection,
  urlFilters,
  onUrlFiltersChange,
  onRowClick,
}: EntrepriseTableProps) {
  const visibleItems = filterEntreprisesByUrlPresence(items, urlFilters);
  const visibleIds = visibleItems.map((item) => item.id);
  const columns = createEntrepriseColumns({
    isSelected: selection.isSelected,
    onToggle: selection.toggle,
    headerState: selection.headerState(visibleIds),
    onToggleAll: () => {
      selection.toggleAll(visibleIds);
    },
    urlFilters,
    onUrlFiltersChange,
  });

  return (
    <DataTable
      columns={columns}
      rows={visibleItems}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      selectedIds={selection.selectedIds}
      onRowClick={onRowClick}
      emptyTitle="Aucune entreprise"
      emptyDescription="Ajoutez une entreprise ou affinez votre recherche."
    />
  );
}

export function countFilteredEntreprises(
  items: readonly Entreprise[],
  urlFilters: EntrepriseUrlFilters,
): number {
  return filterEntreprisesByUrlPresence(items, urlFilters).length;
}
