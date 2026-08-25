"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function EntreprisePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Entreprise"
        description="Suivi des entreprises ciblées pour la prospection."
      />
      <div className="px-6 py-8 text-sm text-muted-foreground">
        Contenu à venir — table des entreprises et fiche d'édition.
      </div>
    </div>
  );
}
