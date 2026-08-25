"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Recherche d'offres Welcome to the Jungle et import d'entreprises."
      />
      <div className="px-4 py-6 text-fluid-body text-muted-foreground sm:px-6 md:px-8">
        Contenu à venir — recherche WTTJ et liste de résultats.
      </div>
    </div>
  );
}
