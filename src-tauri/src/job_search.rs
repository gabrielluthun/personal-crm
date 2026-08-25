use std::collections::{HashMap, HashSet};

use tokio::task::JoinSet;

use crate::bright_data::{read_api_token, resolve_serp_zone, search_google};
use crate::error::AppError;
use crate::job_search_map::{map_job_hit, pick_linkedin_url, pick_website_url};
use crate::models::{JobOfferDto, JobSearchQueryDto};

const MAX_COMPANIES: usize = 10;

/**
 * Dashboard job search — Bright Data SERP pipeline (steps 1–4):
 * 1. Google SERP for Welcome to the Jungle job URLs
 * 2. Keep offers for the first 10 unique companies
 * 3–4. Enrich website + LinkedIn company page via SERP (best-effort, parallel)
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

  let organic = search_google(&token, &zone, &job_query).await?;
  let hits: Vec<_> = organic
    .into_iter()
    .filter_map(|row| map_job_hit(&row, location.unwrap_or(""), query.contract_type.as_deref()))
    .collect();

  let mut allowed_slugs = HashSet::new();
  let mut ordered_slugs: Vec<String> = Vec::new();
  let mut selected = Vec::new();

  for hit in hits {
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
      )
      .await
      .ok()
      .and_then(|rows| pick_linkedin_url(&rows));

      let website = search_google(
        &token,
        &zone,
        &format!("\"{company_name}\" site officiel -linkedin.com -welcometothejungle.com -losc.fr"),
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
