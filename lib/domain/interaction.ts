import type { ContactId } from "@/lib/domain/contact";
import type { Id } from "@/lib/domain/shared/id";
import type { IsoDateTime } from "@/lib/domain/shared/timestamps";
import type { TemplateId } from "@/lib/domain/template";

export type InteractionId = Id<"Interaction">;

/** Outbound prospecting message tracked against a contact. */
export type Interaction = {
  readonly id: InteractionId;
  readonly contactId: ContactId;
  readonly templateId: TemplateId | null;
  readonly channel: string;
  readonly messageSent: string;
  readonly sentAt: IsoDateTime;
  readonly responseReceived: boolean;
};

export type InteractionCreateInput = {
  readonly contactId: ContactId;
  readonly templateId?: TemplateId | null;
  readonly channel: string;
  readonly messageSent: string;
  readonly sentAt?: IsoDateTime;
  readonly responseReceived?: boolean;
};

export type InteractionUpdateInput = {
  readonly templateId?: TemplateId | null;
  readonly channel?: string;
  readonly messageSent?: string;
  readonly sentAt?: IsoDateTime;
  readonly responseReceived?: boolean;
};
