//! Bright Data HTTP bridge (token stays in the OS keychain).

mod client;
mod serp;
mod zones;

pub use client::read_api_token;
pub use serp::{search_google, OrganicResult};
pub use zones::resolve_serp_zone;

use serde::Serialize;

use crate::error::AppError;

use self::client::http_client;
use self::zones::list_active_zones;

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
  let token = read_api_token()?;
  let zones = list_active_zones(&http_client()?, &token).await?;
  Ok(BrightDataProbeDto {
    ok: true,
    zone_count: Some(zones.len() as u32),
  })
}
