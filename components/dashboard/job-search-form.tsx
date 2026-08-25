"use client";

import { useState, type FormEvent } from "react";
import { SearchIcon } from "lucide-react";

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
import type {
  JobContractType,
  JobSearchQuery,
} from "@/lib/domain/job-offer";

const CONTRACT_TYPES: readonly JobContractType[] = [
  "CDI",
  "CDD",
  "Freelance",
  "Stage",
  "Alternance",
  "Autre",
];

const ANY_CONTRACT = "__any__";

type JobSearchFormProps = {
  readonly isLoading?: boolean;
  readonly onSubmit: (query: JobSearchQuery) => void;
};

export function JobSearchForm({
  isLoading = false,
  onSubmit,
}: JobSearchFormProps) {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [contractType, setContractType] = useState<string>(ANY_CONTRACT);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedKeywords = keywords.trim();
    if (trimmedKeywords.length === 0) {
      return;
    }
    onSubmit({
      keywords: trimmedKeywords,
      location: location.trim() || undefined,
      contractType:
        contractType === ANY_CONTRACT
          ? null
          : (contractType as JobContractType),
    });
  }

  return (
    <form
      className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="job-keywords">Mots-clés</Label>
        <Input
          id="job-keywords"
          value={keywords}
          required
          placeholder="ex. React, TypeScript…"
          disabled={isLoading}
          onChange={(event) => {
            setKeywords(event.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="job-location">Localisation</Label>
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
        <Label htmlFor="job-contract">Contrat</Label>
        <Select
          value={contractType}
          disabled={isLoading}
          onValueChange={(value) => {
            if (typeof value === "string") {
              setContractType(value);
            }
          }}
        >
          <SelectTrigger id="job-contract" className="w-full">
            <SelectValue placeholder="Tous">
              {(selected) =>
                selected === ANY_CONTRACT || selected === null
                  ? "Tous les contrats"
                  : String(selected)
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_CONTRACT}>Tous les contrats</SelectItem>
            {CONTRACT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || keywords.trim().length === 0}
        >
          <SearchIcon data-icon="inline-start" />
          {isLoading ? "Recherche…" : "Rechercher"}
        </Button>
      </div>
    </form>
  );
}
