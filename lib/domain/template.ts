import type { Id } from "@/lib/domain/shared/id";
import type { Timestamps } from "@/lib/domain/shared/timestamps";

export type TemplateId = Id<"Template">;

/**
 * Icebreaker / message template.
 * Body may contain placeholders such as {{nom_entreprise}}.
 */
export type MessageTemplate = Timestamps & {
  readonly id: TemplateId;
  readonly title: string;
  readonly body: string;
  readonly description: string | null;
  readonly channel: string;
  readonly subject: string | null;
};

export type MessageTemplateCreateInput = {
  readonly title: string;
  readonly body: string;
  readonly description?: string | null;
  readonly channel?: string;
  readonly subject?: string | null;
};

export type MessageTemplateUpdateInput = {
  readonly title?: string;
  readonly body?: string;
  readonly description?: string | null;
  readonly channel?: string;
  readonly subject?: string | null;
};
