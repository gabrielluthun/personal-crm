"use client";

import { toast } from "sonner";

import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useContactForm } from "@/hooks/use-contact-form";
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
};

export function ContactEditSheet({
  open,
  contact,
  onOpenChange,
  onCreate,
  onUpdate,
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
              ? "Modifiez les informations du contact."
              : "Renseignez les informations du nouveau contact."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          <ContactForm
            values={form.values}
            fieldErrors={form.fieldErrors}
            disabled={form.isSubmitting}
            onChange={form.setField}
          />

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
            disabled={form.isSubmitting}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={form.isSubmitting}
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
