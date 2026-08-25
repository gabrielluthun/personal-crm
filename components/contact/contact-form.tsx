"use client";

import type { ReactNode } from "react";

import { EntrepriseSelect } from "@/components/contact/entreprise-select";
import { StatusSelect } from "@/components/contact/status-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ContactFormErrors,
  ContactFormValues,
} from "@/hooks/use-contact-form";

type ContactFormProps = {
  readonly values: ContactFormValues;
  readonly fieldErrors: ContactFormErrors;
  readonly disabled?: boolean;
  readonly onChange: <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) => void;
};

export function ContactForm({
  values,
  fieldErrors,
  disabled = false,
  onChange,
}: ContactFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="contact-first-name"
          label="Prénom"
          error={fieldErrors.firstName}
          required
        >
          <Input
            id="contact-first-name"
            value={values.firstName}
            disabled={disabled}
            autoComplete="given-name"
            aria-invalid={fieldErrors.firstName !== undefined}
            onChange={(event) => {
              onChange("firstName", event.target.value);
            }}
          />
        </Field>
        <Field
          id="contact-last-name"
          label="Nom"
          error={fieldErrors.lastName}
          required
        >
          <Input
            id="contact-last-name"
            value={values.lastName}
            disabled={disabled}
            autoComplete="family-name"
            aria-invalid={fieldErrors.lastName !== undefined}
            onChange={(event) => {
              onChange("lastName", event.target.value);
            }}
          />
        </Field>
      </div>

      <Field id="contact-email" label="Email" error={fieldErrors.email}>
        <Input
          id="contact-email"
          type="email"
          value={values.email}
          disabled={disabled}
          autoComplete="email"
          aria-invalid={fieldErrors.email !== undefined}
          onChange={(event) => {
            onChange("email", event.target.value);
          }}
        />
      </Field>

      <Field
        id="contact-linkedin"
        label="LinkedIn"
        error={fieldErrors.linkedinUrl}
      >
        <Input
          id="contact-linkedin"
          type="url"
          value={values.linkedinUrl}
          disabled={disabled}
          placeholder="https://www.linkedin.com/in/…"
          aria-invalid={fieldErrors.linkedinUrl !== undefined}
          onChange={(event) => {
            onChange("linkedinUrl", event.target.value);
          }}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-status" label="Statut">
          <StatusSelect
            id="contact-status"
            value={values.status}
            disabled={disabled}
            triggerClassName="w-full min-w-0"
            onValueChange={(status) => {
              onChange("status", status);
            }}
          />
        </Field>
        <Field id="contact-entreprise" label="Entreprise">
          <EntrepriseSelect
            id="contact-entreprise"
            value={values.entrepriseId}
            disabled={disabled}
            triggerClassName="w-full min-w-0"
            onValueChange={(entrepriseId) => {
              onChange("entrepriseId", entrepriseId);
            }}
          />
        </Field>
      </div>

      <Field id="contact-notes" label="Notes">
        <Textarea
          id="contact-notes"
          value={values.notes}
          disabled={disabled}
          rows={4}
          onChange={(event) => {
            onChange("notes", event.target.value);
          }}
        />
      </Field>
    </div>
  );
}

type FieldProps = {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly children: ReactNode;
};

function Field({ id, label, error, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error !== undefined ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
