use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JobSearchQueryDto {
  pub keywords: String,
  pub location: Option<String>,
  pub contract_type: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JobOfferDto {
  pub id: String,
  pub title: String,
  pub company_name: String,
  pub location: String,
  pub contract_type: String,
  pub wttj_url: String,
  pub company_website_url: Option<String>,
  pub company_linkedin_url: Option<String>,
  pub published_at: Option<String>,
  pub description_snippet: Option<String>,
}
