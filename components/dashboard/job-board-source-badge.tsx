"use client";

import {
  JOB_BOARD_SOURCE_LABELS,
  type JobBoardSource,
} from "@/lib/domain/job-board-source";
import { cn } from "@/lib/utils";

type JobBoardSourceBadgeProps = {
  readonly source: JobBoardSource;
  readonly className?: string;
};

export function JobBoardSourceBadge({
  source,
  className,
}: JobBoardSourceBadgeProps) {
  const short = source === "wttj" ? "WTTJ" : "Indeed";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        source === "wttj"
          ? "border-amber-300/80 bg-amber-50 text-amber-950"
          : "border-blue-300/80 bg-blue-50 text-blue-950",
        className,
      )}
      title={JOB_BOARD_SOURCE_LABELS[source]}
    >
      {short}
    </span>
  );
}
