"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Recherche d'offres Welcome to the Jungle et import d'entreprises."
      />
      <div className="px-6 py-8 text-sm text-muted-foreground">
        Contenu à venir — recherche WTTJ et liste de résultats.
      </div>
    </div>
  );
}
