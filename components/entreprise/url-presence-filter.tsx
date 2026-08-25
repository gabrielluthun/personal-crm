"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type UrlPresenceFilter = "all" | "with";

type UrlPresenceFilterControlProps = {
  readonly label: string;
  readonly value: UrlPresenceFilter;
  readonly onChange: (value: UrlPresenceFilter) => void;
  readonly className?: string;
};

export function UrlPresenceFilterControl({
  label,
  value,
  onChange,
  className,
}: UrlPresenceFilterControlProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div
        role="group"
        aria-label={`Filtrer ${label}`}
        className="flex items-center gap-0.5"
      >
        <FilterChip
          pressed={value === "with"}
          onClick={() => {
            onChange("with");
          }}
        >
          Avec
        </FilterChip>
        <FilterChip
          pressed={value === "all"}
          onClick={() => {
            onChange("all");
          }}
        >
          Tous
        </FilterChip>
      </div>
    </div>
  );
}

type FilterChipProps = {
  readonly pressed: boolean;
  readonly onClick: () => void;
  readonly children: string;
};

function FilterChip({ pressed, onClick, children }: FilterChipProps) {
  return (
    <Button
      type="button"
      size="xs"
      variant={pressed ? "secondary" : "ghost"}
      aria-pressed={pressed}
      className="h-6 px-1.5 text-[0.7rem]"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {children}
    </Button>
  );
}
