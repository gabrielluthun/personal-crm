"use client";

import { SelectionCheckbox } from "@/components/data-table/selection-checkbox";
import { ExternalLinkCell } from "@/components/data-table/external-link-cell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobOffer } from "@/lib/domain/job-offer";
import { cn } from "@/lib/utils";

type JobOfferCardProps = {
  readonly offer: JobOffer;
  readonly selected: boolean;
  readonly onSelectedChange: (selected: boolean) => void;
};

export function JobOfferCard({
  offer,
  selected,
  onSelectedChange,
}: JobOfferCardProps) {
  return (
    <Card
      size="sm"
      className={cn(selected && "ring-2 ring-primary/40")}
      data-state={selected ? "selected" : undefined}
    >
      <CardHeader className="grid-cols-[auto_1fr] items-start gap-3">
        <SelectionCheckbox
          checked={selected}
          aria-label={`Sélectionner ${offer.companyName}`}
          onCheckedChange={onSelectedChange}
        />
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base leading-snug">{offer.title}</CardTitle>
          <CardDescription>
            {offer.companyName} · {offer.location}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{offer.contractType}</Badge>
          {offer.publishedAt !== null ? (
            <span className="text-xs text-muted-foreground">
              Publié le{" "}
              {new Date(offer.publishedAt).toLocaleDateString("fr-FR")}
            </span>
          ) : null}
        </div>
        {offer.descriptionSnippet !== null ? (
          <p className="text-sm text-muted-foreground">
            {offer.descriptionSnippet}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <ExternalLinkCell href={offer.wttjUrl} label="Offre WTTJ" />
          <ExternalLinkCell
            href={offer.companyWebsiteUrl}
            label="Site"
          />
          <ExternalLinkCell
            href={offer.companyLinkedinUrl}
            label="LinkedIn"
          />
        </div>
      </CardContent>
    </Card>
  );
}
