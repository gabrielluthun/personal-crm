export {
  CONTACT_STATUSES,
  CONTACT_STATUS_BADGE_VARIANT,
  DISCUSSION_STATUSES,
  getContactStatusBadgeVariant,
  isContactStatus,
  type ContactStatus,
  type ContactStatusBadgeVariant,
} from "@/lib/domain/contact-status";

export {
  getContactDisplayName,
  type Contact,
  type ContactCreateInput,
  type ContactId,
  type ContactUpdateInput,
} from "@/lib/domain/contact";

export type {
  Entreprise,
  EntrepriseCreateInput,
  EntrepriseId,
  EntrepriseUpdateInput,
} from "@/lib/domain/entreprise";

export type {
  JobContractType,
  JobOffer,
  JobOfferId,
  JobSearchQuery,
} from "@/lib/domain/job-offer";

export type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";
