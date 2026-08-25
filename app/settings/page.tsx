"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        description="Configuration Supabase, Bright Data et apparence."
      />
      <div className="px-4 py-6 text-fluid-body text-muted-foreground sm:px-6 md:px-8">
        Contenu à venir — clés API et préférences de thème.
      </div>
    </div>
  );
}
