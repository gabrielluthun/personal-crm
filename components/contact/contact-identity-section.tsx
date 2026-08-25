"use client";

import { ContactFormField } from "@/components/contact/contact-form-field";
import { EntrepriseSelect } from "@/components/contact/entreprise-select";
import { Input } from "@/components/ui/input";
import type {
  ContactFormErrors,
  ContactFormValues,
} from "@/hooks/use-contact-form";

type ContactIdentitySectionProps = {
  readonly values: ContactFormValues;
  readonly fieldErrors: ContactFormErrors;
  readonly disabled?: boolean;
  readonly onChange: <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) => void;
};

export function ContactIdentitySection({
  values,
  fieldErrors,
  disabled = false,
  onChange,
}: ContactIdentitySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-foreground">Identité</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactFormField
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
        </ContactFormField>
        <ContactFormField
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
        </ContactFormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactFormField id="contact-entreprise" label="Entreprise">
          <EntrepriseSelect
            id="contact-entreprise"
            value={values.entrepriseId}
            disabled={disabled}
            triggerClassName="w-full min-w-0"
            onValueChange={(entrepriseId) => {
              onChange("entrepriseId", entrepriseId);
            }}
          />
        </ContactFormField>
        <ContactFormField id="contact-job-title" label="Poste">
          <Input
            id="contact-job-title"
            value={values.jobTitle}
            disabled={disabled}
            onChange={(event) => {
              onChange("jobTitle", event.target.value);
            }}
          />
        </ContactFormField>
      </div>
    </section>
  );
}
