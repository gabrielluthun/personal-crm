"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Templates"
        description="Icebreakers et modèles de messages avec variables."
      />
      <div className="px-6 py-8 text-sm text-muted-foreground">
        Contenu à venir — grille de templates et aperçu rendu.
      </div>
    </div>
  );
}
