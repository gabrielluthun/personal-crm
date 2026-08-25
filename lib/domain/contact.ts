import type { ContactStatus } from "@/lib/domain/contact-status";
import type { EntrepriseId } from "@/lib/domain/entreprise";
import type { Id } from "@/lib/domain/shared/id";
import type { JsonValue } from "@/lib/domain/shared/json";
import type { IsoDateTime, Timestamps } from "@/lib/domain/shared/timestamps";

export type ContactId = Id<"Contact">;

export type Contact = Timestamps & {
  readonly id: ContactId;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
  readonly linkedinUrl: string | null;
  readonly jobTitle: string | null;
  readonly headline: string | null;
  readonly status: ContactStatus;
  readonly entrepriseId: EntrepriseId | null;
  readonly notes: string | null;
  readonly rawData: JsonValue | null;
  readonly scrapedAt: IsoDateTime | null;
};

export type ContactCreateInput = {
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string | null;
  readonly linkedinUrl?: string | null;
  readonly jobTitle?: string | null;
  readonly headline?: string | null;
  readonly status?: ContactStatus;
  readonly entrepriseId?: EntrepriseId | null;
  readonly notes?: string | null;
  readonly rawData?: JsonValue | null;
  readonly scrapedAt?: IsoDateTime | null;
};

export type ContactUpdateInput = {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string | null;
  readonly linkedinUrl?: string | null;
  readonly jobTitle?: string | null;
  readonly headline?: string | null;
  readonly status?: ContactStatus;
  readonly entrepriseId?: EntrepriseId | null;
  readonly notes?: string | null;
  readonly rawData?: JsonValue | null;
  readonly scrapedAt?: IsoDateTime | null;
};

export function getContactDisplayName(contact: Contact): string {
  return `${contact.firstName} ${contact.lastName}`.trim();
}
