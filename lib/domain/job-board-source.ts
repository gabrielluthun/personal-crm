/**
 * Job board used for dashboard discovery (one source at a time).
 */

export const JOB_BOARD_SOURCES = ["wttj", "indeed"] as const;

export type JobBoardSource = (typeof JOB_BOARD_SOURCES)[number];

export const JOB_BOARD_SOURCE_LABELS: Record<JobBoardSource, string> = {
  wttj: "Welcome to the Jungle",
  indeed: "Indeed",
};

export const DEFAULT_JOB_BOARD_SOURCE: JobBoardSource = "wttj";

export function isJobBoardSource(value: unknown): value is JobBoardSource {
  return (
    typeof value === "string" &&
    (JOB_BOARD_SOURCES as readonly string[]).includes(value)
  );
}

export function jobBoardSourceLabel(source: JobBoardSource): string {
  return JOB_BOARD_SOURCE_LABELS[source];
}
