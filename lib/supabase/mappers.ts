import type { Contact } from "@/lib/domain/contact";
import type { ContactStatus } from "@/lib/domain/contact-status";
import { isContactStatus } from "@/lib/domain/contact-status";
import type { Entreprise } from "@/lib/domain/entreprise";
import { createId } from "@/lib/domain/shared/id";
import { toIsoDateTime } from "@/lib/domain/shared/timestamps";
import type {
  ContactRow,
  EntrepriseRow,
} from "@/lib/supabase/database.types";

export function mapEntrepriseRow(row: EntrepriseRow): Entreprise {
  return {
    id: createId<"Entreprise">(row.id),
    name: row.name,
    linkedinUrl: row.linkedin_url,
    websiteUrl: row.website_url,
    wttjUrl: row.wttj_url,
    notes: row.notes,
    createdAt: toIsoDateTime(new Date(row.created_at)),
    updatedAt: toIsoDateTime(new Date(row.updated_at)),
  };
}

export function mapEntrepriseToInsert(entreprise: Entreprise): EntrepriseRow {
  return {
    id: entreprise.id,
    name: entreprise.name,
    linkedin_url: entreprise.linkedinUrl,
    website_url: entreprise.websiteUrl,
    wttj_url: entreprise.wttjUrl,
    notes: entreprise.notes,
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
    status,
    entrepriseId: row.entreprise_id
      ? createId<"Entreprise">(row.entreprise_id)
      : null,
    notes: row.notes,
    createdAt: toIsoDateTime(new Date(row.created_at)),
    updatedAt: toIsoDateTime(new Date(row.updated_at)),
  };
}

export function mapContactToInsert(contact: Contact): ContactRow {
  return {
    id: contact.id,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    linkedin_url: contact.linkedinUrl,
    status: contact.status,
    entreprise_id: contact.entrepriseId,
    notes: contact.notes,
    created_at: contact.createdAt,
    updated_at: contact.updatedAt,
  };
}
