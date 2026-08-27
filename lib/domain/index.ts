export {
  CONTACT_STATUSES,
  CONTACT_STATUS_BADGE_VARIANT,
  getContactStatusBadgeVariant,
  isContactStatus,
  type ContactStatus,
  type ContactStatusBadgeVariant,
} from "@/lib/domain/contact-status";

export {
  getContactDisplayName,
  type Contact,
  type ContactCalendarDate,
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

export {
  DEFAULT_JOB_BOARD_SOURCE,
  JOB_BOARD_SOURCES,
  JOB_BOARD_SOURCE_LABELS,
  isJobBoardSource,
  jobBoardSourceLabel,
  type JobBoardSource,
} from "@/lib/domain/job-board-source";

export type {
  JobContractType,
  JobOffer,
  JobOfferId,
  JobSearchQuery,
} from "@/lib/domain/job-offer";

export type {
  Interaction,
  InteractionCreateInput,
  InteractionId,
  InteractionUpdateInput,
} from "@/lib/domain/interaction";

export type {
  MessageTemplate,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
  TemplateId,
} from "@/lib/domain/template";

export { createId, generateId } from "@/lib/domain/shared/id";
export type { JsonValue } from "@/lib/domain/shared/json";
