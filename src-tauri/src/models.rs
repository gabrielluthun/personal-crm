use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JobSearchQueryDto {
  pub keywords: String,
  pub location: Option<String>,
  pub contract_type: Option<String>,
  /// 1-based Google SERP page (each page uses `start = (page - 1) * 20`).
  #[serde(default = "default_page")]
  pub page: u32,
  /// WTTJ company slugs already shown this session (or already in the CRM).
  #[serde(default)]
  pub exclude_slugs: Vec<String>,
  /// Normalized company names already in the CRM (fallback without WTTJ URL).
  #[serde(default)]
  pub exclude_names: Vec<String>,
}

fn default_page() -> u32 {
  1
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JobOfferDto {
  pub id: String,
  pub title: String,
  pub company_name: String,
  pub company_slug: String,
  pub location: String,
  pub contract_type: String,
  pub wttj_url: String,
  pub company_website_url: Option<String>,
  pub company_linkedin_url: Option<String>,
  pub published_at: Option<String>,
  pub description_snippet: Option<String>,
}
