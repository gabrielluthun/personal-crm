"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next === "all" || next === "with") {
            onChange(next);
          }
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label={`Filtrer ${label}`}
          className={cn(
            "h-7 min-w-18 gap-1 px-2 text-xs",
            value === "with" && "border-ring",
          )}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <SelectValue>
            {value === "with" ? "Avec" : "Tous"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="with">Avec</SelectItem>
          <SelectItem value="all">Tous</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function hasUrl(value: string | null | undefined): boolean {
  return (value?.trim().length ?? 0) > 0;
}
