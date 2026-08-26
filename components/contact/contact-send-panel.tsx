"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactSendPreview } from "@/hooks/use-contact-send";
import { createId } from "@/lib/domain/shared/id";
import type { MessageTemplate, TemplateId } from "@/lib/domain/template";

type ContactSendPanelProps = {
  readonly templates: readonly MessageTemplate[];
  readonly templatesLoading: boolean;
  readonly selectedTemplate: MessageTemplate | null;
  readonly preview: ContactSendPreview | null;
  readonly missingLabel: string | null;
  readonly isRecording: boolean;
  readonly actionError: string | null;
  readonly onSelectTemplate: (id: TemplateId) => void;
  readonly onCopy: () => void;
  readonly onRecord: () => void;
};

export function ContactSendPanel({
  templates,
  templatesLoading,
  selectedTemplate,
  preview,
  missingLabel,
  isRecording,
  actionError,
  onSelectTemplate,
  onCopy,
  onRecord,
}: ContactSendPanelProps) {
  const canAct = selectedTemplate !== null && preview !== null && !isRecording;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <h3 className="text-sm font-medium text-foreground">Préparer un envoi</h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-send-template">Template</Label>
        <Select
          value={selectedTemplate?.id}
          disabled={templatesLoading || templates.length === 0}
          onValueChange={(next) => {
            if (typeof next === "string") {
              onSelectTemplate(createId<"Template">(next));
            }
          }}
        >
          <SelectTrigger
            id="contact-send-template"
            className="w-full min-w-0"
            aria-label="Template de message"
          >
            <SelectValue placeholder="Choisir un template">
              {(value) => {
                const match = templates.find((item) => item.id === value);
                return match?.title ?? "Choisir un template";
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="w-(--anchor-width)">
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {templates.length === 0 && !templatesLoading ? (
          <p className="text-xs text-muted-foreground">
            Aucun template — créez-en un dans l’onglet Templates.
          </p>
        ) : null}
      </div>

      {preview !== null ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Canal : {formatChannel(preview.channel)}
          </p>
          {preview.subject !== null ? (
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Sujet
              </p>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {preview.subject.rendered}
              </p>
            </div>
          ) : null}
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Message
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {preview.body.rendered}
            </p>
          </div>
          {missingLabel !== null ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Variables manquantes : {missingLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      {actionError !== null ? (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canAct}
          onClick={onCopy}
        >
          Copier
        </Button>
        <Button type="button" disabled={!canAct} onClick={onRecord}>
          {isRecording ? "Enregistrement…" : "Marquer comme envoyé"}
        </Button>
      </div>
    </section>
  );
}

function formatChannel(channel: string): string {
  if (channel.length === 0) {
    return channel;
  }
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}
