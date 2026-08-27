import type { JobBoardSource } from "@/lib/domain/job-board-source";
import { isJobBoardSource } from "@/lib/domain/job-board-source";
import type { JsonValue } from "@/lib/domain/shared/json";

const SOURCE_KEY = "jobBoardSource";
const SLUG_KEY = "companySlug";

type JsonObject = { readonly [key: string]: JsonValue | undefined };

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads job-board provenance stored inside `rawData` (no DB column yet). */
export function readJobBoardSourceFromRaw(
  rawData: JsonValue | null,
): JobBoardSource | null {
  if (rawData === null || !isJsonObject(rawData)) {
    return null;
  }
  const value = rawData[SOURCE_KEY];
  return isJobBoardSource(value) ? value : null;
}

/** Reads company slug stored at import time for search dedup. */
export function readCompanySlugFromRaw(
  rawData: JsonValue | null,
): string | null {
  if (rawData === null || !isJsonObject(rawData)) {
    return null;
  }
  const value = rawData[SLUG_KEY];
  if (typeof value !== "string") {
    return null;
  }
  const slug = value.trim().toLowerCase();
  return slug.length > 0 ? slug : null;
}

/** Merges provenance (+ optional slug) into `rawData` for Supabase. */
export function writeJobBoardMetaToRaw(
  rawData: JsonValue | null,
  meta: {
    readonly source: JobBoardSource | null;
    readonly companySlug?: string | null;
  },
): JsonValue | null {
  const base: { [key: string]: JsonValue | undefined } =
    rawData !== null && isJsonObject(rawData) ? { ...rawData } : {};

  if (meta.source === null) {
    delete base[SOURCE_KEY];
  } else {
    base[SOURCE_KEY] = meta.source;
  }

  if (meta.companySlug !== undefined) {
    const slug = meta.companySlug?.trim().toLowerCase() ?? "";
    if (slug.length === 0) {
      delete base[SLUG_KEY];
    } else {
      base[SLUG_KEY] = slug;
    }
  }

  return Object.keys(base).length === 0 ? null : base;
}
