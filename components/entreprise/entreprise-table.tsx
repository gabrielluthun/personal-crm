"use client";

import { DataTable } from "@/components/data-table/data-table";
import { createEntrepriseColumns } from "@/components/entreprise/entreprise-columns";
import type { RowSelection } from "@/hooks/use-row-selection";
import type { Entreprise, EntrepriseId } from "@/lib/domain/entreprise";

type EntrepriseTableProps = {
  readonly items: readonly Entreprise[];
  readonly isLoading: boolean;
  readonly selection: RowSelection<EntrepriseId>;
  readonly onRowClick: (entreprise: Entreprise) => void;
};

export function EntrepriseTable({
  items,
  isLoading,
  selection,
  onRowClick,
}: EntrepriseTableProps) {
  const visibleIds = items.map((item) => item.id);
  const columns = createEntrepriseColumns({
    isSelected: selection.isSelected,
    onToggle: selection.toggle,
    headerState: selection.headerState(visibleIds),
    onToggleAll: () => {
      selection.toggleAll(visibleIds);
    },
  });

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      selectedIds={selection.selectedIds}
      onRowClick={onRowClick}
      emptyTitle="Aucune entreprise"
      emptyDescription="Ajoutez une entreprise ou affinez votre recherche."
    />
  );
}
