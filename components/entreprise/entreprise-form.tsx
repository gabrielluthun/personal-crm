"use client";

import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  EntrepriseFormErrors,
  EntrepriseFormValues,
} from "@/hooks/use-entreprise-form";

type EntrepriseFormProps = {
  readonly values: EntrepriseFormValues;
  readonly fieldErrors: EntrepriseFormErrors;
  readonly disabled?: boolean;
  readonly onChange: <K extends keyof EntrepriseFormValues>(
    key: K,
    value: EntrepriseFormValues[K],
  ) => void;
};

export function EntrepriseForm({
  values,
  fieldErrors,
  disabled = false,
  onChange,
}: EntrepriseFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field
        id="entreprise-name"
        label="Nom"
        error={fieldErrors.name}
        required
      >
        <Input
          id="entreprise-name"
          value={values.name}
          disabled={disabled}
          aria-invalid={fieldErrors.name !== undefined}
          autoComplete="organization"
          onChange={(event) => {
            onChange("name", event.target.value);
          }}
        />
      </Field>
      <Field
        id="entreprise-linkedin"
        label="LinkedIn"
        error={fieldErrors.linkedinUrl}
      >
        <Input
          id="entreprise-linkedin"
          type="url"
          value={values.linkedinUrl}
          disabled={disabled}
          placeholder="https://www.linkedin.com/company/…"
          aria-invalid={fieldErrors.linkedinUrl !== undefined}
          onChange={(event) => {
            onChange("linkedinUrl", event.target.value);
          }}
        />
      </Field>
      <Field
        id="entreprise-website"
        label="Site web"
        error={fieldErrors.websiteUrl}
      >
        <Input
          id="entreprise-website"
          type="url"
          value={values.websiteUrl}
          disabled={disabled}
          placeholder="https://…"
          aria-invalid={fieldErrors.websiteUrl !== undefined}
          onChange={(event) => {
            onChange("websiteUrl", event.target.value);
          }}
        />
      </Field>
      <Field
        id="entreprise-wttj"
        label="Welcome to the Jungle"
        error={fieldErrors.wttjUrl}
      >
        <Input
          id="entreprise-wttj"
          type="url"
          value={values.wttjUrl}
          disabled={disabled}
          placeholder="https://www.welcometothejungle.com/…"
          aria-invalid={fieldErrors.wttjUrl !== undefined}
          onChange={(event) => {
            onChange("wttjUrl", event.target.value);
          }}
        />
      </Field>
      <Field id="entreprise-location" label="Localisation">
        <Input
          id="entreprise-location"
          value={values.location}
          disabled={disabled}
          placeholder="Paris, France"
          onChange={(event) => {
            onChange("location", event.target.value);
          }}
        />
      </Field>
      <Field
        id="entreprise-target-offer"
        label="Offre cible"
        error={fieldErrors.targetOfferUrl}
      >
        <Input
          id="entreprise-target-offer"
          type="url"
          value={values.targetOfferUrl}
          disabled={disabled}
          placeholder="https://…"
          aria-invalid={fieldErrors.targetOfferUrl !== undefined}
          onChange={(event) => {
            onChange("targetOfferUrl", event.target.value);
          }}
        />
      </Field>
      <Field id="entreprise-notes" label="Notes">
        <Textarea
          id="entreprise-notes"
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
