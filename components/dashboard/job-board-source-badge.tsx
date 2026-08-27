"use client";

import { JobBoardSourceMark } from "@/components/dashboard/job-board-source-mark";
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
        "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        source === "wttj"
          ? "border-amber-300/80 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-100"
          : "border-blue-300/80 bg-blue-50 text-blue-950 dark:border-blue-500/40 dark:bg-blue-950/50 dark:text-blue-100",
        className,
      )}
      title={JOB_BOARD_SOURCE_LABELS[source]}
    >
      <JobBoardSourceMark source={source} />
      {short}
    </span>
  );
}
