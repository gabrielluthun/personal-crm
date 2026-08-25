"use client";

import { useState } from "react";

import type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

export type TemplateFormValues = {
  readonly title: string;
  readonly subject: string;
  readonly body: string;
  readonly channel: string;
};

export type TemplateFormErrors = {
  readonly title?: string;
  readonly body?: string;
};

export type TemplateInsertTarget = "subject" | "body";

type UseTemplateFormOptions = {
  readonly template: MessageTemplate | null;
  readonly onCreate: (
    input: MessageTemplateCreateInput,
  ) => Promise<Result<MessageTemplate, DomainError>>;
  readonly onUpdate: (
    id: TemplateId,
    input: MessageTemplateUpdateInput,
  ) => Promise<Result<MessageTemplate, DomainError>>;
  readonly onSuccess?: (template: MessageTemplate) => void;
};

const EMPTY_VALUES: TemplateFormValues = {
  title: "Nouveau template",
  subject: "",
  body: "",
  channel: "linkedin",
};

export function useTemplateForm({
  template,
  onCreate,
  onUpdate,
  onSuccess,
}: UseTemplateFormOptions) {
  const resetKey = template?.id ?? "new";
  const [formKey, setFormKey] = useState(resetKey);
  const [values, setValues] = useState<TemplateFormValues>(() =>
    toFormValues(template),
  );
  const [fieldErrors, setFieldErrors] = useState<TemplateFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insertTarget, setInsertTarget] =
    useState<TemplateInsertTarget>("body");

  if (formKey !== resetKey) {
    setFormKey(resetKey);
    setValues(toFormValues(template));
    setFieldErrors({});
    setSubmitError(null);
    setInsertTarget("body");
  }

  function setField<K extends keyof TemplateFormValues>(
    key: K,
    value: TemplateFormValues[K],
  ): void {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function insertVariable(token: string, cursor: number | null): void {
    setValues((previous) => {
      const current = previous[insertTarget];
      const start = cursor ?? current.length;
      const next = `${current.slice(0, start)}${token}${current.slice(start)}`;
      return { ...previous, [insertTarget]: next };
    });
  }

  async function submit(): Promise<boolean> {
    const errors = validateTemplateForm(values);
    setFieldErrors(errors);
    if (errors.title !== undefined || errors.body !== undefined) {
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const input = toSubmitInput(values);
    const result =
      template === null
        ? await onCreate(input)
        : await onUpdate(template.id, input);

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error.message);
      return false;
    }

    onSuccess?.(result.value);
    return true;
  }

  return {
    values,
    fieldErrors,
    submitError,
    isSubmitting,
    isEditing: template !== null,
    insertTarget,
    setInsertTarget,
    setField,
    insertVariable,
    submit,
  };
}

function toFormValues(template: MessageTemplate | null): TemplateFormValues {
  if (template === null) {
    return EMPTY_VALUES;
  }
  return {
    title: template.title,
    subject: template.subject ?? "",
    body: template.body,
    channel: template.channel,
  };
}

function toSubmitInput(
  values: TemplateFormValues,
): MessageTemplateCreateInput {
  const subject = values.subject.trim();
  return {
    title: values.title.trim(),
    body: values.body,
    channel: values.channel.trim() || "linkedin",
    subject: subject.length === 0 ? null : subject,
  };
}

function validateTemplateForm(
  values: TemplateFormValues,
): TemplateFormErrors {
  return {
    title:
      values.title.trim().length === 0 ? "Le nom est obligatoire" : undefined,
    body:
      values.body.trim().length === 0 ? "Le corps est obligatoire" : undefined,
  };
}
