"use client";

import { toast } from "sonner";

import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContactForm } from "@/hooks/use-contact-form";
import type {
  Contact,
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

type ContactEditDialogProps = {
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

export function ContactEditDialog({
  open,
  contact,
  onOpenChange,
  onCreate,
  onUpdate,
}: ContactEditDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {form.isEditing ? "Édition du contact" : "Nouveau contact"}
          </DialogTitle>
          <DialogDescription>
            {form.isEditing
              ? "Modifiez les informations du contact."
              : "Renseignez les informations du nouveau contact."}
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
