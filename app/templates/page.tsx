"use client";

import { useState } from "react";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { PageHeader } from "@/components/layout/page-header";
import { TemplateGrid } from "@/components/templates/template-grid";
import { TemplatePreviewDialog } from "@/components/templates/template-preview-dialog";
import { useTemplates } from "@/hooks/use-templates";
import type { MessageTemplate } from "@/lib/domain/template";

export default function TemplatesPage() {
  const { items, total, search, setSearch, isLoading, error } = useTemplates();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] =
    useState<MessageTemplate | null>(null);

  function handlePreview(template: MessageTemplate): void {
    setActiveTemplate(template);
    setPreviewOpen(true);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Templates"
        description="Icebreakers et modèles de messages avec variables."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 md:px-8">
        <DataTableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Rechercher un template…"
          searchLabel="Rechercher un template"
        />
        {error !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto">
          <TemplateGrid
            templates={items}
            isLoading={isLoading}
            onPreview={handlePreview}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {total} template{total === 1 ? "" : "s"}
        </p>
      </div>

      <TemplatePreviewDialog
        template={activeTemplate}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
