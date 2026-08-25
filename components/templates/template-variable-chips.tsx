"use client";

import { Button } from "@/components/ui/button";
import {
  TEMPLATE_VARIABLES,
  TEMPLATE_VARIABLE_LABELS,
  templateVariableToken,
  type TemplateVariableKey,
} from "@/lib/domain/template-variables";

type TemplateVariableChipsProps = {
  readonly disabled?: boolean;
  readonly onInsert: (token: string, key: TemplateVariableKey) => void;
};

export function TemplateVariableChips({
  disabled = false,
  onInsert,
}: TemplateVariableChipsProps) {
  return (
    <div
      role="group"
      aria-label="Variables disponibles issues de contacts"
      className="flex flex-wrap gap-2"
    >
      {TEMPLATE_VARIABLES.map((key) => {
        const token = templateVariableToken(key);
        const label = TEMPLATE_VARIABLE_LABELS[key];
        return (
          <Button
            key={key}
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled}
            title={`Insérer ${token}`}
            aria-label={`Insérer ${label} (${token})`}
            className="rounded-full px-3 font-normal"
            onClick={() => {
              onInsert(token, key);
            }}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
