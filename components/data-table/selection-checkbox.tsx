"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { HeaderSelectionState } from "@/hooks/use-row-selection";

type SelectionCheckboxProps = {
  readonly checked: boolean;
  readonly indeterminate?: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly "aria-label": string;
  readonly disabled?: boolean;
};

export function SelectionCheckbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  "aria-label": ariaLabel,
  disabled = false,
}: SelectionCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      aria-label={ariaLabel}
      onCheckedChange={(value) => {
        onCheckedChange(value === true);
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    />
  );
}

type HeaderSelectionCheckboxProps = {
  readonly state: HeaderSelectionState;
  readonly onToggleAll: () => void;
  readonly disabled?: boolean;
};

export function HeaderSelectionCheckbox({
  state,
  onToggleAll,
  disabled = false,
}: HeaderSelectionCheckboxProps) {
  return (
    <SelectionCheckbox
      checked={state === "all"}
      indeterminate={state === "some"}
      disabled={disabled}
      aria-label="Sélectionner toutes les lignes visibles"
      onCheckedChange={() => {
        onToggleAll();
      }}
    />
  );
}
