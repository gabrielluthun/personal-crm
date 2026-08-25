"use client";

import { PageHeader } from "@/components/layout/page-header";

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        description="Configuration Supabase, Bright Data et apparence."
      />
      <div className="px-6 py-8 text-sm text-muted-foreground">
        Contenu à venir — clés API et préférences de thème.
      </div>
    </div>
  );
}
