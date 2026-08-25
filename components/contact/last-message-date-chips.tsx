"use client";

import { Button } from "@/components/ui/button";
import type { ContactCalendarDate } from "@/lib/domain/contact";

type LastMessageDateChipsProps = {
  readonly value: ContactCalendarDate | "";
  readonly disabled?: boolean;
  readonly onChange: (value: ContactCalendarDate | "") => void;
};

export function LastMessageDateChips({
  value,
  disabled = false,
  onChange,
}: LastMessageDateChipsProps) {
  const today = toLocalCalendarDate(new Date());
  const yesterday = toLocalCalendarDate(addLocalDays(new Date(), -1));

  return (
    <div
      role="group"
      aria-label="Raccourcis date du dernier message"
      className="flex flex-wrap gap-1.5"
    >
      <Chip
        pressed={value === today}
        disabled={disabled}
        onClick={() => {
          onChange(today);
        }}
      >
        Aujourd&apos;hui
      </Chip>
      <Chip
        pressed={value === yesterday}
        disabled={disabled}
        onClick={() => {
          onChange(yesterday);
        }}
      >
        Hier
      </Chip>
      <Chip
        pressed={value === ""}
        disabled={disabled}
        onClick={() => {
          onChange("");
        }}
      >
        Effacer
      </Chip>
    </div>
  );
}

type ChipProps = {
  readonly pressed: boolean;
  readonly disabled: boolean;
  readonly onClick: () => void;
  readonly children: string;
};

function Chip({ pressed, disabled, onClick, children }: ChipProps) {
  return (
    <Button
      type="button"
      size="xs"
      variant={pressed ? "secondary" : "outline"}
      disabled={disabled}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function toLocalCalendarDate(date: Date): ContactCalendarDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addLocalDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}
