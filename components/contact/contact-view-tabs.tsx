"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContactPipelineView } from "@/lib/services/contact-follow-up";

type ContactViewTabsProps = {
  readonly value: ContactPipelineView;
  readonly followUpCount: number;
  readonly onValueChange: (view: ContactPipelineView) => void;
};

export function ContactViewTabs({
  value,
  followUpCount,
  onValueChange,
}: ContactViewTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        if (next === "all" || next === "follow_up" || next === "discussion") {
          onValueChange(next);
        }
      }}
    >
      <TabsList aria-label="Vue pipeline des contacts">
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="follow_up">
          À relancer
          {followUpCount > 0 ? (
            <span className="ml-1 text-muted-foreground">({followUpCount})</span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="discussion">En discussion</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
