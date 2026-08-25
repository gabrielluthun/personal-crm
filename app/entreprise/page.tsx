"use client";

import { useState } from "react";
import { toast } from "sonner";

import { EntrepriseEditSheet } from "@/components/entreprise/entreprise-edit-sheet";
import { EntrepriseTable } from "@/components/entreprise/entreprise-table";
import { EntrepriseToolbar } from "@/components/entreprise/entreprise-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
    create,
    update,
    removeMany,
  } = useEntreprises();
  const selection = useRowSelection<EntrepriseId>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeEntreprise, setActiveEntreprise] = useState<Entreprise | null>(
    null,
  );

  const selectedCount = selection.selectedCount;

  async function executeDelete(): Promise<void> {
    const ids = [...selection.selectedIds];
    if (ids.length === 0) {
      setConfirmOpen(false);
      return;
    }

    setIsDeleting(true);
    const result = await removeMany(ids);
    setIsDeleting(false);
    setConfirmOpen(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    if (
      activeEntreprise !== null &&
      ids.some((id) => id === activeEntreprise.id)
    ) {
      setActiveEntreprise(null);
      setSheetOpen(false);
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
    setSheetOpen(true);
  }

  function handleRowClick(entreprise: Entreprise): void {
    setActiveEntreprise(entreprise);
    setSheetOpen(true);
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
          selectedCount={selectedCount}
          isDeleting={isDeleting}
          onCreate={handleCreate}
          onDeleteSelected={() => {
            setConfirmOpen(true);
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

      <EntrepriseEditSheet
        open={sheetOpen}
        entreprise={activeEntreprise}
        onOpenChange={setSheetOpen}
        onCreate={create}
        onUpdate={update}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={
          selectedCount === 1
            ? "Supprimer cette entreprise ?"
            : `Supprimer ${selectedCount} entreprises ?`
        }
        description="Cette action est définitive. Les contacts liés resteront, sans entreprise."
        confirmLabel="Supprimer"
        destructive
        isConfirming={isDeleting}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          void executeDelete();
        }}
      />
    </div>
  );
}
