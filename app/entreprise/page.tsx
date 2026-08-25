"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function EntreprisePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Entreprise"
        description="Suivi des entreprises ciblées pour la prospection."
      />
      <div className="px-4 py-6 text-fluid-body text-muted-foreground sm:px-6 md:px-8">
        Contenu à venir — table des entreprises et fiche d'édition.
      </div>
    </div>
  );
}
