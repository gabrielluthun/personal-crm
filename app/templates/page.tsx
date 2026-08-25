"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Templates"
        description="Icebreakers et modèles de messages avec variables."
      />
      <div className="px-4 py-6 text-fluid-body text-muted-foreground sm:px-6 md:px-8">
        Contenu à venir — grille de templates et aperçu rendu.
      </div>
    </div>
  );
}
