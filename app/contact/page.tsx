"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { ContactListFilters } from "@/components/contact/contact-columns";
import { DEFAULT_CONTACT_LIST_FILTERS } from "@/components/contact/contact-columns";
import { ContactEditSheet } from "@/components/contact/contact-edit-sheet";
import {
  ContactTable,
  countFilteredContacts,
} from "@/components/contact/contact-table";
import { ContactToolbar } from "@/components/contact/contact-toolbar";
import { ContactViewTabs } from "@/components/contact/contact-view-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useContacts } from "@/hooks/use-contacts";
import { useRowSelection } from "@/hooks/use-row-selection";
import type { Contact, ContactId } from "@/lib/domain/contact";
import {
  countDueForFollowUp,
  filterContactsByPipelineView,
  type ContactPipelineView,
} from "@/lib/services/contact-follow-up";

export default function ContactPage() {
  const {
    items,
    search,
    setSearch,
    isLoading,
    error,
    create,
    update,
    removeMany,
  } = useContacts();
  const selection = useRowSelection<ContactId>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pipelineView, setPipelineView] =
    useState<ContactPipelineView>("all");
  const [listFilters, setListFilters] = useState<ContactListFilters>(
    DEFAULT_CONTACT_LIST_FILTERS,
  );
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const selectedCount = selection.selectedCount;
  const followUpCount = countDueForFollowUp(items);
  const viewItems = filterContactsByPipelineView(items, pipelineView);
  const visibleCount = countFilteredContacts(viewItems, listFilters);

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
      setSheetOpen(false);
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
    setSheetOpen(true);
  }

  function handleRowClick(contact: Contact): void {
    setActiveContact(contact);
    setSheetOpen(true);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Contact"
        description="Pipeline de contacts et suivi des échanges."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ContactViewTabs
            value={pipelineView}
            followUpCount={followUpCount}
            onValueChange={setPipelineView}
          />
          <div className="min-w-0 flex-1">
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
        </div>
        {error !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border">
          <ContactTable
            items={viewItems}
            isLoading={isLoading}
            selection={selection}
            listFilters={listFilters}
            onListFiltersChange={setListFilters}
            onRowClick={handleRowClick}
            onUpdate={update}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {visibleCount} ligne{visibleCount === 1 ? "" : "s"}
        </p>
      </div>

      <ContactEditSheet
        open={sheetOpen}
        contact={activeContact}
        onOpenChange={setSheetOpen}
        onCreate={create}
        onUpdate={update}
        onContactPatched={setActiveContact}
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
