"use client";

import { useState } from "react";

import { useRepositories } from "@/components/providers/repository-provider";
import { useAsyncResource } from "@/hooks/use-async-resource";
import type {
  Contact,
  ContactId,
  ContactUpdateInput,
} from "@/lib/domain/contact";
import type { Entreprise } from "@/lib/domain/entreprise";
import type { Interaction } from "@/lib/domain/interaction";
import type { DomainError } from "@/lib/domain/shared/errors";
import { validationError } from "@/lib/domain/shared/errors";
import { err, ok, type Result } from "@/lib/domain/shared/result";
import type { MessageTemplate, TemplateId } from "@/lib/domain/template";
import { suggestTemplateId } from "@/lib/services/contact-follow-up";
import {
  statusAfterOutboundSend,
  todayCalendarDate,
} from "@/lib/services/contact-send";
import {
  buildContactSendPreview,
  uniqueInteractionChannels,
  type ContactSendPreview,
} from "@/lib/services/contact-send-preview";
import { formatMissingVariables } from "@/lib/services/template-renderer";

export type { ContactSendPreview };

type UseContactSendOptions = {
  readonly contact: Contact | null;
  readonly onUpdate: (
    id: ContactId,
    input: ContactUpdateInput,
  ) => Promise<Result<Contact, DomainError>>;
  readonly onRecorded?: (contact: Contact) => void;
};

export function useContactSend({
  contact,
  onUpdate,
  onRecorded,
}: UseContactSendOptions) {
  const { templates, interactions, entreprises } = useRepositories();
  const [templateId, setTemplateId] = useState<TemplateId | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const templateList = useAsyncResource(
    () =>
      templates.list({
        pagination: { page: 1, pageSize: 100 },
        sort: { field: "title", direction: "asc" },
      }),
    [],
  );

  const history = useAsyncResource(
    () =>
      contact === null
        ? Promise.resolve(ok([] as const))
        : interactions.listByContact(contact.id),
    [contact?.id],
  );

  const company = useAsyncResource(
    (): Promise<Result<Entreprise | null, DomainError>> =>
      contact?.entrepriseId
        ? entreprises.getById(contact.entrepriseId)
        : Promise.resolve(ok(null)),
    [contact?.entrepriseId],
  );

  const items: readonly MessageTemplate[] = templateList.data?.items ?? [];
  const suggestedTemplateId =
    contact !== null ? suggestTemplateId(contact.status, items) : null;
  const selected =
    items.find((item) => item.id === templateId) ??
    items.find((item) => item.id === suggestedTemplateId) ??
    items[0] ??
    null;
  const companyReady =
    contact === null ||
    contact.entrepriseId === null ||
    !company.isLoading;
  const preview = buildContactSendPreview(
    contact,
    selected,
    companyReady
      ? contact?.entrepriseId
        ? company.data
        : null
      : undefined,
  );
  const channels = uniqueInteractionChannels(
    (history.data ?? []).map((item) => item.channel),
  );

  function selectTemplate(id: TemplateId): void {
    setTemplateId(id);
    setActionError(null);
  }

  async function copyMessage(): Promise<Result<void, DomainError>> {
    if (preview === null) {
      return err(validationError("Choisissez un template."));
    }
    try {
      await navigator.clipboard.writeText(preview.body.rendered);
      return ok(undefined);
    } catch (cause) {
      return err(
        validationError("Impossible de copier dans le presse-papiers.", cause),
      );
    }
  }

  async function recordSend(): Promise<Result<Contact, DomainError>> {
    if (contact === null || selected === null || preview === null) {
      return err(validationError("Enregistrez le contact avant d’envoyer."));
    }

    setIsRecording(true);
    setActionError(null);

    const created = await interactions.create({
      contactId: contact.id,
      templateId: selected.id,
      channel: selected.channel.trim() || "linkedin",
      messageSent: preview.body.rendered,
    });

    if (!created.ok) {
      setIsRecording(false);
      setActionError(created.error.message);
      return created;
    }

    const nextStatus = statusAfterOutboundSend(contact.status);
    const patch: ContactUpdateInput = {
      lastMessageSentAt: todayCalendarDate(),
      ...(nextStatus !== null ? { status: nextStatus } : {}),
    };

    const updated = await onUpdate(contact.id, patch);
    setIsRecording(false);

    if (!updated.ok) {
      setActionError(updated.error.message);
      return updated;
    }

    history.reload();
    onRecorded?.(updated.value);
    return updated;
  }

  return {
    templates: items,
    templatesLoading: templateList.isLoading,
    selectedTemplate: selected,
    suggestedTemplateId,
    selectTemplate,
    preview,
    missingLabel:
      preview !== null && preview.body.missing.length > 0
        ? formatMissingVariables(preview.body.missing)
        : null,
    interactions: (history.data ?? []) as readonly Interaction[],
    interactionsLoading: history.isLoading,
    channels,
    isRecording,
    actionError,
    copyMessage,
    recordSend,
  };
}
