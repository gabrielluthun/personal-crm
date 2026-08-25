"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ContactEditDialog } from "@/components/contact/contact-edit-dialog";
import { ContactTable } from "@/components/contact/contact-table";
import { ContactTabs } from "@/components/contact/contact-tabs";
import { ContactToolbar } from "@/components/contact/contact-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useContacts } from "@/hooks/use-contacts";
import { useRowSelection } from "@/hooks/use-row-selection";
import type { Contact, ContactId } from "@/lib/domain/contact";

export default function ContactPage() {
  const {
    items,
    total,
    search,
    setSearch,
    tab,
    setTab,
    isLoading,
    error,
    create,
    update,
    removeMany,
  } = useContacts();
  const selection = useRowSelection<ContactId>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const selectedCount = selection.selectedCount;

  async function executeDelete(): Promise<void> {
    const ids = [...selection.selectedIds];
    if (ids.length === 0) {
      setConfirmOpen(false);
      return;
    }

    setIsDeleting(true);
    const result = await removeMany(ids);
    setIsDeleting(false);
    setConfirmOpen(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }

    if (
      activeContact !== null &&
      ids.some((id) => id === activeContact.id)
    ) {
      setActiveContact(null);
      setDialogOpen(false);
    }
    selection.clear();
    toast.success(
      ids.length === 1
        ? "Contact supprimé"
        : `${ids.length} contacts supprimés`,
    );
  }

  function handleCreate(): void {
    setActiveContact(null);
    setDialogOpen(true);
  }

  function handleRowClick(contact: Contact): void {
    setActiveContact(contact);
    setDialogOpen(true);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Contact"
        description="Pipeline de contacts et suivi des échanges."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ContactTabs value={tab} onValueChange={setTab} />
          <ContactToolbar
            search={search}
            onSearchChange={setSearch}
            selectedCount={selectedCount}
            isDeleting={isDeleting}
            onCreate={handleCreate}
            onDeleteSelected={() => {
              setConfirmOpen(true);
            }}
          />
        </div>
        {error !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border">
          <ContactTable
            items={items}
            isLoading={isLoading}
            selection={selection}
            onRowClick={handleRowClick}
            onUpdate={update}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {total} contact{total === 1 ? "" : "s"}
        </p>
      </div>

      <ContactEditDialog
        open={dialogOpen}
        contact={activeContact}
        onOpenChange={setDialogOpen}
        onCreate={create}
        onUpdate={update}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={
          selectedCount === 1
            ? "Supprimer ce contact ?"
            : `Supprimer ${selectedCount} contacts ?`
        }
        description="Cette action est définitive. Les interactions liées seront aussi supprimées."
        confirmLabel="Supprimer"
        destructive
        isConfirming={isDeleting}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          void executeDelete();
        }}
      />
    </div>
  );
}
