import type { Id } from "@/lib/domain/shared/id";
import type { JsonValue } from "@/lib/domain/shared/json";
import type { IsoDateTime, Timestamps } from "@/lib/domain/shared/timestamps";

export type EntrepriseId = Id<"Entreprise">;

export type Entreprise = Timestamps & {
  readonly id: EntrepriseId;
  readonly name: string;
  readonly linkedinUrl: string | null;
  readonly websiteUrl: string | null;
  readonly wttjUrl: string | null;
  readonly location: string | null;
  readonly targetOfferUrl: string | null;
  readonly notes: string | null;
  readonly rawData: JsonValue | null;
  readonly scrapedAt: IsoDateTime | null;
};

export type EntrepriseCreateInput = {
  readonly name: string;
  readonly linkedinUrl?: string | null;
  readonly websiteUrl?: string | null;
  readonly wttjUrl?: string | null;
  readonly location?: string | null;
  readonly targetOfferUrl?: string | null;
  readonly notes?: string | null;
  readonly rawData?: JsonValue | null;
  readonly scrapedAt?: IsoDateTime | null;
};

export type EntrepriseUpdateInput = {
  readonly name?: string;
  readonly linkedinUrl?: string | null;
  readonly websiteUrl?: string | null;
  readonly wttjUrl?: string | null;
  readonly location?: string | null;
  readonly targetOfferUrl?: string | null;
  readonly notes?: string | null;
  readonly rawData?: JsonValue | null;
  readonly scrapedAt?: IsoDateTime | null;
};
