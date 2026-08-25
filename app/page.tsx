"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ImportSelectionBar } from "@/components/dashboard/import-selection-bar";
import { JobOfferList } from "@/components/dashboard/job-offer-list";
import { JobSearchForm } from "@/components/dashboard/job-search-form";
import { PageHeader } from "@/components/layout/page-header";
import { useEntreprises } from "@/hooks/use-entreprises";
import { useJobSearch } from "@/hooks/use-job-search";
import { useRowSelection } from "@/hooks/use-row-selection";
import type { JobOfferId, JobSearchQuery } from "@/lib/domain/job-offer";

export default function DashboardPage() {
  const jobSearch = useJobSearch();
  const { items: entreprises, create } = useEntreprises();
  const selection = useRowSelection<JobOfferId>();
  const [isImporting, setIsImporting] = useState(false);

  async function handleSearch(query: JobSearchQuery): Promise<void> {
    selection.clear();
    const result = await jobSearch.search(query);
    if (!result.ok) {
      toast.error(result.error.message);
    }
  }

  async function handleImport(): Promise<void> {
    const selectedOffers = jobSearch.offers.filter((offer) =>
      selection.isSelected(offer.id),
    );
    if (selectedOffers.length === 0) {
      return;
    }

    setIsImporting(true);
    let created = 0;
    let skipped = 0;

    for (const offer of selectedOffers) {
      const alreadyExists = entreprises.some(
        (entreprise) =>
          entreprise.name.toLowerCase() === offer.companyName.toLowerCase(),
      );
      if (alreadyExists) {
        skipped += 1;
        continue;
      }

      const result = await create({
        name: offer.companyName,
        websiteUrl: offer.companyWebsiteUrl,
        linkedinUrl: offer.companyLinkedinUrl,
        wttjUrl: offer.wttjUrl,
        location: offer.location,
        targetOfferUrl: offer.wttjUrl,
      });

      if (result.ok) {
        created += 1;
      } else {
        toast.error(result.error.message);
      }
    }

    setIsImporting(false);
    selection.clear();

    if (created > 0) {
      toast.success(
        created === 1
          ? "1 entreprise importée"
          : `${created} entreprises importées`,
      );
    }
    if (skipped > 0) {
      toast.message(
        skipped === 1
          ? "1 entreprise déjà présente ignorée"
          : `${skipped} entreprises déjà présentes ignorées`,
      );
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Dashboard"
        description="Recherche d'offres Welcome to the Jungle et import d'entreprises."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 md:px-8">
        <JobSearchForm
          isLoading={jobSearch.isLoading}
          onSubmit={(query) => {
            void handleSearch(query);
          }}
        />
        {jobSearch.error !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {jobSearch.error.message}
          </p>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto">
          <JobOfferList
            offers={jobSearch.offers}
            isLoading={jobSearch.isLoading}
            isIdle={jobSearch.isIdle}
            selection={selection}
          />
        </div>
        <ImportSelectionBar
          selectedCount={selection.selectedCount}
          isImporting={isImporting}
          onClear={selection.clear}
          onImport={() => {
            void handleImport();
          }}
        />
      </div>
    </div>
  );
}
