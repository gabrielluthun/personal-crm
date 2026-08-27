use serde::Deserialize;

use crate::error::AppError;

use super::client::{http_client, post_request};

#[derive(Debug, Clone)]
pub struct OrganicResult {
  pub link: String,
  pub title: String,
  pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
struct SerpPayload {
  #[serde(default)]
  organic: Vec<SerpOrganic>,
}

#[derive(Debug, Deserialize)]
struct SerpOrganic {
  link: Option<String>,
  title: Option<String>,
  description: Option<String>,
}

/// Google SERP via Bright Data (`data_format: parsed_light` → organic).
/// `start` is Google's result offset (`0`, `20`, `40`, …).
pub async fn search_google(
  token: &str,
  zone: &str,
  query: &str,
  start: u32,
) -> Result<Vec<OrganicResult>, AppError> {
  let encoded = urlencoding::encode(query);
  let mut target =
    format!("https://www.google.com/search?q={encoded}&hl=fr&gl=fr&num=20");
  if start > 0 {
    target.push_str(&format!("&start={start}"));
  }
  let body = post_request(&http_client()?, token, zone, &target).await?;
  parse_organic(body)
}

fn parse_organic(body: serde_json::Value) -> Result<Vec<OrganicResult>, AppError> {
  // `format: raw` + `data_format: parsed_light` → organic at the top level.
  // `format: json` wrappers nest the payload in `body`.
  let payload: SerpPayload = if body.get("organic").is_some() {
    serde_json::from_value(body).map_err(|error| {
      AppError::BrightDataParse(format!("SERP JSON invalide: {error}"))
    })?
  } else if let Some(inner) = body.get("body").cloned() {
    parse_nested_body(inner)?
  } else {
    return Err(AppError::BrightDataParse(
      "Réponse SERP sans résultats organic".into(),
    ));
  };

  Ok(
    payload
      .organic
      .into_iter()
      .filter_map(|row| {
        let link = row.link?.trim().to_string();
        let title = row.title?.trim().to_string();
        if link.is_empty() || title.is_empty() {
          return None;
        }
        Some(OrganicResult {
          link,
          title,
          description: row
            .description
            .map(|value| value.trim().to_string())
            .filter(|value| !value.is_empty()),
        })
      })
      .collect(),
  )
}

fn parse_nested_body(inner: serde_json::Value) -> Result<SerpPayload, AppError> {
  match inner {
    serde_json::Value::String(raw) => {
      let trimmed = raw.trim();
      if trimmed.is_empty() {
        return Err(AppError::BrightDataParse(
          "réponse SERP vide — la zone n’a pas renvoyé de JSON parsé".into(),
        ));
      }
      serde_json::from_str(trimmed).map_err(|error| {
        AppError::BrightDataParse(format!("SERP body string invalide: {error}"))
      })
    }
    serde_json::Value::Null => Err(AppError::BrightDataParse(
      "réponse SERP vide — la zone n’a pas renvoyé de JSON parsé".into(),
    )),
    other => serde_json::from_value(other).map_err(|error| {
      AppError::BrightDataParse(format!("SERP body objet invalide: {error}"))
    }),
  }
}
