"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Contact"
        description="Pipeline de contacts et suivi des échanges."
      />
      <div className="px-6 py-8 text-sm text-muted-foreground">
        Contenu à venir — table des contacts, filtres et statuts.
      </div>
    </div>
  );
}
