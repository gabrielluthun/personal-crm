"use client";

import { EmptyState } from "@/components/data-table/empty-state";
import { JobOfferCard } from "@/components/dashboard/job-offer-card";
import type { RowSelection } from "@/hooks/use-row-selection";
import type { JobOffer, JobOfferId } from "@/lib/domain/job-offer";

type JobOfferListProps = {
  readonly offers: readonly JobOffer[];
  readonly isLoading: boolean;
  readonly isIdle: boolean;
  readonly selection: RowSelection<JobOfferId>;
};

export function JobOfferList({
  offers,
  isLoading,
  isIdle,
  selection,
}: JobOfferListProps) {
  if (isIdle) {
    return (
      <EmptyState
        title="Recherchez des offres"
        description="Saisissez des mots-clés pour interroger les fixtures WTTJ (Bright Data plus tard)."
        className="rounded-xl border border-dashed border-border"
      />
    );
  }

  if (isLoading && offers.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-sm text-muted-foreground">
        Recherche en cours…
      </p>
    );
  }

  if (offers.length === 0) {
    return (
      <EmptyState
        title="Aucun résultat"
        description="Aucune offre ne correspond à ces critères."
        className="rounded-xl border border-dashed border-border"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {offers.map((offer) => (
        <li key={offer.id}>
          <JobOfferCard
            offer={offer}
            selected={selection.isSelected(offer.id)}
            onSelectedChange={(selected) => {
              selection.setSelected(offer.id, selected);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
