import type { MessageTemplate } from "@/lib/domain/template";
import { createId } from "@/lib/domain/shared/id";
import { toIsoDateTime } from "@/lib/domain/shared/timestamps";

const ts = (iso: string) => ({
  createdAt: toIsoDateTime(new Date(iso)),
  updatedAt: toIsoDateTime(new Date(iso)),
});

export const MOCK_TEMPLATES: readonly MessageTemplate[] = [
  {
    id: createId("tpl_01"),
    title: "Icebreaker LinkedIn — offre vue",
    description: "Premier message après une offre WTTJ.",
    body: `Bonjour {{nom_contact}},

J'ai vu le poste {{poste}} chez {{nom_entreprise}} ({{ville}}) et votre parcours m'a interpellé.

Seriez-vous ouvert·e à un échange de 15 minutes cette semaine ?

Cordialement`,
    ...ts("2026-01-10T10:00:00.000Z"),
  },
  {
    id: createId("tpl_02"),
    title: "Icebreaker — intérêt produit",
    description: "Approche sans offre précise.",
    body: `Bonjour {{nom_contact}},

Je suis impressionné par ce que construit {{nom_entreprise}}. J'aimerais échanger sur vos enjeux produit / tech.

Seriez-vous disponible pour un café virtuel ?

Merci,`,
    ...ts("2026-01-12T11:00:00.000Z"),
  },
  {
    id: createId("tpl_03"),
    title: "Relance douce",
    description: "Relance 1 après silence.",
    body: `Bonjour {{nom_contact}},

Je me permets de revenir vers vous concernant {{nom_entreprise}}.

Toujours intéressé·e par un échange court autour de {{poste}}.

Bonne journée,`,
    ...ts("2026-01-15T09:00:00.000Z"),
  },
  {
    id: createId("tpl_04"),
    title: "Relance avec valeur",
    description: "Relance 2 avec un angle concret.",
    body: `Bonjour {{nom_contact}},

En préparant mon approche sur {{nom_entreprise}}, j'ai noté quelques pistes liées à {{poste}}.

Si utile, je peux vous les partager en 10 minutes.

À bientôt,`,
    ...ts("2026-01-18T14:00:00.000Z"),
  },
  {
    id: createId("tpl_05"),
    title: "Demande d'intro",
    description: "Demande de mise en relation.",
    body: `Bonjour {{nom_contact}},

Je cible {{nom_entreprise}} pour un rôle {{poste}} à {{ville}}.

Connaissez-vous quelqu'un de l'équipe que je pourrais contacter ?

Merci beaucoup,`,
    ...ts("2026-01-20T16:00:00.000Z"),
  },
  {
    id: createId("tpl_06"),
    title: "Confirmation call",
    description: "Message avant un call prévu.",
    body: `Bonjour {{nom_contact}},

Confirmant notre échange au sujet de {{poste}} chez {{nom_entreprise}}.

J'ai hâte d'en discuter.

À tout bientôt,`,
    ...ts("2026-01-22T08:30:00.000Z"),
  },
];
