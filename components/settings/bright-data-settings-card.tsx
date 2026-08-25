"use client";

import { useState } from "react";
import { PlugZapIcon } from "lucide-react";
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
import { useRepositories } from "@/components/providers/repository-provider";
import type { useSettings } from "@/hooks/use-settings";
import { isTauri } from "@/lib/tauri/is-tauri";

type SettingsApi = ReturnType<typeof useSettings>;

type BrightDataSettingsCardProps = {
  readonly settings: SettingsApi;
};

type ProbeState = "idle" | "ok" | "error";

export function BrightDataSettingsCard({
  settings,
}: BrightDataSettingsCardProps) {
  const { jobSearch } = useRepositories();
  const [isSaving, setIsSaving] = useState(false);
  const [isProbing, setIsProbing] = useState(false);
  const [probeState, setProbeState] = useState<ProbeState>("idle");
  const [probeDetail, setProbeDetail] = useState<string | null>(null);

  const configured = settings.secretPresence.bright_data_token === true;
  const desktop = isTauri();

  const statusBadge = resolveStatusBadge(configured, probeState);

  async function runProbe(): Promise<void> {
    setIsProbing(true);
    setProbeDetail(null);
    const result = await jobSearch.probeConnection();
    setIsProbing(false);

    if (!result.ok) {
      setProbeState("error");
      setProbeDetail(result.error.message);
      toast.error(result.error.message);
      return;
    }

    setProbeState("ok");
    const zones = result.value.zoneCount;
    const detail =
      zones === null
        ? "Jeton accepté par Bright Data"
        : zones === 1
          ? "Jeton accepté · 1 zone active"
          : `Jeton accepté · ${zones} zones actives`;
    setProbeDetail(detail);
    toast.success(detail);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bright Data</CardTitle>
        <CardDescription>
          Jeton API Bright Data (keychain). La recherche dashboard utilise une
          zone SERP active du compte. Le jeton ne revient jamais au frontend.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SecretInput
          id="bright-data-token"
          label="Jeton API"
          description="Stocké dans le trousseau du système. Jamais réaffiché."
          configured={configured}
          statusBadge={statusBadge}
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
            setProbeState("idle");
            setProbeDetail(null);
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
            setProbeState("idle");
            setProbeDetail(null);
            toast.success("Jeton Bright Data effacé");
          }}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground" role="status">
            {!desktop
              ? "Test réseau disponible uniquement dans l'app desktop."
              : probeDetail !== null
                ? probeDetail
                : configured
                  ? "Configuré · lancez un test pour valider le jeton."
                  : "Enregistrez un jeton pour activer le test."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              !desktop ||
              !configured ||
              settings.isLoading ||
              isSaving ||
              isProbing
            }
            aria-label="Tester la connexion Bright Data"
            onClick={() => {
              void runProbe();
            }}
          >
            <PlugZapIcon data-icon="inline-start" />
            {isProbing ? "Test…" : "Tester la connexion"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function resolveStatusBadge(
  configured: boolean,
  probeState: ProbeState,
): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (!configured) {
    return { label: "Non configuré", variant: "outline" };
  }
  if (probeState === "ok") {
    return { label: "Configuré · OK", variant: "default" };
  }
  if (probeState === "error") {
    return { label: "Configuré · échec", variant: "destructive" };
  }
  return { label: "Configuré", variant: "secondary" };
}
