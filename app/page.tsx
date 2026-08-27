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
  formatPropositionStatus,
  formatRecruitmentContext,
} from "@/lib/dashboard/company-propositions";
import type { JobOfferId, JobSearchQuery } from "@/lib/domain/job-offer";
import { countDueForFollowUp } from "@/lib/services/contact-follow-up";

export default function DashboardPage() {
  const jobSearch = useJobSearch();
  const { items: entreprises, create } = useEntreprises();
  const { items: contacts } = useContacts();
  const selection = useRowSelection<JobOfferId>();
  const [isImporting, setIsImporting] = useState(false);
  const followUpCount = countDueForFollowUp(contacts);

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
    const result = await jobSearch.search(query);
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
        wttjUrl: item.companyWttjUrl ?? item.offerWttjUrl,
        location: item.location,
        targetOfferUrl: item.offerWttjUrl,
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
        description="Découvrez des entreprises sur Welcome to the Jungle qui recrutent dans un domaine donné — sans les ajouter automatiquement."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 py-4 sm:px-6 md:px-8">
        <FollowUpReminder count={followUpCount} />
        <JobSearchForm
          isLoading={jobSearch.isLoading}
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
            isLoading={jobSearch.isLoading}
            isIdle={jobSearch.isIdle}
            selection={selection}
            isImporting={isImporting}
            onImport={() => {
              void handleImport();
            }}
          />
        </div>
      </div>
    </div>
  );
}
