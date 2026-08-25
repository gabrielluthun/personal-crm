"use client";

import { useRepositories } from "@/components/providers/repository-provider";
import { EmptyState } from "@/components/data-table/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsyncResource } from "@/hooks/use-async-resource";
import {
  getContactDisplayName,
  type Contact,
} from "@/lib/domain/contact";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import { ok } from "@/lib/domain/shared/result";

type LinkedContactsTableProps = {
  readonly entrepriseId: EntrepriseId | null;
};

export function LinkedContactsTable({
  entrepriseId,
}: LinkedContactsTableProps) {
  const { contacts } = useRepositories();

  const resource = useAsyncResource(
    async () => {
      if (entrepriseId === null) {
        return ok<readonly Contact[]>([]);
      }
      return contacts.listByEntreprise(entrepriseId);
    },
    [entrepriseId],
  );

  if (entrepriseId === null) {
    return (
      <EmptyState
        title="Contacts liés"
        description="Enregistrez l'entreprise pour y rattacher des contacts."
        className="py-6"
      />
    );
  }

  if (resource.isLoading && (resource.data?.length ?? 0) === 0) {
    return (
      <p className="px-1 py-4 text-sm text-muted-foreground">
        Chargement des contacts…
      </p>
    );
  }

  if (resource.error !== null) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {resource.error.message}
      </p>
    );
  }

  const items = resource.data ?? [];
  if (items.length === 0) {
    return (
      <EmptyState
        title="Aucun contact lié"
        description="Aucun contact n'est encore rattaché à cette entreprise."
        className="py-6"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">
              {getContactDisplayName(contact)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {contact.email ?? "—"}
            </TableCell>
            <TableCell>{contact.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
