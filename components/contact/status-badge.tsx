"use client";

import { Badge } from "@/components/ui/badge";
import {
  getContactStatusBadgeVariant,
  type ContactStatus,
} from "@/lib/domain/contact-status";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  readonly status: ContactStatus;
  readonly className?: string;
};

/** Displays a contact pipeline status with its domain badge variant. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={getContactStatusBadgeVariant(status)}
      className={cn(className)}
    >
      {status}
    </Badge>
  );
}
