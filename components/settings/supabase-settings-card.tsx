"use client";

import { useState } from "react";
import { toast } from "sonner";

import { SecretInput } from "@/components/settings/secret-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPublicEnv } from "@/lib/config/env";
import type { useSettings } from "@/hooks/use-settings";

type SettingsApi = ReturnType<typeof useSettings>;

type SupabaseSettingsCardProps = {
  readonly settings: SettingsApi;
};

export function SupabaseSettingsCard({ settings }: SupabaseSettingsCardProps) {
  const env = getPublicEnv();
  const [url, setUrl] = useState(settings.publicSettings.supabase_url ?? "");
  const [urlKey, setUrlKey] = useState(settings.publicSettings.supabase_url ?? "");
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isSavingSecret, setIsSavingSecret] = useState(false);

  const storedUrl = settings.publicSettings.supabase_url ?? "";
  if (urlKey !== storedUrl) {
    setUrlKey(storedUrl);
    setUrl(storedUrl);
  }

  async function handleSaveUrl(): Promise<void> {
    setIsSavingUrl(true);
    const result = await settings.savePublicSetting("supabase_url", url);
    setIsSavingUrl(false);
    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }
    toast.success("URL Supabase enregistrée");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase</CardTitle>
        <CardDescription>
          URL publique et clé anon. Les secrets saisis ici ne sont jamais
          réaffichés (mock en mémoire jusqu&apos;au keychain Rust).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {env.supabaseUrl !== null ? (
          <p className="text-xs text-muted-foreground">
            Build : <code className="text-foreground">{env.supabaseUrl}</code>
          </p>
        ) : null}
        <div className="flex flex-col gap-2">
          <Label htmlFor="supabase-url">URL du projet</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="supabase-url"
              type="url"
              value={url}
              disabled={settings.isLoading || isSavingUrl}
              placeholder="https://xxxx.supabase.co"
              className="min-w-0 flex-1"
              onChange={(event) => {
                setUrl(event.target.value);
              }}
            />
            <Button
              type="button"
              size="sm"
              disabled={settings.isLoading || isSavingUrl}
              onClick={() => {
                void handleSaveUrl();
              }}
            >
              {isSavingUrl ? "…" : "Enregistrer"}
            </Button>
          </div>
        </div>
        <SecretInput
          id="supabase-anon-key"
          label="Clé anon"
          description="Protégée par RLS. Ne jamais y mettre une clé service_role."
          configured={settings.secretPresence.supabase_anon_key === true}
          disabled={settings.isLoading}
          isSaving={isSavingSecret}
          onSave={async (value) => {
            setIsSavingSecret(true);
            const result = await settings.saveSecret(
              "supabase_anon_key",
              value,
            );
            setIsSavingSecret(false);
            if (!result.ok) {
              toast.error(result.error.message);
              return;
            }
            toast.success("Clé anon enregistrée");
          }}
          onClear={async () => {
            setIsSavingSecret(true);
            const result = await settings.clearSecret("supabase_anon_key");
            setIsSavingSecret(false);
            if (!result.ok) {
              toast.error(result.error.message);
              return;
            }
            toast.success("Clé anon effacée");
          }}
        />
      </CardContent>
    </Card>
  );
}
