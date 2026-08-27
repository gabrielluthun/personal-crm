"use client";

import { GlobeIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { JobBoardSourceBadge } from "@/components/dashboard/job-board-source-badge";
import { SelectionCheckbox } from "@/components/data-table/selection-checkbox";
import { Button } from "@/components/ui/button";
import type { CompanyProposition } from "@/lib/dashboard/company-propositions";
import { jobBoardSourceLabel } from "@/lib/domain/job-board-source";
import { openExternal } from "@/lib/tauri/open-external";
import { cn } from "@/lib/utils";

type CompanyPropositionCardProps = {
  readonly proposition: CompanyProposition;
  readonly recruitmentContext: string;
  readonly selected: boolean;
  readonly onSelectedChange: (selected: boolean) => void;
};

export function CompanyPropositionCard({
  proposition,
  recruitmentContext,
  selected,
  onSelectedChange,
}: CompanyPropositionCardProps) {
  const boardLabel = jobBoardSourceLabel(proposition.source);
  const boardShort = proposition.source === "wttj" ? "WTTJ" : "Indeed";

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        selected && "ring-2 ring-primary/40",
      )}
      data-state={selected ? "selected" : undefined}
    >
      <div className="flex items-start gap-3">
        <SelectionCheckbox
          checked={selected}
          aria-label={`Sélectionner ${proposition.companyName}`}
          onCheckedChange={onSelectedChange}
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-snug text-foreground">
              {proposition.companyName}
            </h3>
            <JobBoardSourceBadge source={proposition.source} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <ResultLink
              href={proposition.websiteUrl}
              label="Site web"
              icon={<GlobeIcon className="size-3.5" aria-hidden />}
              missingLabel="Site web non détecté"
            />
            <ResultLink
              href={proposition.linkedinUrl}
              label="LinkedIn"
              missingLabel="LinkedIn non détecté"
            />
            <ResultLink
              href={proposition.companyBoardUrl}
              label={boardLabel}
              icon={
                proposition.source === "wttj" ? <WttjMark /> : undefined
              }
              missingLabel={`${boardShort} non détecté`}
            />
            <ResultLink
              href={proposition.offerUrl}
              label={`Offre ${boardShort}`}
            />
          </div>

          {proposition.activity ? (
            <p className="text-sm text-foreground">
              <span className="font-medium">Activité</span>
              <span className="text-muted-foreground"> — </span>
              {proposition.activity}
            </p>
          ) : null}

          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Recrutement</span>
            {" — "}
            {recruitmentContext}
          </p>
        </div>
      </div>
    </article>
  );
}

function WttjMark() {
  return (
    <span
      className="inline-flex size-3.5 items-center justify-center rounded-[2px] bg-[#FFCD00] text-[9px] font-black text-black"
      aria-hidden
    >
      W
    </span>
  );
}

type ResultLinkProps = {
  readonly href: string | null;
  readonly label: string;
  readonly missingLabel?: string;
  readonly icon?: ReactNode;
};

function ResultLink({ href, label, missingLabel, icon }: ResultLinkProps) {
  const [isOpening, setIsOpening] = useState(false);
  const url = href?.trim() ?? "";

  if (url.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {missingLabel ?? "Non détecté"}
      </span>
    );
  }

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      disabled={isOpening}
      className="h-auto gap-1.5 px-0 py-0 font-normal text-foreground underline-offset-4"
      aria-label={`Ouvrir ${label}`}
      onClick={(event) => {
        event.stopPropagation();
        setIsOpening(true);
        void openExternal(url)
          .catch(() => {
            toast.error("Impossible d'ouvrir ce lien");
          })
          .finally(() => {
            setIsOpening(false);
          });
      }}
    >
      {icon}
      {label}
    </Button>
  );
}
