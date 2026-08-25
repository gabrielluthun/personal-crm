"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEntreprises } from "@/hooks/use-entreprises";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import { createId } from "@/lib/domain/shared/id";
import { cn } from "@/lib/utils";

const NONE_VALUE = "__none__";

type EntrepriseSelectProps = {
  readonly value: EntrepriseId | null;
  readonly onValueChange: (entrepriseId: EntrepriseId | null) => void;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly "aria-label"?: string;
  readonly className?: string;
  readonly triggerClassName?: string;
  readonly allowNone?: boolean;
};

export function EntrepriseSelect({
  value,
  onValueChange,
  disabled = false,
  id,
  "aria-label": ariaLabel = "Entreprise liée",
  className,
  triggerClassName,
  allowNone = true,
}: EntrepriseSelectProps) {
  const { items, isLoading, error } = useEntreprises();
  const selectValue = value ?? (allowNone ? NONE_VALUE : undefined);

  return (
    <Select
      value={selectValue}
      disabled={disabled || isLoading}
      onValueChange={(next) => {
        if (next === null || next === NONE_VALUE) {
          onValueChange(null);
          return;
        }
        onValueChange(createId<"Entreprise">(next));
      }}
    >
      <SelectTrigger
        id={id}
        size="sm"
        aria-label={ariaLabel}
        aria-invalid={error !== null}
        className={cn("min-w-48", triggerClassName, className)}
      >
        <SelectValue placeholder={isLoading ? "Chargement…" : "Entreprise"}>
          {(selected) => {
            if (selected === NONE_VALUE || selected === null) {
              return "Aucune entreprise";
            }
            const match = items.find((item) => item.id === selected);
            return match?.name ?? "Entreprise";
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        {allowNone ? (
          <SelectItem value={NONE_VALUE}>Aucune entreprise</SelectItem>
        ) : null}
        {items.map((entreprise) => (
          <SelectItem key={entreprise.id} value={entreprise.id}>
            {entreprise.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
