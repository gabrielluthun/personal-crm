use std::time::Duration;

use serde::Serialize;

use crate::error::AppError;
use crate::secrets::read_secret_internal;

const BRIGHT_DATA_TOKEN_KEY: &str = "bright_data_token";
const REQUEST_URL: &str = "https://api.brightdata.com/request";
const REQUEST_TIMEOUT: Duration = Duration::from_secs(45);

pub fn read_api_token() -> Result<String, AppError> {
  let token = read_secret_internal(BRIGHT_DATA_TOKEN_KEY)?;
  token.ok_or(AppError::MissingBrightDataToken)
}

pub fn http_client() -> Result<reqwest::Client, AppError> {
  reqwest::Client::builder()
    .timeout(REQUEST_TIMEOUT)
    .build()
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))
}

#[derive(Debug, Serialize)]
struct RequestBody<'a> {
  zone: &'a str,
  url: &'a str,
  format: &'a str,
  data_format: &'a str,
}

/// POST https://api.brightdata.com/request.
///
/// `format: raw` + `data_format: parsed_light` returns the light SERP JSON
/// (`organic` at the top level). `format: json` wraps the same payload in an
/// empty `body` string; `format: raw` alone returns HTML.
pub async fn post_request(
  client: &reqwest::Client,
  token: &str,
  zone: &str,
  target_url: &str,
) -> Result<serde_json::Value, AppError> {
  let response = client
    .post(REQUEST_URL)
    .bearer_auth(token)
    .json(&RequestBody {
      zone,
      url: target_url,
      format: "raw",
      data_format: "parsed_light",
    })
    .send()
    .await
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))?;

  let status = response.status();
  if status.as_u16() == 401 || status.as_u16() == 403 {
    return Err(AppError::BrightDataUnauthorized);
  }
  if !status.is_success() {
    return Err(AppError::BrightDataHttp(status.as_u16()));
  }

  let text = response
    .text()
    .await
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))?;
  parse_json_body(&text)
}

fn parse_json_body(text: &str) -> Result<serde_json::Value, AppError> {
  let trimmed = text.trim();
  if trimmed.is_empty() {
    return Err(AppError::BrightDataParse(
      "réponse SERP vide".into(),
    ));
  }
  if trimmed.starts_with('<') {
    return Err(AppError::BrightDataParse(
      "HTML reçu au lieu de JSON — vérifiez que la zone est SERP (JSON léger)".into(),
    ));
  }
  serde_json::from_str(trimmed).map_err(|error| {
    AppError::BrightDataParse(format!("JSON illisible: {error}"))
  })
}
