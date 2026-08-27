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
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-5"
      onSubmit={handleSubmit}
      aria-labelledby="recherche-entreprises-title"
    >
      <h2
        id="recherche-entreprises-title"
        className="text-base font-semibold text-foreground"
      >
        Recherche entreprises
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-source">Source</Label>
          <Select
            value={source}
            disabled={isLoading}
            onValueChange={(value) => {
              if (value !== null && isJobBoardSourceValue(value)) {
                setSource(value);
              }
            }}
          >
            <SelectTrigger id="job-source" aria-label="Source d'offres">
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-location">Ville</Label>
          <Input
            id="job-location"
            value={location}
            placeholder="ex. Paris"
            disabled={isLoading}
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-keywords">Domaine / type de poste</Label>
          <Input
            id="job-keywords"
            value={keywords}
            required
            placeholder="ex. développeur web"
            disabled={isLoading}
            onChange={(event) => {
              setKeywords(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isLoading || keywords.trim().length === 0}
        >
          {isLoading ? "Recherche…" : "Valider"}
        </Button>
        {statusText ? (
          <p className="text-sm text-muted-foreground" role="status">
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
