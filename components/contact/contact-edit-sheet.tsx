"use client";

import { toast } from "sonner";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactInteractionHistory } from "@/components/contact/contact-interaction-history";
import { ContactSendPanel } from "@/components/contact/contact-send-panel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useContactChannels } from "@/hooks/use-contact-channels";
import { useContactForm } from "@/hooks/use-contact-form";
import { useContactSend } from "@/hooks/use-contact-send";
import type {
  Contact,
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

type ContactEditSheetProps = {
  readonly open: boolean;
  readonly contact: Contact | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreate: (
    input: ContactCreateInput,
  ) => Promise<Result<Contact, DomainError>>;
  readonly onUpdate: (
    id: ContactId,
    input: ContactUpdateInput,
  ) => Promise<Result<Contact, DomainError>>;
  readonly onContactPatched?: (contact: Contact) => void;
};

export function ContactEditSheet({
  open,
  contact,
  onOpenChange,
  onCreate,
  onUpdate,
  onContactPatched,
}: ContactEditSheetProps) {
  const form = useContactForm({
    contact,
    onCreate,
    onUpdate,
    onSuccess: () => {
      toast.success(
        contact === null ? "Contact créé" : "Contact mis à jour",
      );
      onOpenChange(false);
    },
  });
  const channelsFallback = useContactChannels(contact?.id ?? null);
  const send = useContactSend({
    contact,
    onUpdate,
    onRecorded: (updated) => {
      form.setField(
        "lastMessageSentAt",
        updated.lastMessageSentAt ?? "",
      );
      form.setField("status", updated.status);
      onContactPatched?.(updated);
      toast.success("Envoi enregistré");
    },
  });

  const isEditing = contact !== null;
  const channels = isEditing ? send.channels : channelsFallback.channels;
  const channelsLoading = isEditing
    ? send.interactionsLoading
    : channelsFallback.isLoading;

  async function handleCopy(): Promise<void> {
    const result = await send.copyMessage();
    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }
    toast.success("Message copié");
  }

  async function handleRecord(): Promise<void> {
    const result = await send.recordSend();
    if (!result.ok) {
      toast.error(result.error.message);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 sm:max-w-lg"
        showCloseButton
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            {form.isEditing ? "Édition du contact" : "Nouveau contact"}
          </SheetTitle>
          <SheetDescription>
            {form.isEditing
              ? "Statut, envoi, historique et notes internes."
              : "Renseignez le nouveau contact, puis enregistrez."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
          <ContactForm
            values={form.values}
            fieldErrors={form.fieldErrors}
            channels={channels}
            channelsLoading={channelsLoading}
            disabled={form.isSubmitting || send.isRecording}
            onChange={form.setField}
          />

          {isEditing ? (
            <>
              <ContactSendPanel
                templates={send.templates}
                templatesLoading={send.templatesLoading}
                selectedTemplate={send.selectedTemplate}
                suggestedHint={
                  send.suggestedTemplateId !== null &&
                  send.selectedTemplate?.id === send.suggestedTemplateId
                    ? "Template suggéré pour ce statut"
                    : null
                }
                preview={send.preview}
                missingLabel={send.missingLabel}
                isRecording={send.isRecording}
                actionError={send.actionError}
                onSelectTemplate={send.selectTemplate}
                onCopy={() => {
                  void handleCopy();
                }}
                onRecord={() => {
                  void handleRecord();
                }}
              />
              <ContactInteractionHistory
                items={send.interactions}
                isLoading={send.interactionsLoading}
              />
            </>
          ) : null}

          {form.submitError !== null ? (
            <p role="alert" className="text-sm text-destructive">
              {form.submitError}
            </p>
          ) : null}
        </div>

        <SheetFooter className="border-t border-border sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={form.isSubmitting || send.isRecording}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={form.isSubmitting || send.isRecording}
            onClick={() => {
              void form.submit();
            }}
          >
            {form.isSubmitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
