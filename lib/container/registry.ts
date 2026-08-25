import { MockContactRepository } from "@/lib/repositories/mock/contact.mock-repository";
import { MockEntrepriseRepository } from "@/lib/repositories/mock/entreprise.mock-repository";
import { MockJobSearchRepository } from "@/lib/repositories/mock/job-search.mock-repository";
import { MockSettingsRepository } from "@/lib/repositories/mock/settings.mock-repository";
import { MockTemplateRepository } from "@/lib/repositories/mock/template.mock-repository";
import type { ContactPort } from "@/lib/repositories/ports/contact.port";
import type { EntreprisePort } from "@/lib/repositories/ports/entreprise.port";
import type { JobSearchPort } from "@/lib/repositories/ports/job-search.port";
import type { SettingsPort } from "@/lib/repositories/ports/settings.port";
import type { TemplatePort } from "@/lib/repositories/ports/template.port";
import { SupabaseContactRepository } from "@/lib/repositories/supabase/contact.supabase-repository";
import { SupabaseEntrepriseRepository } from "@/lib/repositories/supabase/entreprise.supabase-repository";
import { TauriSettingsRepository } from "@/lib/repositories/tauri/settings.tauri-repository";
import { isTauri } from "@/lib/tauri/is-tauri";

/** Persistence backends for CRM entities. Job search stays mock until Tauri. */
export type DataSource = "mock" | "supabase";

export type AppRepositories = {
  readonly entreprises: EntreprisePort;
  readonly contacts: ContactPort;
  readonly jobSearch: JobSearchPort;
  readonly templates: TemplatePort;
  readonly settings: SettingsPort;
};

const DEFAULT_DATA_SOURCE: DataSource = "mock";

/**
 * Explicit opt-in only. Having Supabase env vars set must not switch adapters —
 * tables may be missing. Set NEXT_PUBLIC_DATA_SOURCE=supabase when ready.
 */
export function resolveDataSource(): DataSource {
  const raw = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim().toLowerCase();
  if (raw === "supabase") {
    return "supabase";
  }
  return DEFAULT_DATA_SOURCE;
}

function createSettingsRepository(): SettingsPort {
  if (isTauri()) {
    return new TauriSettingsRepository();
  }
  return new MockSettingsRepository();
}

export function createRepositories(
  source: DataSource = resolveDataSource(),
): AppRepositories {
  const settings = createSettingsRepository();

  if (source === "supabase") {
    return {
      entreprises: new SupabaseEntrepriseRepository(),
      contacts: new SupabaseContactRepository(),
      jobSearch: new MockJobSearchRepository(),
      templates: new MockTemplateRepository(),
      settings,
    };
  }

  return {
    entreprises: new MockEntrepriseRepository(),
    contacts: new MockContactRepository(),
    jobSearch: new MockJobSearchRepository(),
    templates: new MockTemplateRepository(),
    settings,
  };
}
