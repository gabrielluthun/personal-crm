"use client";

import { Building2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ImportSelectionBarProps = {
  readonly selectedCount: number;
  readonly isImporting?: boolean;
  readonly onImport: () => void;
  readonly onClear: () => void;
};

export function ImportSelectionBar({
  selectedCount,
  isImporting = false,
  onImport,
  onClear,
}: ImportSelectionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Import des entreprises sélectionnées"
      className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/95 p-3 shadow-md backdrop-blur supports-backdrop-filter:bg-background/80"
    >
      <p className="text-sm text-foreground">
        {selectedCount} offre{selectedCount > 1 ? "s" : ""} sélectionnée
        {selectedCount > 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isImporting}
          onClick={onClear}
        >
          Effacer
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isImporting}
          onClick={onImport}
        >
          <Building2Icon data-icon="inline-start" />
          {isImporting
            ? "Import…"
            : "Importer les entreprises sélectionnées"}
        </Button>
      </div>
    </div>
  );
}
