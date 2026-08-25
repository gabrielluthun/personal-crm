use std::time::Duration;

use serde::Serialize;

use crate::error::AppError;
use crate::secrets::read_secret_internal;

const BRIGHT_DATA_TOKEN_KEY: &str = "bright_data_token";
const ACTIVE_ZONES_URL: &str = "https://api.brightdata.com/zone/get_active_zones";
const REQUEST_TIMEOUT: Duration = Duration::from_secs(12);

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BrightDataProbeDto {
  pub ok: bool,
  pub zone_count: Option<u32>,
}

/**
 * Lightweight Bright Data credential check.
 *
 * Reads the token from the OS keychain and calls a management endpoint.
 * Never returns the token or raw API payloads to the frontend.
 */
#[tauri::command]
pub async fn test_bright_data_connection() -> Result<BrightDataProbeDto, AppError> {
  let token = read_secret_internal(BRIGHT_DATA_TOKEN_KEY)?;
  let Some(token) = token else {
    return Err(AppError::MissingBrightDataToken);
  };

  let client = reqwest::Client::builder()
    .timeout(REQUEST_TIMEOUT)
    .build()
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))?;

  let response = client
    .get(ACTIVE_ZONES_URL)
    .bearer_auth(token)
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

  let body: serde_json::Value = response
    .json()
    .await
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))?;

  let zone_count = body.as_array().map(|zones| zones.len() as u32);

  Ok(BrightDataProbeDto {
    ok: true,
    zone_count,
  })
}
