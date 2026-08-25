"use client";

import { useState } from "react";
import { toast } from "sonner";

import { EntrepriseTable } from "@/components/entreprise/entreprise-table";
import { EntrepriseToolbar } from "@/components/entreprise/entreprise-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { useEntreprises } from "@/hooks/use-entreprises";
import { useRowSelection } from "@/hooks/use-row-selection";
import type { Entreprise, EntrepriseId } from "@/lib/domain/entreprise";

export default function EntreprisePage() {
  const {
    items,
    total,
    search,
    setSearch,
    isLoading,
    error,
    removeMany,
  } = useEntreprises();
  const selection = useRowSelection<EntrepriseId>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeEntreprise, setActiveEntreprise] = useState<Entreprise | null>(
    null,
  );

  async function handleDeleteSelected(): Promise<void> {
    const ids = [...selection.selectedIds];
    if (ids.length === 0) {
      return;
    }
    const confirmed = window.confirm(
      ids.length === 1
        ? "Supprimer cette entreprise ?"
        : `Supprimer ${ids.length} entreprises ?`,
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    const result = await removeMany(ids);
    setIsDeleting(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    if (
      activeEntreprise !== null &&
      ids.some((id) => id === activeEntreprise.id)
    ) {
      setActiveEntreprise(null);
    }
    selection.clear();
    toast.success(
      ids.length === 1
        ? "Entreprise supprimée"
        : `${ids.length} entreprises supprimées`,
    );
  }

  function handleCreate(): void {
    setActiveEntreprise(null);
    toast.message("Fiche d'édition à venir", {
      description: "La création d'entreprise arrive à l'étape suivante.",
    });
  }

  function handleRowClick(entreprise: Entreprise): void {
    setActiveEntreprise(entreprise);
    toast.message("Fiche d'édition à venir", {
      description: `« ${entreprise.name} » s'ouvrira dans un panneau latéral.`,
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Entreprise"
        description="Suivi des entreprises ciblées pour la prospection."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 md:px-8">
        <EntrepriseToolbar
          search={search}
          onSearchChange={setSearch}
          selectedCount={selection.selectedCount}
          isDeleting={isDeleting}
          onCreate={handleCreate}
          onDeleteSelected={() => {
            void handleDeleteSelected();
          }}
        />
        {error !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border">
          <EntrepriseTable
            items={items}
            isLoading={isLoading}
            selection={selection}
            onRowClick={handleRowClick}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {total} entreprise{total === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
