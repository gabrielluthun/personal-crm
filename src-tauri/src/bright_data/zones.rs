use serde::Deserialize;

use crate::error::AppError;

use super::client::http_client;

const ACTIVE_ZONES_URL: &str = "https://api.brightdata.com/zone/get_active_zones";

#[derive(Debug, Deserialize)]
pub struct ZoneInfo {
  pub name: String,
  #[serde(default)]
  pub r#type: Option<String>,
}

pub async fn list_active_zones(
  client: &reqwest::Client,
  token: &str,
) -> Result<Vec<ZoneInfo>, AppError> {
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

  response
    .json()
    .await
    .map_err(|error| AppError::BrightDataNetwork(error.to_string()))
}

/// Picks the first active zone with type `serp`.
pub async fn resolve_serp_zone(token: &str) -> Result<String, AppError> {
  let zones = list_active_zones(&http_client()?, token).await?;
  zones
    .into_iter()
    .find(|zone| {
      zone
        .r#type
        .as_deref()
        .is_some_and(|kind| kind.eq_ignore_ascii_case("serp"))
    })
    .map(|zone| zone.name)
    .ok_or(AppError::MissingSerpZone)
}
