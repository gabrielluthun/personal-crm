import type { Entreprise } from "@/lib/domain/entreprise";
import { createId } from "@/lib/domain/shared/id";
import { toIsoDateTime } from "@/lib/domain/shared/timestamps";

const ts = (iso: string) => ({
  createdAt: toIsoDateTime(new Date(iso)),
  updatedAt: toIsoDateTime(new Date(iso)),
});

export const MOCK_ENTREPRISE_IDS = {
  alan: createId<"Entreprise">("ent_alan"),
  blaze: createId<"Entreprise">("ent_blaze"),
  dataiku: createId<"Entreprise">("ent_dataiku"),
  doctolib: createId<"Entreprise">("ent_doctolib"),
  ledger: createId<"Entreprise">("ent_ledger"),
  mirakl: createId<"Entreprise">("ent_mirakl"),
  qonto: createId<"Entreprise">("ent_qonto"),
  shift: createId<"Entreprise">("ent_shift"),
  swoopin: createId<"Entreprise">("ent_swoopin"),
  vestiaire: createId<"Entreprise">("ent_vestiaire"),
} as const;

export const MOCK_ENTREPRISES: readonly Entreprise[] = [
  {
    id: MOCK_ENTREPRISE_IDS.alan,
    name: "Alan",
    linkedinUrl: "https://www.linkedin.com/company/alan-eu/",
    websiteUrl: "https://alan.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/alan",
    notes: "Assurance santé — cible product / eng.",
    ...ts("2026-01-12T10:00:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.blaze,
    name: "Blaze",
    linkedinUrl: "https://www.linkedin.com/company/blaze-io/",
    websiteUrl: "https://www.blaze.today",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/blaze",
    notes: null,
    ...ts("2026-01-15T09:30:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.dataiku,
    name: "Dataiku",
    linkedinUrl: "https://www.linkedin.com/company/dataiku/",
    websiteUrl: "https://www.dataiku.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/dataiku",
    notes: "Data science platform.",
    ...ts("2026-01-18T14:00:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.doctolib,
    name: "Doctolib",
    linkedinUrl: "https://www.linkedin.com/company/doctolib/",
    websiteUrl: "https://www.doctolib.fr",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/doctolib",
    notes: null,
    ...ts("2026-01-20T11:15:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.ledger,
    name: "Ledger",
    linkedinUrl: "https://www.linkedin.com/company/ledgerhq/",
    websiteUrl: "https://www.ledger.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/ledger",
    notes: "Hardware wallet — security / firmware.",
    ...ts("2026-01-22T16:45:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.mirakl,
    name: "Mirakl",
    linkedinUrl: "https://www.linkedin.com/company/mirakl/",
    websiteUrl: "https://www.mirakl.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/mirakl",
    notes: null,
    ...ts("2026-01-25T08:00:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.qonto,
    name: "Qonto",
    linkedinUrl: "https://www.linkedin.com/company/qonto/",
    websiteUrl: "https://qonto.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/qonto",
    notes: "Néobanque B2B.",
    ...ts("2026-02-01T10:20:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.shift,
    name: "Shift Technology",
    linkedinUrl: "https://www.linkedin.com/company/shift-technology/",
    websiteUrl: "https://www.shift-technology.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/shift-technology",
    notes: null,
    ...ts("2026-02-03T13:00:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.swoopin,
    name: "Swile",
    linkedinUrl: "https://www.linkedin.com/company/swile/",
    websiteUrl: "https://www.swile.co",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/swile",
    notes: "Avantages salariés.",
    ...ts("2026-02-05T09:00:00.000Z"),
  },
  {
    id: MOCK_ENTREPRISE_IDS.vestiaire,
    name: "Vestiaire Collective",
    linkedinUrl: "https://www.linkedin.com/company/vestiaire-collective/",
    websiteUrl: "https://www.vestiairecollective.com",
    wttjUrl: "https://www.welcometothejungle.com/fr/companies/vestiaire-collective",
    notes: null,
    ...ts("2026-02-08T15:30:00.000Z"),
  },
];
