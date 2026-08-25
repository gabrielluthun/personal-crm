"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SecretInputProps = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly configured: boolean;
  readonly disabled?: boolean;
  readonly isSaving?: boolean;
  readonly onSave: (value: string) => Promise<void>;
  readonly onClear: () => Promise<void>;
};

/**
 * Password field that never redisplays a stored secret.
 * When configured, only presence is shown until the user enters a new value.
 */
export function SecretInput({
  id,
  label,
  description,
  configured,
  disabled = false,
  isSaving = false,
  onSave,
  onClear,
}: SecretInputProps) {
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  async function handleSave(): Promise<void> {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return;
    }
    await onSave(trimmed);
    setValue("");
    setRevealed(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {configured ? (
          <Badge variant="secondary">Configuré</Badge>
        ) : (
          <Badge variant="outline">Non configuré</Badge>
        )}
      </div>
      {description !== undefined ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Input
            id={id}
            type={revealed ? "text" : "password"}
            value={value}
            disabled={disabled || isSaving}
            autoComplete="off"
            placeholder={
              configured
                ? "Entrer une nouvelle valeur pour remplacer"
                : "Saisir le secret"
            }
            className="pr-10"
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-1 -translate-y-1/2"
            disabled={disabled || isSaving}
            aria-label={revealed ? "Masquer le secret" : "Afficher le secret"}
            onClick={() => {
              setRevealed((previous) => !previous);
            }}
          >
            {revealed ? (
              <EyeOffIcon className="size-4" aria-hidden />
            ) : (
              <EyeIcon className="size-4" aria-hidden />
            )}
          </Button>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            size="sm"
            disabled={disabled || isSaving || value.trim().length === 0}
            onClick={() => {
              void handleSave();
            }}
          >
            {isSaving ? "…" : "Enregistrer"}
          </Button>
          {configured ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isSaving}
              aria-label={`Supprimer ${label}`}
              onClick={() => {
                void onClear();
              }}
            >
              <Trash2Icon data-icon="inline-start" />
              Effacer
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
