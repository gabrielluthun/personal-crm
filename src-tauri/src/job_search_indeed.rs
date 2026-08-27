use crate::bright_data::OrganicResult;
use crate::job_search_map::{short_hash, slugify_company, JobHit};

/// Maps Google SERP rows that point at Indeed job pages.
pub fn map_indeed_hit(
  row: &OrganicResult,
  fallback_location: &str,
  wanted_contract: Option<&str>,
) -> Option<JobHit> {
  if !is_indeed_job_url(&row.link) {
    return None;
  }

  let (title, company_name, contract) = parse_indeed_title(&row.title);
  if company_name.is_empty() {
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

  Some(JobHit {
    id: format!("indeed_{slug}_{}", short_hash(&row.link)),
    title,
    company_name,
    company_slug: slug,
    location: fallback_location.to_string(),
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

fn is_indeed_job_url(url: &str) -> bool {
  let lower = url.to_lowercase();
  let host_ok = lower.contains("indeed.fr")
    || lower.contains("indeed.com")
    || lower.contains("fr.indeed.com");
  if !host_ok {
    return false;
  }
  lower.contains("/viewjob")
    || lower.contains("jk=")
    || lower.contains("/rc/clk")
    || lower.contains("/pagead/clk")
}

fn parse_indeed_title(raw: &str) -> (String, String, String) {
  let mut cleaned = raw.trim().to_string();
  for suffix in [
    " | Indeed",
    " - Indeed.com",
    " – Indeed.com",
    " - Indeed",
    " – Indeed",
  ] {
    if let Some(stripped) = cleaned.strip_suffix(suffix) {
      cleaned = stripped.trim().to_string();
      break;
    }
  }

  let contract = detect_contract(&cleaned);
  let parts: Vec<&str> = cleaned
    .split(" - ")
    .map(str::trim)
    .filter(|part| !part.is_empty())
    .collect();

  if parts.len() >= 2 {
    let company = parts[parts.len() - 1].to_string();
    let title = parts[..parts.len() - 1].join(" - ");
    return (title, company, contract);
  }

  if let Some((title, company)) = cleaned.split_once(" chez ") {
    return (
      title.trim().to_string(),
      company.trim().to_string(),
      contract,
    );
  }

  (cleaned, String::new(), contract)
}

fn detect_contract(text: &str) -> String {
  let lower = text.to_lowercase();
  for label in ["CDI", "CDD", "Stage", "Alternance", "Freelance"] {
    if lower.contains(&label.to_lowercase()) {
      return label.to_string();
    }
  }
  String::new()
}
