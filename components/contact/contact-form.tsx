"use client";

import { ContactDetailSections } from "@/components/contact/contact-detail-sections";
import { ContactIdentitySection } from "@/components/contact/contact-identity-section";
import type {
  ContactFormErrors,
  ContactFormValues,
} from "@/hooks/use-contact-form";

type ContactFormProps = {
  readonly values: ContactFormValues;
  readonly fieldErrors: ContactFormErrors;
  readonly channels: readonly string[];
  readonly channelsLoading?: boolean;
  readonly disabled?: boolean;
  readonly onChange: <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) => void;
};

export function ContactForm({
  values,
  fieldErrors,
  channels,
  channelsLoading = false,
  disabled = false,
  onChange,
}: ContactFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <ContactIdentitySection
        values={values}
        fieldErrors={fieldErrors}
        disabled={disabled}
        onChange={onChange}
      />
      <ContactDetailSections
        values={values}
        fieldErrors={fieldErrors}
        channels={channels}
        channelsLoading={channelsLoading}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}
