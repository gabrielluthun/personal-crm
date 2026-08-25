"use client";

import { useRef } from "react";

import { TemplateVariableChips } from "@/components/templates/template-variable-chips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  TemplateFormErrors,
  TemplateFormValues,
  TemplateInsertTarget,
} from "@/hooks/use-template-form";

type TemplateEditorProps = {
  readonly values: TemplateFormValues;
  readonly fieldErrors: TemplateFormErrors;
  readonly submitError: string | null;
  readonly isSubmitting: boolean;
  readonly onChange: <K extends keyof TemplateFormValues>(
    key: K,
    value: TemplateFormValues[K],
  ) => void;
  readonly onFocusTarget: (target: TemplateInsertTarget) => void;
  readonly onInsertVariable: (token: string, cursor: number | null) => void;
  readonly onSubmit: () => void;
};

export function TemplateEditor({
  values,
  fieldErrors,
  submitError,
  isSubmitting,
  onChange,
  onFocusTarget,
  onInsertVariable,
  onSubmit,
}: TemplateEditorProps) {
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef<number | null>(null);

  function rememberCursor(
    target: TemplateInsertTarget,
    cursor: number | null,
  ): void {
    onFocusTarget(target);
    cursorRef.current = cursor;
  }

  function handleInsert(token: string): void {
    onInsertVariable(token, cursorRef.current);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <h2 className="text-base font-semibold text-foreground">Éditeur</h2>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Variables disponibles (issues de contacts)&nbsp;:
        </p>
        <TemplateVariableChips
          disabled={isSubmitting}
          onInsert={(token) => {
            handleInsert(token);
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="template-title">Nom du template</Label>
        <Input
          id="template-title"
          value={values.title}
          disabled={isSubmitting}
          aria-invalid={fieldErrors.title !== undefined}
          onChange={(event) => {
            onChange("title", event.target.value);
          }}
        />
        {fieldErrors.title !== undefined ? (
          <p role="alert" className="text-xs text-destructive">
            {fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="template-subject">Sujet</Label>
        <Input
          ref={subjectRef}
          id="template-subject"
          value={values.subject}
          disabled={isSubmitting}
          onFocus={(event) => {
            rememberCursor("subject", event.currentTarget.selectionStart);
          }}
          onSelect={(event) => {
            rememberCursor("subject", event.currentTarget.selectionStart);
          }}
          onChange={(event) => {
            onChange("subject", event.target.value);
            cursorRef.current = event.target.selectionStart;
          }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <Label htmlFor="template-body">Corps</Label>
        <Textarea
          ref={bodyRef}
          id="template-body"
          value={values.body}
          disabled={isSubmitting}
          rows={10}
          className="min-h-40 flex-1 text-sm"
          aria-invalid={fieldErrors.body !== undefined}
          onFocus={(event) => {
            rememberCursor("body", event.currentTarget.selectionStart);
          }}
          onSelect={(event) => {
            rememberCursor("body", event.currentTarget.selectionStart);
          }}
          onChange={(event) => {
            onChange("body", event.target.value);
            cursorRef.current = event.target.selectionStart;
          }}
        />
        {fieldErrors.body !== undefined ? (
          <p role="alert" className="text-xs text-destructive">
            {fieldErrors.body}
          </p>
        ) : null}
      </div>

      {submitError !== null ? (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "Enregistrement…" : "Enregistrer"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Exemples : {"{{first_name}}"}, {"{{company_name}}"}.
      </p>
    </div>
  );
}
