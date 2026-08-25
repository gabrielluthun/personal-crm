"use client";

import { ContactChannelsBadges } from "@/components/contact/contact-channels-badges";
import { ContactFormField } from "@/components/contact/contact-form-field";
import { LastMessageDateChips } from "@/components/contact/last-message-date-chips";
import { StatusSelect } from "@/components/contact/status-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  ContactFormErrors,
  ContactFormValues,
} from "@/hooks/use-contact-form";

type ContactDetailSectionsProps = {
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

export function ContactDetailSections({
  values,
  fieldErrors,
  channels,
  channelsLoading = false,
  disabled = false,
  onChange,
}: ContactDetailSectionsProps) {
  return (
    <>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-foreground">Statut & suivi</h3>
        <ContactFormField id="contact-status" label="Statut CRM">
          <StatusSelect
            id="contact-status"
            value={values.status}
            disabled={disabled}
            triggerClassName="w-full min-w-0"
            onValueChange={(status) => {
              onChange("status", status);
            }}
          />
        </ContactFormField>
        <ContactFormField
          id="contact-last-message"
          label="Dernier message envoyé"
        >
          <Input
            id="contact-last-message"
            type="date"
            value={values.lastMessageSentAt}
            disabled={disabled}
            onChange={(event) => {
              onChange("lastMessageSentAt", event.target.value);
            }}
          />
        </ContactFormField>
        <LastMessageDateChips
          value={values.lastMessageSentAt}
          disabled={disabled}
          onChange={(next) => {
            onChange("lastMessageSentAt", next);
          }}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-foreground">
          Coordonnées & canaux
        </h3>
        <ContactFormField
          id="contact-email"
          label="Email"
          error={fieldErrors.email}
        >
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
        </ContactFormField>
        <ContactFormField
          id="contact-linkedin"
          label="URL LinkedIn"
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
        </ContactFormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactFormField id="contact-whatsapp" label="WhatsApp">
            <Input
              id="contact-whatsapp"
              type="tel"
              value={values.whatsapp}
              disabled={disabled}
              placeholder="+33…"
              onChange={(event) => {
                onChange("whatsapp", event.target.value);
              }}
            />
          </ContactFormField>
          <ContactFormField id="contact-phone" label="Téléphone">
            <Input
              id="contact-phone"
              type="tel"
              value={values.phone}
              disabled={disabled}
              onChange={(event) => {
                onChange("phone", event.target.value);
              }}
            />
          </ContactFormField>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">Canaux utilisés</p>
          <ContactChannelsBadges
            channels={channels}
            isLoading={channelsLoading}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-foreground">Notes internes</h3>
        <ContactFormField id="contact-notes" label="Notes">
          <Textarea
            id="contact-notes"
            value={values.notes}
            disabled={disabled}
            rows={4}
            onChange={(event) => {
              onChange("notes", event.target.value);
            }}
          />
        </ContactFormField>
      </section>
    </>
  );
}
