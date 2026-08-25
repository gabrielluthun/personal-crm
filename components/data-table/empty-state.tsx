"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-12 text-center",
        className,
      )}
    >
      {icon !== undefined ? (
        <div className="mb-1 text-muted-foreground [&_svg]:size-8">{icon}</div>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description !== undefined ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action !== undefined ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
