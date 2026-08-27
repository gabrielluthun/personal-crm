use crate::job_search_names::is_probable_city;

/// Indeed FR SERP titles are almost always `Job title - Location`.
/// Company is **not** in the title (Bright Data SERP samples, Aug 2026).
pub fn parse_indeed_title(raw: &str) -> (String, String, String) {
  let cleaned = strip_noise_suffix(raw.trim());
  let contract = detect_contract(&cleaned);

  let parts: Vec<&str> = cleaned
    .split(" - ")
    .map(str::trim)
    .filter(|part| !part.is_empty())
    .collect();

  if parts.is_empty() {
    return (raw.to_string(), String::new(), contract);
  }
  if parts.len() == 1 {
    return (parts[0].to_string(), String::new(), contract);
  }

  let mut location = String::new();
  let mut end = parts.len();
  while end > 1 && is_location_label(parts[end - 1]) {
    if location.is_empty() {
      location = parts[end - 1].to_string();
    }
    end -= 1;
  }

  (parts[..end].join(" - "), location, contract)
}

pub fn is_location_label(part: &str) -> bool {
  let trimmed = part.trim();
  if trimmed.is_empty() {
    return false;
  }
  if is_probable_city(trimmed) {
    return true;
  }
  let lower = trimmed.to_lowercase();
  if matches!(
    lower.as_str(),
    "france"
      | "remote"
      | "hybride"
      | "hybrid"
      | "télétravail"
      | "teletravail"
      | "full remote"
      | "hauts-de-france"
      | "île-de-france"
      | "ile-de-france"
  ) {
    return true;
  }
  if looks_like_postal_city(trimmed) {
    return true;
  }
  lower.contains('(') && lower.chars().any(|c| c.is_ascii_digit())
}

fn looks_like_postal_city(part: &str) -> bool {
  let digits = part.chars().take_while(|c| c.is_ascii_digit()).count();
  if digits != 5 {
    return false;
  }
  let rest = part[5..].trim_start();
  rest.chars().next().is_some_and(|c| c.is_alphabetic())
}

fn strip_noise_suffix(raw: &str) -> String {
  let mut cleaned = raw.to_string();
  for suffix in [
    " | Indeed",
    " | Space",
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
  if let Some(stripped) = cleaned.strip_suffix("...") {
    cleaned = stripped.trim().to_string();
  }
  cleaned
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

#[cfg(test)]
mod tests {
  use super::parse_indeed_title;

  #[test]
  fn title_is_job_and_postal_city() {
    let (title, location, _) =
      parse_indeed_title("Développeur Python (F/H) - 59800 Lille");
    assert_eq!(title, "Développeur Python (F/H)");
    assert_eq!(location, "59800 Lille");
  }

  #[test]
  fn title_city_dept() {
    let (title, location, _) = parse_indeed_title("Data Engineer (F/H) - Lille (59)");
    assert_eq!(title, "Data Engineer (F/H)");
    assert_eq!(location, "Lille (59)");
  }
}
