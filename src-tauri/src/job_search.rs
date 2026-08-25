use crate::error::AppError;
use crate::models::{JobOfferDto, JobSearchQueryDto};
use crate::secrets::read_secret_internal;

const BRIGHT_DATA_TOKEN_KEY: &str = "bright_data_token";

/**
 * Searches job offers for the dashboard.
 *
 * MVP behaviour:
 * 1. Read the Bright Data token from the OS keychain **inside Rust**.
 * 2. Return filtered fixture rows (no HTTP yet).
 *
 * Extension point: replace `fixture_offers()` filtering with an HTTP call to
 * Bright Data / MCP using `token`. Never send `token` back to the frontend.
 */
#[tauri::command]
pub fn search_jobs(query: JobSearchQueryDto) -> Result<Vec<JobOfferDto>, AppError> {
  let token = read_secret_internal(BRIGHT_DATA_TOKEN_KEY)?;
  let Some(_token) = token else {
    return Err(AppError::MissingBrightDataToken);
  };

  // `_token` is intentionally unused in the MVP — kept in scope to document
  // that the real HTTP client must consume it here, never over IPC.
  let keywords = query.keywords.trim().to_lowercase();
  let location = query
    .location
    .as_ref()
    .map(|value| value.trim().to_lowercase())
    .filter(|value| !value.is_empty());
  let contract = query
    .contract_type
    .as_ref()
    .map(|value| value.trim().to_string())
    .filter(|value| !value.is_empty());

  let offers = fixture_offers()
    .into_iter()
    .filter(|offer| {
      let matches_keywords = keywords.is_empty()
        || offer.title.to_lowercase().contains(&keywords)
        || offer.company_name.to_lowercase().contains(&keywords)
        || offer
          .description_snippet
          .as_ref()
          .map(|snippet| snippet.to_lowercase().contains(&keywords))
          .unwrap_or(false);

      let matches_location = location
        .as_ref()
        .map(|loc| offer.location.to_lowercase().contains(loc))
        .unwrap_or(true);

      let matches_contract = contract
        .as_ref()
        .map(|wanted| offer.contract_type == *wanted)
        .unwrap_or(true);

      matches_keywords && matches_location && matches_contract
    })
    .collect();

  Ok(offers)
}

fn fixture_offers() -> Vec<JobOfferDto> {
  vec![
    offer(
      "job_tauri_01",
      "Développeur Full-Stack TypeScript",
      "Alan",
      "Paris / Remote",
      "CDI",
      "https://www.welcometothejungle.com/fr/companies/alan/jobs/fullstack-ts",
      Some("https://alan.com"),
      Some("https://www.linkedin.com/company/alan-eu/"),
      Some("Produit santé — React, Node, PostgreSQL."),
    ),
    offer(
      "job_tauri_02",
      "Software Engineer Backend",
      "Qonto",
      "Paris",
      "CDI",
      "https://www.welcometothejungle.com/fr/companies/qonto/jobs/backend",
      Some("https://qonto.com"),
      Some("https://www.linkedin.com/company/qonto/"),
      Some("Go / Kotlin — plateforme néobanque B2B."),
    ),
    offer(
      "job_tauri_03",
      "Frontend Engineer React",
      "Doctolib",
      "Paris / Hybrid",
      "CDI",
      "https://www.welcometothejungle.com/fr/companies/doctolib/jobs/frontend",
      Some("https://doctolib.fr"),
      Some("https://www.linkedin.com/company/doctolib/"),
      Some("Design system, TypeScript, accessibilité."),
    ),
    offer(
      "job_tauri_04",
      "Data Engineer",
      "BlaBlaCar",
      "Paris",
      "CDI",
      "https://www.welcometothejungle.com/fr/companies/blablacar/jobs/data",
      Some("https://blablacar.com"),
      Some("https://www.linkedin.com/company/blablacar/"),
      Some("Spark, Airflow, pipelines analytics."),
    ),
  ]
}

#[allow(clippy::too_many_arguments)]
fn offer(
  id: &str,
  title: &str,
  company_name: &str,
  location: &str,
  contract_type: &str,
  wttj_url: &str,
  company_website_url: Option<&str>,
  company_linkedin_url: Option<&str>,
  description_snippet: Option<&str>,
) -> JobOfferDto {
  JobOfferDto {
    id: id.to_string(),
    title: title.to_string(),
    company_name: company_name.to_string(),
    location: location.to_string(),
    contract_type: contract_type.to_string(),
    wttj_url: wttj_url.to_string(),
    company_website_url: company_website_url.map(str::to_string),
    company_linkedin_url: company_linkedin_url.map(str::to_string),
    published_at: None,
    description_snippet: description_snippet.map(str::to_string),
  }
}
