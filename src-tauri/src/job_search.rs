use std::collections::{HashMap, HashSet};

use tokio::task::JoinSet;

use crate::bright_data::{read_api_token, resolve_serp_zone, search_google};
use crate::error::AppError;
use crate::job_search_map::{map_job_hit, pick_linkedin_url, pick_website_url};
use crate::models::{JobOfferDto, JobSearchQueryDto};

const MAX_COMPANIES: usize = 10;
const SERP_PAGE_SIZE: u32 = 20;

/**
 * Dashboard job search — Bright Data SERP pipeline:
 * 1. Google SERP for Welcome to the Jungle job URLs (`page` → `start=`)
 * 2. Skip excluded slugs/names; keep up to 10 new unique companies
 * 3–4. Enrich website + LinkedIn via SERP (best-effort, parallel)
 *
 * Token never leaves Rust / the OS keychain.
 */
#[tauri::command]
pub async fn search_jobs(query: JobSearchQueryDto) -> Result<Vec<JobOfferDto>, AppError> {
  let token = read_api_token()?;
  let zone = resolve_serp_zone(&token).await?;

  let keywords = query.keywords.trim();
  if keywords.is_empty() {
    return Ok(Vec::new());
  }

  let location = query
    .location
    .as_ref()
    .map(|value| value.trim())
    .filter(|value| !value.is_empty());

  let mut job_query = format!("{keywords} site:welcometothejungle.com/fr/companies");
  if let Some(city) = location {
    job_query.push(' ');
    job_query.push_str(city);
  }

  let page = query.page.max(1);
  let start = (page - 1).saturating_mul(SERP_PAGE_SIZE);
  let excluded_slugs: HashSet<String> = query
    .exclude_slugs
    .into_iter()
    .map(|slug| slug.trim().to_lowercase())
    .filter(|slug| !slug.is_empty())
    .collect();
  let excluded_names: HashSet<String> = query
    .exclude_names
    .into_iter()
    .map(|name| normalize_name(&name))
    .filter(|name| !name.is_empty())
    .collect();

  let organic = search_google(&token, &zone, &job_query, start).await?;
  let hits: Vec<_> = organic
    .into_iter()
    .filter_map(|row| map_job_hit(&row, location.unwrap_or(""), query.contract_type.as_deref()))
    .collect();

  let mut allowed_slugs = HashSet::new();
  let mut ordered_slugs: Vec<String> = Vec::new();
  let mut selected = Vec::new();

  for hit in hits {
    let slug_key = hit.company_slug.to_lowercase();
    if excluded_slugs.contains(&slug_key) {
      continue;
    }
    if excluded_names.contains(&normalize_name(&hit.company_name)) {
      continue;
    }
    if !allowed_slugs.contains(&hit.company_slug) {
      if ordered_slugs.len() >= MAX_COMPANIES {
        continue;
      }
      allowed_slugs.insert(hit.company_slug.clone());
      ordered_slugs.push(hit.company_slug.clone());
    }
    selected.push(hit);
  }

  let enrichments = enrich_companies(&token, &zone, &ordered_slugs, &selected).await;

  Ok(
    selected
      .into_iter()
      .map(|hit| {
        let (website, linkedin) = enrichments
          .get(&hit.company_slug)
          .cloned()
          .unwrap_or((None, None));
        hit.into_dto(website, linkedin)
      })
      .collect(),
  )
}

fn normalize_name(value: &str) -> String {
  value.trim().to_lowercase()
}

async fn enrich_companies(
  token: &str,
  zone: &str,
  slugs: &[String],
  selected: &[crate::job_search_map::JobHit],
) -> HashMap<String, (Option<String>, Option<String>)> {
  let mut set = JoinSet::new();

  for slug in slugs {
    let company_name = selected
      .iter()
      .find(|hit| &hit.company_slug == slug)
      .map(|hit| hit.company_name.clone())
      .unwrap_or_else(|| slug.clone());
    let token = token.to_string();
    let zone = zone.to_string();
    let slug = slug.clone();

    set.spawn(async move {
      let linkedin = search_google(
        &token,
        &zone,
        &format!("\"{company_name}\" OR {slug} site:linkedin.com/company"),
        0,
      )
      .await
      .ok()
      .and_then(|rows| pick_linkedin_url(&rows));

      let website = search_google(
        &token,
        &zone,
        &format!(
          "\"{company_name}\" site officiel -linkedin.com -welcometothejungle.com -losc.fr"
        ),
        0,
      )
      .await
      .ok()
      .and_then(|rows| pick_website_url(&rows));

      (slug, website, linkedin)
    });
  }

  let mut out = HashMap::new();
  while let Some(joined) = set.join_next().await {
    if let Ok((slug, website, linkedin)) = joined {
      out.insert(slug, (website, linkedin));
    }
  }
  out
}
