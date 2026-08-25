"use client";

import { AppearanceCard } from "@/components/settings/appearance-card";
import { BrightDataSettingsCard } from "@/components/settings/bright-data-settings-card";
import { PageHeader } from "@/components/layout/page-header";
import { useSettings } from "@/hooks/use-settings";

export default function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Jeton Bright Data et apparence."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-4 py-4 sm:px-6 md:px-8">
        {settings.error !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {settings.error.message}
          </p>
        ) : null}
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <BrightDataSettingsCard settings={settings} />
          <AppearanceCard />
        </div>
      </div>
    </div>
  );
}
