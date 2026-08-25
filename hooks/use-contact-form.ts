"use client";

import { useState } from "react";

import type {
  Contact,
  ContactCreateInput,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { ContactStatus } from "@/lib/domain/contact-status";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";
import {
  hasContactFieldErrors,
  validateContactForm,
} from "@/hooks/use-contact-form-validation";

export type ContactFormValues = {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly linkedinUrl: string;
  readonly jobTitle: string;
  readonly headline: string;
  readonly status: ContactStatus;
  readonly entrepriseId: EntrepriseId | null;
  readonly notes: string;
};

export type ContactFormErrors = {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly linkedinUrl?: string;
};

type UseContactFormOptions = {
  readonly contact: Contact | null;
  readonly onCreate: (
    input: ContactCreateInput,
  ) => Promise<Result<Contact, DomainError>>;
  readonly onUpdate: (
    id: ContactId,
    input: ContactUpdateInput,
  ) => Promise<Result<Contact, DomainError>>;
  readonly onSuccess?: (contact: Contact) => void;
};

const EMPTY_VALUES: ContactFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  linkedinUrl: "",
  jobTitle: "",
  headline: "",
  status: "À contacter",
  entrepriseId: null,
  notes: "",
};

export function useContactForm({
  contact,
  onCreate,
  onUpdate,
  onSuccess,
}: UseContactFormOptions) {
  const resetKey = contact?.id ?? "new";
  const [formKey, setFormKey] = useState(resetKey);
  const [values, setValues] = useState<ContactFormValues>(() =>
    toFormValues(contact),
  );
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (formKey !== resetKey) {
    setFormKey(resetKey);
    setValues(toFormValues(contact));
    setFieldErrors({});
    setSubmitError(null);
  }

  function setField<K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ): void {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(): Promise<boolean> {
    const errors = validateContactForm(values);
    setFieldErrors(errors);
    if (hasContactFieldErrors(errors)) {
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const input = toSubmitInput(values);
    const result =
      contact === null
        ? await onCreate(input)
        : await onUpdate(contact.id, input);

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
    isEditing: contact !== null,
    setField,
    submit,
  };
}

function toFormValues(contact: Contact | null): ContactFormValues {
  if (contact === null) {
    return EMPTY_VALUES;
  }
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email ?? "",
    linkedinUrl: contact.linkedinUrl ?? "",
    jobTitle: contact.jobTitle ?? "",
    headline: contact.headline ?? "",
    status: contact.status,
    entrepriseId: contact.entrepriseId,
    notes: contact.notes ?? "",
  };
}

function toSubmitInput(values: ContactFormValues): ContactCreateInput {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: emptyToNull(values.email),
    linkedinUrl: emptyToNull(values.linkedinUrl),
    jobTitle: emptyToNull(values.jobTitle),
    headline: emptyToNull(values.headline),
    status: values.status,
    entrepriseId: values.entrepriseId,
    notes: emptyToNull(values.notes),
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}
