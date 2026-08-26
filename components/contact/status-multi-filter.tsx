"use client";

import { ChevronDownIcon } from "lucide-react";

import { StatusBadge } from "@/components/contact/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CONTACT_STATUSES,
  type ContactStatus,
} from "@/lib/domain/contact-status";
import { cn } from "@/lib/utils";

type StatusMultiFilterControlProps = {
  readonly selected: readonly ContactStatus[];
  readonly onChange: (next: readonly ContactStatus[]) => void;
  readonly className?: string;
};

export function StatusMultiFilterControl({
  selected,
  onChange,
  className,
}: StatusMultiFilterControlProps) {
  const selectedSet = new Set(selected);
  const isFiltered =
    selected.length > 0 && selected.length < CONTACT_STATUSES.length;
  const label = !isFiltered
    ? "Tous"
    : `${selected.length} statut${selected.length > 1 ? "s" : ""}`;

  function toggle(status: ContactStatus): void {
    if (selectedSet.has(status)) {
      onChange(selected.filter((item) => item !== status));
      return;
    }
    onChange([...selected, status]);
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">Statut</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label="Filtrer par statut"
              className={cn(
                "h-7 gap-1 px-2 text-xs font-normal",
                isFiltered && "border-ring",
              )}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          }
        >
          {label}
          <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-40"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {CONTACT_STATUSES.map((status) => {
            const isSelected = selectedSet.has(status);
            return (
              <DropdownMenuItem
                key={status}
                closeOnClick={false}
                aria-pressed={isSelected}
                onClick={() => {
                  toggle(status);
                }}
                className={cn(!isSelected && "opacity-40")}
              >
                <StatusBadge status={status} />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
