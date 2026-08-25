"use client";

import { useState } from "react";

import type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

export type EntrepriseFormValues = {
  readonly name: string;
  readonly linkedinUrl: string;
  readonly websiteUrl: string;
  readonly wttjUrl: string;
  readonly location: string;
  readonly targetOfferUrl: string;
  readonly notes: string;
};

export type EntrepriseFormErrors = {
  readonly name?: string;
  readonly linkedinUrl?: string;
  readonly websiteUrl?: string;
  readonly wttjUrl?: string;
  readonly targetOfferUrl?: string;
};

type UseEntrepriseFormOptions = {
  readonly entreprise: Entreprise | null;
  readonly onCreate: (
    input: EntrepriseCreateInput,
  ) => Promise<Result<Entreprise, DomainError>>;
  readonly onUpdate: (
    id: EntrepriseId,
    input: EntrepriseUpdateInput,
  ) => Promise<Result<Entreprise, DomainError>>;
  readonly onSuccess?: (entreprise: Entreprise) => void;
};

const EMPTY_VALUES: EntrepriseFormValues = {
  name: "",
  linkedinUrl: "",
  websiteUrl: "",
  wttjUrl: "",
  location: "",
  targetOfferUrl: "",
  notes: "",
};

export function useEntrepriseForm({
  entreprise,
  onCreate,
  onUpdate,
  onSuccess,
}: UseEntrepriseFormOptions) {
  const resetKey = entreprise?.id ?? "new";
  const [formKey, setFormKey] = useState(resetKey);
  const [values, setValues] = useState<EntrepriseFormValues>(() =>
    toFormValues(entreprise),
  );
  const [fieldErrors, setFieldErrors] = useState<EntrepriseFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (formKey !== resetKey) {
    setFormKey(resetKey);
    setValues(toFormValues(entreprise));
    setFieldErrors({});
    setSubmitError(null);
  }

  function setField<K extends keyof EntrepriseFormValues>(
    key: K,
    value: EntrepriseFormValues[K],
  ): void {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(): Promise<boolean> {
    const errors = validateEntrepriseForm(values);
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) {
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const input = toSubmitInput(values);
    const result =
      entreprise === null
        ? await onCreate(input)
        : await onUpdate(entreprise.id, input);

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
    isEditing: entreprise !== null,
    setField,
    submit,
  };
}

function toFormValues(entreprise: Entreprise | null): EntrepriseFormValues {
  if (entreprise === null) {
    return EMPTY_VALUES;
  }
  return {
    name: entreprise.name,
    linkedinUrl: entreprise.linkedinUrl ?? "",
    websiteUrl: entreprise.websiteUrl ?? "",
    wttjUrl: entreprise.wttjUrl ?? "",
    location: entreprise.location ?? "",
    targetOfferUrl: entreprise.targetOfferUrl ?? "",
    notes: entreprise.notes ?? "",
  };
}

function toSubmitInput(values: EntrepriseFormValues): EntrepriseCreateInput {
  return {
    name: values.name.trim(),
    linkedinUrl: emptyToNull(values.linkedinUrl),
    websiteUrl: emptyToNull(values.websiteUrl),
    wttjUrl: emptyToNull(values.wttjUrl),
    location: emptyToNull(values.location),
    targetOfferUrl: emptyToNull(values.targetOfferUrl),
    notes: emptyToNull(values.notes),
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function validateEntrepriseForm(
  values: EntrepriseFormValues,
): EntrepriseFormErrors {
  return {
    name:
      values.name.trim().length === 0 ? "Le nom est obligatoire" : undefined,
    linkedinUrl: isOptionalHttpUrl(values.linkedinUrl)
      ? undefined
      : "URL LinkedIn invalide",
    websiteUrl: isOptionalHttpUrl(values.websiteUrl)
      ? undefined
      : "URL du site invalide",
    wttjUrl: isOptionalHttpUrl(values.wttjUrl)
      ? undefined
      : "URL Welcome to the Jungle invalide",
    targetOfferUrl: isOptionalHttpUrl(values.targetOfferUrl)
      ? undefined
      : "URL de l'offre invalide",
  };
}

function hasFieldErrors(errors: EntrepriseFormErrors): boolean {
  return (
    errors.name !== undefined ||
    errors.linkedinUrl !== undefined ||
    errors.websiteUrl !== undefined ||
    errors.wttjUrl !== undefined ||
    errors.targetOfferUrl !== undefined
  );
}

function isOptionalHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return true;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
