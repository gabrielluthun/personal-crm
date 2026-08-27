use crate::bright_data::OrganicResult;
use crate::job_search_indeed_company::company_from_indeed_snippet;
use crate::job_search_indeed_title::{is_location_label, parse_indeed_title};
use crate::job_search_map::{short_hash, slugify_company, JobHit};

/// Maps Google SERP rows that point at Indeed job pages.
/// Company comes from the snippet — never from a trailing title segment.
pub fn map_indeed_hit(
  row: &OrganicResult,
  fallback_location: &str,
  wanted_contract: Option<&str>,
) -> Option<JobHit> {
  if !is_indeed_viewjob_url(&row.link) {
    return None;
  }

  let (title, mut location, contract) = parse_indeed_title(&row.title);
  let company_name = row
    .description
    .as_deref()
    .and_then(company_from_indeed_snippet)
    .or_else(|| company_from_cmp_url(&row.link))?;

  if is_location_label(&company_name) {
    return None;
  }

  if let Some(wanted) = wanted_contract {
    if !wanted.is_empty() && !contract.is_empty() && contract != wanted {
      return None;
    }
  }

  let slug = slugify_company(&company_name);
  if slug.is_empty() {
    return None;
  }

  if location.is_empty() {
    location = fallback_location.to_string();
  }

  Some(JobHit {
    id: format!("indeed_{slug}_{}", short_hash(&row.link)),
    title,
    company_name,
    company_slug: slug,
    location,
    contract_type: if contract.is_empty() {
      "Autre".into()
    } else {
      contract
    },
    source: "indeed".into(),
    offer_url: row.link.clone(),
    description_snippet: row.description.clone(),
  })
}

fn is_indeed_viewjob_url(url: &str) -> bool {
  let lower = url.to_lowercase();
  let host_ok = lower.contains("indeed.fr")
    || lower.contains("indeed.com")
    || lower.contains("fr.indeed.com");
  if !host_ok {
    return false;
  }
  // Skip listing pages (`/q-…-emplois.html`).
  lower.contains("/viewjob")
    || lower.contains("jk=")
    || lower.contains("/rc/clk")
    || lower.contains("/pagead/clk")
}

fn company_from_cmp_url(url: &str) -> Option<String> {
  let marker = "/cmp/";
  let lower = url.to_lowercase();
  let start = lower.find(marker)? + marker.len();
  let rest = &url[start..];
  let end = rest.find(['/', '?', '#']).unwrap_or(rest.len());
  let raw = rest[..end].trim();
  if raw.is_empty() {
    return None;
  }
  let name = raw.replace('+', " ").replace("%20", " ").replace('-', " ");
  let trimmed = name.trim();
  if trimmed.is_empty() || is_location_label(trimmed) {
    None
  } else {
    Some(trimmed.to_string())
  }
}
