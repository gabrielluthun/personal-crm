"use client";

import { EmptyState } from "@/components/data-table/empty-state";
import { CompanyPropositionCard } from "@/components/dashboard/company-proposition-card";
import { Button } from "@/components/ui/button";
import type { RowSelection } from "@/hooks/use-row-selection";
import type { CompanyProposition } from "@/lib/dashboard/company-propositions";
import type { JobOfferId } from "@/lib/domain/job-offer";

type CompanyPropositionListProps = {
  readonly propositions: readonly CompanyProposition[];
  readonly recruitmentContext: string;
  readonly isLoading: boolean;
  readonly isIdle: boolean;
  readonly selection: RowSelection<JobOfferId>;
  readonly isImporting?: boolean;
  readonly onImport: () => void;
};

export function CompanyPropositionList({
  propositions,
  recruitmentContext,
  isLoading,
  isIdle,
  selection,
  isImporting = false,
  onImport,
}: CompanyPropositionListProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3" aria-labelledby="resultats-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h2
            id="resultats-title"
            className="text-base font-semibold text-foreground"
          >
            Résultats
          </h2>
          <p className="text-sm text-muted-foreground">
            Cochez les lignes à enregistrer dans le CRM, puis cliquez sur «
            Ajouter la sélection ».
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={
            isImporting || selection.selectedCount === 0 || isLoading
          }
          onClick={onImport}
        >
          {isImporting
            ? "Ajout…"
            : `Ajouter la sélection (${selection.selectedCount})`}
        </Button>
      </div>

      {isIdle ? (
        <EmptyState
          title="Lancez une recherche"
          description="Indiquez une ville et un domaine, puis validez pour lister des entreprises hors CRM."
          className="rounded-xl border border-dashed border-border"
        />
      ) : null}

      {!isIdle && isLoading && propositions.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-muted-foreground">
          Recherche en cours…
        </p>
      ) : null}

      {!isIdle && !isLoading && propositions.length === 0 ? (
        <EmptyState
          title="Aucune proposition"
          description="Aucune entreprise hors base ne correspond à ces critères."
          className="rounded-xl border border-dashed border-border"
        />
      ) : null}

      {propositions.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {propositions.map((proposition) => (
            <li key={proposition.id}>
              <CompanyPropositionCard
                proposition={proposition}
                recruitmentContext={recruitmentContext}
                selected={selection.isSelected(proposition.id)}
                onSelectedChange={(selected) => {
                  selection.setSelected(proposition.id, selected);
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
