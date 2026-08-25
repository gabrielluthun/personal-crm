"use client";

import { useState } from "react";
import { toast } from "sonner";

import { TemplateEditor } from "@/components/templates/template-editor";
import { TemplateListPanel } from "@/components/templates/template-list-panel";
import { useTemplateForm } from "@/hooks/use-template-form";
import { useTemplates } from "@/hooks/use-templates";
import type { MessageTemplate } from "@/lib/domain/template";

export default function TemplatesPage() {
  const { items, isLoading, error, create, update } = useTemplates();
  const [activeTemplate, setActiveTemplate] =
    useState<MessageTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(true);

  const editingTemplate = isCreating ? null : activeTemplate;

  const form = useTemplateForm({
    template: editingTemplate,
    onCreate: create,
    onUpdate: update,
    onSuccess: (saved) => {
      toast.success(
        editingTemplate === null ? "Template créé" : "Template mis à jour",
      );
      setIsCreating(false);
      setActiveTemplate(saved);
    },
  });

  const selectedId = isCreating
    ? ("new" as const)
    : (activeTemplate?.id ?? null);

  function handleCreate(): void {
    setIsCreating(true);
    setActiveTemplate(null);
  }

  function handleSelect(template: MessageTemplate): void {
    setIsCreating(false);
    setActiveTemplate(template);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 md:px-8">
      {error !== null ? (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {error.message}
        </p>
      ) : null}
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(17rem,22rem)_1fr]">
        <div className="min-h-0 rounded-xl border border-border bg-card p-4">
          <TemplateListPanel
            templates={items}
            selectedId={selectedId}
            isLoading={isLoading}
            onSelect={handleSelect}
            onCreate={handleCreate}
          />
        </div>
        <div className="min-h-0 overflow-y-auto rounded-xl border border-border bg-card p-5">
          <TemplateEditor
            values={form.values}
            fieldErrors={form.fieldErrors}
            submitError={form.submitError}
            isSubmitting={form.isSubmitting}
            onChange={form.setField}
            onFocusTarget={form.setInsertTarget}
            onInsertVariable={form.insertVariable}
            onSubmit={() => {
              void form.submit();
            }}
          />
        </div>
      </div>
    </div>
  );
}
