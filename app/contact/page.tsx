"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Contact"
        description="Pipeline de contacts et suivi des échanges."
      />
      <div className="px-4 py-6 text-fluid-body text-muted-foreground sm:px-6 md:px-8">
        Contenu à venir — table des contacts, filtres et statuts.
      </div>
    </div>
  );
}
