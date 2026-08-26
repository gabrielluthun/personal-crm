"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { openExternal } from "@/lib/tauri/open-external";
import { cn } from "@/lib/utils";

type ExternalLinkCellProps = {
  readonly href: string | null | undefined;
  readonly label?: string;
  readonly className?: string;
};

export function ExternalLinkCell({
  href,
  label,
  className,
}: ExternalLinkCellProps) {
  const [isOpening, setIsOpening] = useState(false);
  const url = href?.trim() ?? "";

  if (url.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const display = label?.trim() || shortenUrl(url);

  async function handleOpen(): Promise<void> {
    setIsOpening(true);
    try {
      await openExternal(url);
    } finally {
      setIsOpening(false);
    }
  }

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      disabled={isOpening}
      className={cn(
        "h-auto max-w-56 justify-start gap-1 truncate px-0 py-0 font-normal",
        className,
      )}
      aria-label={`Ouvrir ${display}`}
      onClick={(event) => {
        event.stopPropagation();
        void handleOpen();
      }}
    >
      <span className="truncate">{display}</span>
      <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" aria-hidden />
    </Button>
  );
}

function shortenUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    const display = `${parsed.hostname}${path}`;
    return display.length > 36 ? `${display.slice(0, 33)}…` : display;
  } catch {
    return url.length > 36 ? `${url.slice(0, 33)}…` : url;
  }
}
