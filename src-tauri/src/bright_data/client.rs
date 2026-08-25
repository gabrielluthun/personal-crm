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
  country: &'a str,
}

/// POST https://api.brightdata.com/request (SERP / Unlocker).
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
      format: "json",
      // Matches Bright Data "JSON léger" zone default (organic results).
      data_format: "parsed_light",
      country: "fr",
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

  response
    .json()
    .await
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))
}
