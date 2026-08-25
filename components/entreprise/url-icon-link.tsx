"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { openExternal } from "@/lib/tauri/open-external";
import { cn } from "@/lib/utils";

type UrlIconLinkProps = {
  readonly href: string | null | undefined;
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
};

export function UrlIconLink({
  href,
  label,
  children,
  className,
}: UrlIconLinkProps) {
  const [isOpening, setIsOpening] = useState(false);
  const url = href?.trim() ?? "";
  const hasUrl = url.length > 0;

  async function handleOpen(): Promise<void> {
    if (!hasUrl) {
      return;
    }
    setIsOpening(true);
    try {
      await openExternal(url);
    } catch {
      toast.error("Impossible d'ouvrir ce lien");
    } finally {
      setIsOpening(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={!hasUrl || isOpening}
      aria-label={hasUrl ? `Ouvrir ${label}` : `${label} non renseigné`}
      className={cn(
        "text-muted-foreground",
        hasUrl && "text-foreground hover:text-primary",
        className,
      )}
      onClick={(event) => {
        event.stopPropagation();
        void handleOpen();
      }}
    >
      {children}
    </Button>
  );
}
