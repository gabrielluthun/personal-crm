"use client";

import { EmptyState } from "@/components/data-table/empty-state";
import { TemplateCard } from "@/components/templates/template-card";
import type { MessageTemplate } from "@/lib/domain/template";

type TemplateGridProps = {
  readonly templates: readonly MessageTemplate[];
  readonly isLoading: boolean;
  readonly onPreview: (template: MessageTemplate) => void;
};

export function TemplateGrid({
  templates,
  isLoading,
  onPreview,
}: TemplateGridProps) {
  if (isLoading && templates.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-sm text-muted-foreground">
        Chargement des templates…
      </p>
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        title="Aucun template"
        description="Aucun modèle ne correspond à votre recherche."
        className="rounded-xl border border-dashed border-border"
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <li key={template.id} className="min-h-0">
          <TemplateCard template={template} onPreview={onPreview} />
        </li>
      ))}
    </ul>
  );
}
