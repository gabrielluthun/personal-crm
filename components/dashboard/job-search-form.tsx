"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_JOB_BOARD_SOURCE,
  JOB_BOARD_SOURCE_LABELS,
  JOB_BOARD_SOURCES,
  type JobBoardSource,
} from "@/lib/domain/job-board-source";
import type { JobSearchQuery } from "@/lib/domain/job-offer";

type JobSearchFormProps = {
  readonly isLoading?: boolean;
  readonly statusText?: string | null;
  readonly onSubmit: (query: JobSearchQuery) => void;
};

export function JobSearchForm({
  isLoading = false,
  statusText = null,
  onSubmit,
}: JobSearchFormProps) {
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [source, setSource] = useState<JobBoardSource>(DEFAULT_JOB_BOARD_SOURCE);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedKeywords = keywords.trim();
    if (trimmedKeywords.length === 0) {
      return;
    }
    onSubmit({
      keywords: trimmedKeywords,
      location: location.trim() || undefined,
      contractType: null,
      source,
    });
  }

  return (
    <form
      className="rounded-lg border border-border bg-card px-3 py-2.5"
      onSubmit={handleSubmit}
      aria-labelledby="recherche-entreprises-title"
    >
      <div className="flex flex-wrap items-end gap-2">
        <h2
          id="recherche-entreprises-title"
          className="mr-1 self-center text-sm font-semibold text-foreground"
        >
          Recherche
        </h2>
        <div className="flex min-w-40 flex-1 flex-col gap-1 sm:max-w-48">
          <Label htmlFor="job-source" className="text-xs">
            Source
          </Label>
          <Select
            value={source}
            disabled={isLoading}
            onValueChange={(value) => {
              if (value !== null && isJobBoardSourceValue(value)) {
                setSource(value);
              }
            }}
          >
            <SelectTrigger
              id="job-source"
              size="sm"
              aria-label="Source d'offres"
              className="w-full"
            >
              <SelectValue>{JOB_BOARD_SOURCE_LABELS[source]}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              {JOB_BOARD_SOURCES.map((item) => (
                <SelectItem key={item} value={item}>
                  {JOB_BOARD_SOURCE_LABELS[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-28 flex-1 flex-col gap-1 sm:max-w-36">
          <Label htmlFor="job-location" className="text-xs">
            Ville
          </Label>
          <Input
            id="job-location"
            value={location}
            placeholder="ex. Paris"
            disabled={isLoading}
            className="h-7"
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          />
        </div>
        <div className="flex min-w-40 flex-[2] flex-col gap-1">
          <Label htmlFor="job-keywords" className="text-xs">
            Domaine / poste
          </Label>
          <Input
            id="job-keywords"
            value={keywords}
            required
            placeholder="ex. développeur web"
            disabled={isLoading}
            className="h-7"
            onChange={(event) => {
              setKeywords(event.target.value);
            }}
          />
        </div>
        <Button
          type="submit"
          size="sm"
          className="shrink-0"
          disabled={isLoading || keywords.trim().length === 0}
        >
          {isLoading ? "Recherche…" : "Valider"}
        </Button>
        {statusText ? (
          <p
            className="basis-full text-xs text-muted-foreground sm:basis-auto sm:self-center"
            role="status"
          >
            {statusText}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function isJobBoardSourceValue(value: string): value is JobBoardSource {
  return (JOB_BOARD_SOURCES as readonly string[]).includes(value);
}
