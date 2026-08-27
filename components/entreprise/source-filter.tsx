"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOB_BOARD_SOURCE_LABELS,
  JOB_BOARD_SOURCES,
  type JobBoardSource,
} from "@/lib/domain/job-board-source";
import { cn } from "@/lib/utils";

export type SourceFilter = "all" | JobBoardSource;

const SOURCE_FILTER_SHORT: Record<JobBoardSource, string> = {
  wttj: "WTTJ",
  indeed: "Indeed",
};

type SourceFilterControlProps = {
  readonly value: SourceFilter;
  readonly onChange: (value: SourceFilter) => void;
  readonly className?: string;
};

export function SourceFilterControl({
  value,
  onChange,
  className,
}: SourceFilterControlProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">Source</span>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next === null) {
            return;
          }
          if (next === "all" || isJobBoardSource(next)) {
            onChange(next);
          }
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Filtrer par source"
          className={cn(
            "h-7 min-w-22 gap-1 px-2 text-xs",
            value !== "all" && "border-ring",
          )}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <SelectValue>
            {value === "all" ? "Tous" : SOURCE_FILTER_SHORT[value]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="all">Tous</SelectItem>
          {JOB_BOARD_SOURCES.map((source) => (
            <SelectItem key={source} value={source}>
              {JOB_BOARD_SOURCE_LABELS[source]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function isJobBoardSource(value: string): value is JobBoardSource {
  return (JOB_BOARD_SOURCES as readonly string[]).includes(value);
}
