"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createContactColumns } from "@/components/contact/contact-columns";
import { DataTable } from "@/components/data-table/data-table";
import type {
  Contact,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { ContactStatus } from "@/lib/domain/contact-status";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

type ContactTableProps = {
  readonly items: readonly Contact[];
  readonly isLoading: boolean;
  readonly onRowClick: (contact: Contact) => void;
  readonly onUpdate: (
    id: ContactId,
    input: ContactUpdateInput,
  ) => Promise<Result<Contact, DomainError>>;
};

export function ContactTable({
  items,
  isLoading,
  onRowClick,
  onUpdate,
}: ContactTableProps) {
  const [updatingId, setUpdatingId] = useState<ContactId | null>(null);

  async function patch(
    id: ContactId,
    input: ContactUpdateInput,
  ): Promise<void> {
    setUpdatingId(id);
    const result = await onUpdate(id, input);
    setUpdatingId(null);
    if (!result.ok) {
      toast.error(result.error.message);
    }
  }

  const columns = createContactColumns({
    updatingId,
    onStatusChange: (id: ContactId, status: ContactStatus) => {
      void patch(id, { status });
    },
    onEntrepriseChange: (
      id: ContactId,
      entrepriseId: EntrepriseId | null,
    ) => {
      void patch(id, { entrepriseId });
    },
  });

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyTitle="Aucun contact"
      emptyDescription="Ajoutez un contact ou changez d'onglet / de recherche."
    />
  );
}
