"use client";

import { useState } from "react";
import { toast } from "sonner";

import { SecretInput } from "@/components/settings/secret-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { useSettings } from "@/hooks/use-settings";

type SettingsApi = ReturnType<typeof useSettings>;

type BrightDataSettingsCardProps = {
  readonly settings: SettingsApi;
};

export function BrightDataSettingsCard({
  settings,
}: BrightDataSettingsCardProps) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bright Data</CardTitle>
        <CardDescription>
          Jeton utilisé pour la collecte d&apos;offres. Il est lu côté Rust au
          moment de la recherche et ne revient jamais vers le frontend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecretInput
          id="bright-data-token"
          label="Jeton API"
          description="Stocké dans le trousseau du système. Jamais réaffiché."
          configured={settings.secretPresence.bright_data_token === true}
          disabled={settings.isLoading}
          isSaving={isSaving}
          onSave={async (value) => {
            setIsSaving(true);
            const result = await settings.saveSecret(
              "bright_data_token",
              value,
            );
            setIsSaving(false);
            if (!result.ok) {
              toast.error(result.error.message);
              return;
            }
            toast.success("Jeton Bright Data enregistré");
          }}
          onClear={async () => {
            setIsSaving(true);
            const result = await settings.clearSecret("bright_data_token");
            setIsSaving(false);
            if (!result.ok) {
              toast.error(result.error.message);
              return;
            }
            toast.success("Jeton Bright Data effacé");
          }}
        />
      </CardContent>
    </Card>
  );
}
