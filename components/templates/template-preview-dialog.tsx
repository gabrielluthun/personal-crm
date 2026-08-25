"use client";

import { useState } from "react";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TEMPLATE_VARIABLES,
  TEMPLATE_VARIABLE_LABELS,
  type TemplateVariableKey,
} from "@/lib/domain/template-variables";
import type { MessageTemplate } from "@/lib/domain/template";
import {
  formatMissingVariables,
  renderTemplate,
  type TemplateVariableValues,
} from "@/lib/services/template-renderer";

const SAMPLE_VALUES: TemplateVariableValues = {
  first_name: "Camille",
  last_name: "Dupont",
  company_name: "Alan",
  email: "camille.dupont@alan.eu",
  role: "Développeur Full-Stack",
  linkedin: "https://www.linkedin.com/in/camille-dupont",
  status: "En discussion",
  first_contact_date: "2026-01-10",
  next_follow_up: "2026-01-17",
};

type TemplatePreviewDialogProps = {
  readonly template: MessageTemplate | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
}: TemplatePreviewDialogProps) {
  const [values, setValues] = useState<TemplateVariableValues>(SAMPLE_VALUES);
  const [formKey, setFormKey] = useState(template?.id ?? "closed");

  if (template !== null && formKey !== template.id) {
    setFormKey(template.id);
    setValues(SAMPLE_VALUES);
  }

  const result =
    template === null ? null : renderTemplate(template.body, values);

  async function handleCopy(): Promise<void> {
    if (result === null) {
      return;
    }
    try {
      await navigator.clipboard.writeText(result.rendered);
      toast.success("Message copié");
    } catch {
      toast.error("Impossible de copier dans le presse-papiers");
    }
  }

  function setVariable(key: TemplateVariableKey, value: string): void {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>{template?.title ?? "Aperçu"}</DialogTitle>
          <DialogDescription>
            Renseignez les variables pour prévisualiser le message rendu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          {TEMPLATE_VARIABLES.map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`tpl-var-${key}`}>
                {TEMPLATE_VARIABLE_LABELS[key]}
              </Label>
              <Input
                id={`tpl-var-${key}`}
                value={values[key] ?? ""}
                onChange={(event) => {
                  setVariable(key, event.target.value);
                }}
              />
            </div>
          ))}
        </div>

        {result !== null ? (
          <div className="flex flex-col gap-2">
            {result.missing.length > 0 ? (
              <p
                role="status"
                className="text-xs text-amber-700 dark:text-amber-400"
              >
                Variables manquantes : {formatMissingVariables(result.missing)}
              </p>
            ) : null}
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
              {result.rendered}
            </pre>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Fermer
          </Button>
          <Button
            type="button"
            disabled={result === null}
            onClick={() => {
              void handleCopy();
            }}
          >
            <CopyIcon data-icon="inline-start" />
            Copier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
