use crate::bright_data::OrganicResult;
use crate::job_search_names::{company_name_from_slug, is_probable_city};
use crate::models::JobOfferDto;

const WTTJ_COMPANY_MARKER: &str = "/companies/";
const WTTJ_JOBS_MARKER: &str = "/jobs/";

#[derive(Debug, Clone)]
pub struct JobHit {
  pub id: String,
  pub title: String,
  pub company_name: String,
  pub company_slug: String,
  pub location: String,
  pub contract_type: String,
  pub wttj_url: String,
  pub description_snippet: Option<String>,
}

impl JobHit {
  pub fn into_dto(
    self,
    company_website_url: Option<String>,
    company_linkedin_url: Option<String>,
  ) -> JobOfferDto {
    JobOfferDto {
      id: self.id,
      title: self.title,
      company_name: self.company_name,
      location: self.location,
      contract_type: self.contract_type,
      wttj_url: self.wttj_url,
      company_website_url,
      company_linkedin_url,
      published_at: None,
      description_snippet: self.description_snippet,
    }
  }
}

pub fn map_job_hit(
  row: &OrganicResult,
  fallback_location: &str,
  wanted_contract: Option<&str>,
) -> Option<JobHit> {
  if !row.link.contains("welcometothejungle.com") || !row.link.contains(WTTJ_JOBS_MARKER) {
    return None;
  }

  let slug = company_slug_from_wttj(&row.link)?;
  let (title, location, contract) = parse_wttj_title(&row.title);
  // URL slug is the only reliable company identity.
  let company_name = company_name_from_slug(&slug);

  if let Some(wanted) = wanted_contract {
    if !wanted.is_empty() && contract != wanted {
      return None;
    }
  }

  Some(JobHit {
    id: format!("wttj_{slug}_{}", short_hash(&row.link)),
    title,
    company_name,
    company_slug: slug,
    location: if location.is_empty() {
      fallback_location.to_string()
    } else {
      location
    },
    contract_type: if contract.is_empty() {
      "Autre".into()
    } else {
      contract
    },
    wttj_url: row.link.clone(),
    description_snippet: row.description.clone(),
  })
}

pub fn company_slug_from_wttj(url: &str) -> Option<String> {
  let start = url.find(WTTJ_COMPANY_MARKER)? + WTTJ_COMPANY_MARKER.len();
  let rest = &url[start..];
  let end = rest.find('/').unwrap_or(rest.len());
  let slug = rest[..end].trim();
  if slug.is_empty() {
    None
  } else {
    Some(slug.to_string())
  }
}

pub fn pick_linkedin_url(rows: &[OrganicResult]) -> Option<String> {
  rows.iter().find_map(|row| {
    let link = row.link.as_str();
    if link.contains("linkedin.com/company/") {
      Some(normalize_linkedin_company(link))
    } else {
      None
    }
  })
}

pub fn pick_website_url(rows: &[OrganicResult]) -> Option<String> {
  rows.iter().find_map(|row| {
    let link = row.link.to_lowercase();
    if link.contains("linkedin.com")
      || link.contains("welcometothejungle.com")
      || link.contains("facebook.com")
      || link.contains("twitter.com")
      || link.contains("x.com")
      || link.contains("losc.fr")
    {
      return None;
    }
    Some(row.link.clone())
  })
}

fn normalize_linkedin_company(url: &str) -> String {
  if let Some(idx) = url.find("linkedin.com/company/") {
    let rest = &url[idx + "linkedin.com/company/".len()..];
    let slug = rest.split(['/', '?', '#']).next().unwrap_or(rest);
    let host = if url.contains("fr.linkedin.com") {
      "https://fr.linkedin.com/company/"
    } else {
      "https://www.linkedin.com/company/"
    };
    format!("{host}{slug}")
  } else {
    url.to_string()
  }
}

/// Job title / location / contract only — never company (see URL slug).
fn parse_wttj_title(raw: &str) -> (String, String, String) {
  let parts: Vec<&str> = raw
    .split(" - ")
    .map(str::trim)
    .filter(|part| !part.is_empty())
    .collect();
  if parts.is_empty() {
    return (raw.to_string(), String::new(), String::new());
  }

  let title = parts[0].to_string();
  let mut location = String::new();
  let mut contract = String::new();

  for part in parts.iter().skip(1) {
    let lower = part.to_lowercase();
    if contract.is_empty() {
      for label in ["CDI", "CDD", "Stage", "Alternance", "Freelance"] {
        if lower.contains(&label.to_lowercase()) {
          contract = label.to_string();
          break;
        }
      }
    }
    if let Some(idx) = lower.find(" à ") {
      location = part[idx + " à ".len()..].trim().to_string();
    } else if location.is_empty() && is_probable_city(part) {
      location = (*part).to_string();
    }
  }

  (title, location, contract)
}

fn short_hash(input: &str) -> String {
  let mut hash: u32 = 2166136261;
  for byte in input.as_bytes() {
    hash ^= u32::from(*byte);
    hash = hash.wrapping_mul(16777619);
  }
  format!("{hash:x}")
}
