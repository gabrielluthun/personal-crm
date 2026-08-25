import type {
  Contact,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import { touchUpdatedAt } from "@/lib/domain/shared/timestamps";

export function mergeContactUpdate(
  current: Contact,
  input: ContactUpdateInput,
): Contact {
  return {
    ...current,
    firstName: input.firstName?.trim() ?? current.firstName,
    lastName: input.lastName?.trim() ?? current.lastName,
    email: input.email === undefined ? current.email : input.email,
    linkedinUrl:
      input.linkedinUrl === undefined ? current.linkedinUrl : input.linkedinUrl,
    jobTitle: input.jobTitle === undefined ? current.jobTitle : input.jobTitle,
    headline: input.headline === undefined ? current.headline : input.headline,
    status: input.status ?? current.status,
    entrepriseId:
      input.entrepriseId === undefined
        ? current.entrepriseId
        : input.entrepriseId,
    notes: input.notes === undefined ? current.notes : input.notes,
    rawData: input.rawData === undefined ? current.rawData : input.rawData,
    scrapedAt:
      input.scrapedAt === undefined ? current.scrapedAt : input.scrapedAt,
    ...touchUpdatedAt(current),
  };
}
