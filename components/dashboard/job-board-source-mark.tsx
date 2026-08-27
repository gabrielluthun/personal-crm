"use client";

import type { JobBoardSource } from "@/lib/domain/job-board-source";
import { cn } from "@/lib/utils";

type JobBoardSourceMarkProps = {
  readonly source: JobBoardSource;
  readonly className?: string;
};

/** Compact brand marks (same role as the LinkedIn column icon). */
export function JobBoardSourceMark({
  source,
  className,
}: JobBoardSourceMarkProps) {
  if (source === "wttj") {
    return <WttjMark className={className} />;
  }
  return <IndeedMark className={className} />;
}

function WttjMark({ className }: { readonly className?: string }) {
  // WTTJ identity: yellow square + black W (press kit / product UI).
  return (
    <span
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-[2px] bg-[#FFCD00] text-[9px] font-black leading-none text-black",
        className,
      )}
      aria-hidden
    >
      W
    </span>
  );
}

function IndeedMark({ className }: { readonly className?: string }) {
  // Indeed brand blue mark — lettermark suitable at 16px (favicon-class).
  return (
    <span
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-[3px] bg-[#2164f3] text-[8px] font-black leading-none text-white",
        className,
      )}
      aria-hidden
    >
      in
    </span>
  );
}
