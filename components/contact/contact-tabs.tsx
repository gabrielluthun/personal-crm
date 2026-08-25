"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContactTab } from "@/hooks/use-contacts";

type ContactTabsProps = {
  readonly value: ContactTab;
  readonly onValueChange: (tab: ContactTab) => void;
};

export function ContactTabs({ value, onValueChange }: ContactTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        if (next === "all" || next === "discussion") {
          onValueChange(next);
        }
      }}
    >
      <TabsList aria-label="Filtrer les contacts">
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="discussion">En discussion</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
