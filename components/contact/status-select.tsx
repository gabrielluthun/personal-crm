"use client";

import { StatusBadge } from "@/components/contact/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONTACT_STATUSES,
  isContactStatus,
  type ContactStatus,
} from "@/lib/domain/contact-status";
import { cn } from "@/lib/utils";

type StatusSelectProps = {
  readonly value: ContactStatus;
  readonly onValueChange: (status: ContactStatus) => void;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly "aria-label"?: string;
  readonly className?: string;
  readonly triggerClassName?: string;
};

export function StatusSelect({
  value,
  onValueChange,
  disabled = false,
  id,
  "aria-label": ariaLabel = "Statut du contact",
  className,
  triggerClassName,
}: StatusSelectProps) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if (isContactStatus(next)) {
          onValueChange(next);
        }
      }}
    >
      <SelectTrigger
        id={id}
        size="sm"
        aria-label={ariaLabel}
        className={cn("min-w-40", triggerClassName, className)}
      >
        <SelectValue>
          <StatusBadge status={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        {CONTACT_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            <StatusBadge status={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
