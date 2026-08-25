import type { MessageTemplate } from "@/lib/domain/template";
import { createId } from "@/lib/domain/shared/id";
import { toIsoDateTime } from "@/lib/domain/shared/timestamps";

const ts = (iso: string) => ({
  createdAt: toIsoDateTime(new Date(iso)),
  updatedAt: toIsoDateTime(new Date(iso)),
});

const defaults = {
  channel: "linkedin",
  subject: null,
} as const;

export const MOCK_TEMPLATES: readonly MessageTemplate[] = [
  {
    id: createId("c0000000-0000-4000-8000-000000000001"),
    title: "Icebreaker LinkedIn — offre vue",
    description: "Premier message après une offre WTTJ.",
    ...defaults,
    subject: "{{first_name}}, une immersion avec votre équipe",
    body: `Bonjour {{first_name}},

J'ai vu le poste {{role}} chez {{company_name}} et votre parcours m'a interpellé.

Seriez-vous ouvert·e à un échange de 15 minutes cette semaine ?

Cordialement`,
    ...ts("2026-01-10T10:00:00.000Z"),
  },
  {
    id: createId("c0000000-0000-4000-8000-000000000002"),
    title: "Icebreaker — intérêt produit",
    description: "Approche sans offre précise.",
    ...defaults,
    body: `Bonjour {{first_name}},

Je suis impressionné par ce que construit {{company_name}}. J'aimerais échanger sur vos enjeux produit / tech.

Seriez-vous disponible pour un café virtuel ?

Merci,`,
    ...ts("2026-01-12T11:00:00.000Z"),
  },
  {
    id: createId("c0000000-0000-4000-8000-000000000003"),
    title: "Relance douce",
    description: "Relance 1 après silence.",
    ...defaults,
    body: `Bonjour {{first_name}},

Je me permets de revenir vers vous concernant {{company_name}}.

Toujours intéressé·e par un échange court autour de {{role}}.

Bonne journée,`,
    ...ts("2026-01-15T09:00:00.000Z"),
  },
  {
    id: createId("c0000000-0000-4000-8000-000000000004"),
    title: "Relance avec valeur",
    description: "Relance 2 avec un angle concret.",
    ...defaults,
    body: `Bonjour {{first_name}},

En préparant mon approche sur {{company_name}}, j'ai noté quelques pistes liées à {{role}}.

Si utile, je peux vous les partager en 10 minutes.

À bientôt,`,
    ...ts("2026-01-18T14:00:00.000Z"),
  },
  {
    id: createId("c0000000-0000-4000-8000-000000000005"),
    title: "Demande d'intro",
    description: "Demande de mise en relation.",
    ...defaults,
    body: `Bonjour {{first_name}},

Je cible {{company_name}} pour un rôle {{role}}.

Profil : {{linkedin}}

Connaissez-vous quelqu'un de l'équipe que je pourrais contacter ?

Merci beaucoup,`,
    ...ts("2026-01-20T16:00:00.000Z"),
  },
  {
    id: createId("c0000000-0000-4000-8000-000000000006"),
    title: "Confirmation call",
    description: "Message avant un call prévu.",
    channel: "email",
    subject: "Échange {{company_name}}",
    body: `Bonjour {{first_name}} {{last_name}},

Confirmant notre échange au sujet de {{role}} chez {{company_name}} (statut {{status}}).

À tout bientôt,`,
    ...ts("2026-01-22T08:30:00.000Z"),
  },
];
