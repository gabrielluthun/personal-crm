"use client";

import { toast } from "sonner";

import { ContactTable } from "@/components/contact/contact-table";
import { ContactTabs } from "@/components/contact/contact-tabs";
import { ContactToolbar } from "@/components/contact/contact-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { useContacts } from "@/hooks/use-contacts";
import type { Contact } from "@/lib/domain/contact";

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
    update,
  } = useContacts();

  function handleCreate(): void {
    toast.message("Fiche d'édition à venir", {
      description: "La création de contact arrive à l'étape suivante.",
    });
  }

  function handleRowClick(contact: Contact): void {
    toast.message("Fiche d'édition à venir", {
      description: `« ${contact.firstName} ${contact.lastName} » s'ouvrira dans une boîte de dialogue.`,
    });
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
            onCreate={handleCreate}
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
            onRowClick={handleRowClick}
            onUpdate={update}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {total} contact{total === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
