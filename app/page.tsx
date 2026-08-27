"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CompanyPropositionList } from "@/components/dashboard/company-proposition-list";
import { FollowUpReminder } from "@/components/dashboard/follow-up-reminder";
import { JobSearchForm } from "@/components/dashboard/job-search-form";
import { PageHeader } from "@/components/layout/page-header";
import { useContacts } from "@/hooks/use-contacts";
import { useEntreprises } from "@/hooks/use-entreprises";
import { useJobSearch } from "@/hooks/use-job-search";
import { useRowSelection } from "@/hooks/use-row-selection";
import {
  buildCompanyPropositions,
  crmSearchExclusions,
  formatPropositionStatus,
  formatRecruitmentContext,
} from "@/lib/dashboard/company-propositions";
import { writeJobBoardMetaToRaw } from "@/lib/domain/job-board-source-storage";
import type { JobOfferId, JobSearchQuery } from "@/lib/domain/job-offer";
import { countDueForFollowUp } from "@/lib/services/contact-follow-up";

export default function DashboardPage() {
  const jobSearch = useJobSearch();
  const { items: entreprises, create } = useEntreprises();
  const { items: contacts } = useContacts();
  const selection = useRowSelection<JobOfferId>();
  const [isImporting, setIsImporting] = useState(false);
  const followUpCount = countDueForFollowUp(contacts);
  const exclusions = crmSearchExclusions(entreprises);

  const { propositions, stats } = buildCompanyPropositions(
    jobSearch.offers,
    entreprises,
  );

  const statusText =
    jobSearch.hasSearched && !jobSearch.isLoading
      ? formatPropositionStatus(stats)
      : null;

  const recruitmentContext = formatRecruitmentContext(
    jobSearch.lastQuery?.keywords ?? "",
    jobSearch.lastQuery?.location,
  );

  async function handleSearch(query: JobSearchQuery): Promise<void> {
    selection.clear();
    const result = await jobSearch.search(query, exclusions);
    if (!result.ok) {
      toast.error(result.error.message);
    }
  }

  async function handleLoadMore(): Promise<void> {
    const result = await jobSearch.searchNext();
    if (result === null) {
      return;
    }
    if (!result.ok) {
      toast.error(result.error.message);
    }
  }

  async function handleImport(): Promise<void> {
    const selected = propositions.filter((item) =>
      selection.isSelected(item.id),
    );
    if (selected.length === 0) {
      return;
    }

    setIsImporting(true);
    let created = 0;

    for (const item of selected) {
      const result = await create({
        name: item.companyName,
        websiteUrl: item.websiteUrl,
        linkedinUrl: item.linkedinUrl,
        wttjUrl:
          item.source === "wttj"
            ? (item.companyBoardUrl ?? item.offerUrl)
            : null,
        location: item.location,
        targetOfferUrl: item.offerUrl,
        source: item.source,
        rawData: writeJobBoardMetaToRaw(null, {
          source: item.source,
          companySlug: item.companySlug,
        }),
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
          ? "1 entreprise ajoutée"
          : `${created} entreprises ajoutées`,
      );
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Dashboard"
        description="Découvrez des entreprises qui recrutent (Welcome to the Jungle ou Indeed) — sans les ajouter automatiquement."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 py-4 sm:px-6 md:px-8">
        <FollowUpReminder count={followUpCount} />
        <JobSearchForm
          isLoading={jobSearch.isLoading && jobSearch.offers.length === 0}
          statusText={statusText}
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
          <CompanyPropositionList
            propositions={propositions}
            recruitmentContext={recruitmentContext}
            isLoading={jobSearch.isLoading && jobSearch.offers.length === 0}
            isLoadingMore={jobSearch.isLoading && jobSearch.offers.length > 0}
            isIdle={jobSearch.isIdle}
            canLoadMore={jobSearch.canLoadMore}
            selection={selection}
            isImporting={isImporting}
            onImport={() => {
              void handleImport();
            }}
            onLoadMore={() => {
              void handleLoadMore();
            }}
          />
        </div>
      </div>
    </div>
  );
}
