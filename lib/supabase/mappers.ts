import type { Contact } from "@/lib/domain/contact";
import type { ContactStatus } from "@/lib/domain/contact-status";
import { isContactStatus } from "@/lib/domain/contact-status";
import type { Entreprise } from "@/lib/domain/entreprise";
import type { Interaction } from "@/lib/domain/interaction";
import type { JsonValue } from "@/lib/domain/shared/json";
import { createId } from "@/lib/domain/shared/id";
import {
  toIsoDateTime,
  type IsoDateTime,
} from "@/lib/domain/shared/timestamps";
import type { MessageTemplate } from "@/lib/domain/template";
import type {
  ContactInsert,
  ContactRow,
  EntrepriseInsert,
  EntrepriseRow,
  InteractionInsert,
  InteractionRow,
  Json,
  TemplateInsert,
  TemplateRow,
} from "@/lib/supabase/database.types";

function mapJson(value: Json | null): JsonValue | null {
  return value as JsonValue | null;
}

function toJson(value: JsonValue | null): Json | null {
  return value as Json | null;
}

function mapIso(value: string): IsoDateTime {
  return toIsoDateTime(new Date(value));
}

export function mapEntrepriseRow(row: EntrepriseRow): Entreprise {
  return {
    id: createId<"Entreprise">(row.id),
    name: row.name,
    linkedinUrl: row.linkedin_url,
    websiteUrl: row.website_url,
    wttjUrl: row.wttj_url,
    location: row.location,
    targetOfferUrl: row.target_offer_url,
    notes: row.notes,
    rawData: mapJson(row.raw_data),
    scrapedAt: row.scraped_at ? mapIso(row.scraped_at) : null,
    createdAt: mapIso(row.created_at),
    updatedAt: mapIso(row.updated_at),
  };
}

export function mapEntrepriseInsert(
  entreprise: Omit<Entreprise, "id"> & { readonly id?: Entreprise["id"] },
): EntrepriseInsert {
  return {
    ...(entreprise.id !== undefined ? { id: entreprise.id } : {}),
    name: entreprise.name,
    linkedin_url: entreprise.linkedinUrl,
    website_url: entreprise.websiteUrl,
    wttj_url: entreprise.wttjUrl,
    location: entreprise.location,
    target_offer_url: entreprise.targetOfferUrl,
    notes: entreprise.notes,
    raw_data: toJson(entreprise.rawData),
    scraped_at: entreprise.scrapedAt,
    created_at: entreprise.createdAt,
    updated_at: entreprise.updatedAt,
  };
}

export function mapContactRow(row: ContactRow): Contact {
  const status: ContactStatus = isContactStatus(row.status)
    ? row.status
    : "À contacter";
  return {
    id: createId<"Contact">(row.id),
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    linkedinUrl: row.linkedin_url,
    jobTitle: row.job_title,
    headline: row.headline,
    status,
    entrepriseId: row.entreprise_id
      ? createId<"Entreprise">(row.entreprise_id)
      : null,
    notes: row.notes,
    rawData: mapJson(row.raw_data),
    scrapedAt: row.scraped_at ? mapIso(row.scraped_at) : null,
    createdAt: mapIso(row.created_at),
    updatedAt: mapIso(row.updated_at),
  };
}

export function mapContactInsert(
  contact: Omit<Contact, "id"> & { readonly id?: Contact["id"] },
): ContactInsert {
  return {
    ...(contact.id !== undefined ? { id: contact.id } : {}),
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    linkedin_url: contact.linkedinUrl,
    job_title: contact.jobTitle,
    headline: contact.headline,
    status: contact.status,
    entreprise_id: contact.entrepriseId,
    notes: contact.notes,
    raw_data: toJson(contact.rawData),
    scraped_at: contact.scrapedAt,
    created_at: contact.createdAt,
    updated_at: contact.updatedAt,
  };
}

export function mapTemplateRow(row: TemplateRow): MessageTemplate {
  return {
    id: createId<"Template">(row.id),
    title: row.title,
    body: row.body,
    description: row.description,
    channel: row.channel,
    subject: row.subject,
    createdAt: mapIso(row.created_at),
    updatedAt: mapIso(row.updated_at),
  };
}

export function mapTemplateInsert(
  template: Omit<MessageTemplate, "id"> & {
    readonly id?: MessageTemplate["id"];
  },
): TemplateInsert {
  return {
    ...(template.id !== undefined ? { id: template.id } : {}),
    title: template.title,
    body: template.body,
    description: template.description,
    channel: template.channel,
    subject: template.subject,
    created_at: template.createdAt,
    updated_at: template.updatedAt,
  };
}

export function mapInteractionRow(row: InteractionRow): Interaction {
  return {
    id: createId<"Interaction">(row.id),
    contactId: createId<"Contact">(row.contact_id),
    templateId: row.template_id
      ? createId<"Template">(row.template_id)
      : null,
    channel: row.channel,
    messageSent: row.message_sent,
    sentAt: mapIso(row.sent_at),
    responseReceived: row.response_received,
  };
}

export function mapInteractionInsert(
  interaction: Omit<Interaction, "id"> & {
    readonly id?: Interaction["id"];
  },
): InteractionInsert {
  return {
    ...(interaction.id !== undefined ? { id: interaction.id } : {}),
    contact_id: interaction.contactId,
    template_id: interaction.templateId,
    channel: interaction.channel,
    message_sent: interaction.messageSent,
    sent_at: interaction.sentAt,
    response_received: interaction.responseReceived,
  };
}
