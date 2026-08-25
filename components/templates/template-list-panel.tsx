"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MessageTemplate, TemplateId } from "@/lib/domain/template";

type TemplateListPanelProps = {
  readonly templates: readonly MessageTemplate[];
  readonly selectedId: TemplateId | "new" | null;
  readonly isLoading: boolean;
  readonly onSelect: (template: MessageTemplate) => void;
  readonly onCreate: () => void;
};

export function TemplateListPanel({
  templates,
  selectedId,
  isLoading,
  onSelect,
  onCreate,
}: TemplateListPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">Templates</h2>
        <Button type="button" size="sm" onClick={onCreate}>
          Nouveau
        </Button>
      </div>
      {isLoading && templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : null}
      {!isLoading && templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun template.</p>
      ) : null}
      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {templates.map((template) => {
          const selected = selectedId === template.id;
          const subjectPreview =
            template.subject?.trim() && template.subject.trim().length > 0
              ? template.subject
              : "NO SUBJECT";
          return (
            <li key={template.id}>
              <button
                type="button"
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-foreground/20 bg-muted"
                    : "border-transparent hover:bg-muted/60",
                )}
                onClick={() => {
                  onSelect(template);
                }}
              >
                <span className="block truncate text-sm font-medium text-foreground">
                  {template.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {subjectPreview}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
