import type { Contact } from "@/lib/domain/contact";
import type { Entreprise } from "@/lib/domain/entreprise";
import type { MessageTemplate } from "@/lib/domain/template";
import { buildTemplateValues } from "@/lib/services/build-template-values";
import {
  renderTemplate,
  type TemplateRenderResult,
} from "@/lib/services/template-renderer";

export type ContactSendPreview = {
  readonly subject: TemplateRenderResult | null;
  readonly body: TemplateRenderResult;
  readonly channel: string;
};

/**
 * Builds subject/body previews for a contact + template.
 * Pass `entreprise: undefined` while the company is still loading.
 */
export function buildContactSendPreview(
  contact: Contact | null,
  template: MessageTemplate | null,
  entreprise: Entreprise | null | undefined,
): ContactSendPreview | null {
  if (contact === null || template === null) {
    return null;
  }
  const values = buildTemplateValues(contact, entreprise ?? null);
  const subject =
    template.subject !== null && template.subject.trim().length > 0
      ? renderTemplate(template.subject, values)
      : null;
  const body = renderTemplate(template.body, values);
  const pendingCompany = entreprise === undefined;

  return {
    channel: template.channel,
    subject: omitPendingEntreprise(subject, pendingCompany),
    body: omitPendingEntreprise(body, pendingCompany) ?? body,
  };
}

export function uniqueInteractionChannels(
  values: readonly string[],
): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of values) {
    const channel = raw.trim();
    if (channel.length === 0 || seen.has(channel)) {
      continue;
    }
    seen.add(channel);
    result.push(channel);
  }
  return result.sort((a, b) => a.localeCompare(b, "fr"));
}

function omitPendingEntreprise(
  result: TemplateRenderResult | null,
  pendingCompany: boolean,
): TemplateRenderResult | null {
  if (result === null) {
    return null;
  }
  if (!pendingCompany) {
    return result;
  }
  return {
    ...result,
    missing: result.missing.filter((key) => key !== "entreprise"),
  };
}
