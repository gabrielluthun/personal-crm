"use client";

import { toast } from "sonner";

import { EntrepriseForm } from "@/components/entreprise/entreprise-form";
import { LinkedContactsTable } from "@/components/entreprise/linked-contacts-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEntrepriseForm } from "@/hooks/use-entreprise-form";
import type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

type EntrepriseEditSheetProps = {
  readonly open: boolean;
  readonly entreprise: Entreprise | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreate: (
    input: EntrepriseCreateInput,
  ) => Promise<Result<Entreprise, DomainError>>;
  readonly onUpdate: (
    id: EntrepriseId,
    input: EntrepriseUpdateInput,
  ) => Promise<Result<Entreprise, DomainError>>;
};

export function EntrepriseEditSheet({
  open,
  entreprise,
  onOpenChange,
  onCreate,
  onUpdate,
}: EntrepriseEditSheetProps) {
  const form = useEntrepriseForm({
    entreprise,
    onCreate,
    onUpdate,
    onSuccess: () => {
      toast.success(
        entreprise === null ? "Entreprise créée" : "Entreprise mise à jour",
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
            {form.isEditing ? "Édition" : "Nouvelle entreprise"}
          </SheetTitle>
          <SheetDescription>
            {form.isEditing
              ? "Modifiez les informations et consultez les contacts liés."
              : "Renseignez les informations de l'entreprise ciblée."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
          <EntrepriseForm
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

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-foreground">
              Contacts liés
            </h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <LinkedContactsTable entrepriseId={entreprise?.id ?? null} />
            </div>
          </section>
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
