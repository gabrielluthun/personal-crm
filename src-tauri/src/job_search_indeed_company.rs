use crate::job_search_indeed_title::is_location_label;

/// Company lives in the Google SERP snippet for Indeed FR, not the title.
pub fn company_from_indeed_snippet(snippet: &str) -> Option<String> {
  let text = snippet.trim();
  if text.is_empty() {
    return None;
  }

  if let Some(name) = capture_after(text, "rejoindre ") {
    return sanitize_company(name);
  }
  if let Some(name) = capture_after_chez(text) {
    return sanitize_company(name);
  }
  if let Some(name) = capture_cdi_slash(text) {
    return sanitize_company(name);
  }
  if let Some(name) = capture_company_before_street(text) {
    return sanitize_company(name);
  }

  None
}

fn capture_after<'a>(text: &'a str, needle: &str) -> Option<&'a str> {
  let lower = text.to_lowercase();
  let idx = lower.find(needle)?;
  let rest = text[idx + needle.len()..].trim_start();
  let end = rest
    .find([',', '.', '·', ';', '\n'])
    .or_else(|| rest.to_lowercase().find(" c'est"))
    .unwrap_or(rest.len().min(48));
  let name = rest[..end].trim();
  if name.is_empty() {
    None
  } else {
    Some(name)
  }
}

fn capture_after_chez(text: &str) -> Option<&str> {
  let lower = text.to_lowercase();
  let idx = lower.find(" chez ")?;
  let rest = text[idx + " chez ".len()..].trim_start();
  let lower_rest = rest.to_lowercase();
  for skip in ["notre ", "un ", "une ", "le ", "la ", "les ", "l'"] {
    if lower_rest.starts_with(skip) {
      return None;
    }
  }
  let end = rest
    .find([',', '.', '·', ';', '\n'])
    .unwrap_or(rest.len().min(48));
  let name = rest[..end].trim();
  if name.is_empty() {
    None
  } else {
    Some(name)
  }
}

fn capture_cdi_slash(text: &str) -> Option<&str> {
  let lower = text.to_lowercase();
  let idx = lower.find("cdi /")?;
  let rest = text[idx + "cdi /".len()..].trim_start();
  let end = rest
    .find(['.', ',', '·', '\n'])
    .unwrap_or(rest.len().min(48));
  let name = rest[..end].trim();
  if name.is_empty() {
    None
  } else {
    Some(name)
  }
}

fn capture_company_before_street(text: &str) -> Option<&str> {
  // "… Idoine Conseil. 36 rue Laffitte …"
  let mut search_from = 0;
  while let Some(rel) = text[search_from..].find(". ") {
    let abs = search_from + rel;
    let after = &text[abs + 2..];
    if after.chars().next().is_some_and(|c| c.is_ascii_digit()) {
      let before = &text[..abs];
      let start = before
        .rfind(['.', '\n', '·'])
        .map(|i| i + 1)
        .unwrap_or(0);
      let name = before[start..].trim();
      if !name.is_empty() && !is_location_label(name) {
        return Some(name);
      }
    }
    search_from = abs + 2;
  }
  None
}

fn sanitize_company(raw: &str) -> Option<String> {
  let name = raw
    .trim()
    .trim_matches(|c: char| matches!(c, ',' | '.' | ';' | '·' | ':' | '|'))
    .trim();
  if name.len() < 2 || name.len() > 48 {
    return None;
  }
  if is_location_label(name) {
    return None;
  }
  let lower = name.to_lowercase();
  if lower.contains("(h/f)")
    || lower.contains("(f/h)")
    || lower.contains("développeur")
    || lower.contains("developer")
    || lower.contains("freelance")
    || lower.starts_with("http")
  {
    return None;
  }
  Some(name.to_string())
}

#[cfg(test)]
mod tests {
  use super::company_from_indeed_snippet;

  #[test]
  fn company_from_rejoindre() {
    let company = company_from_indeed_snippet(
      "Rejoindre Advens, c'est intégrer un spécialiste européen de la Cybersécurité",
    );
    assert_eq!(company.as_deref(), Some("Advens"));
  }

  #[test]
  fn company_from_chez() {
    let company = company_from_indeed_snippet(
      "Salaires pour le poste Développeur Full Stack chez Etinars, Lille, HDF",
    );
    assert_eq!(company.as_deref(), Some("Etinars"));
  }

  #[test]
  fn company_from_street_address() {
    let company = company_from_indeed_snippet(
      "Idoine Conseil. 36 rue Laffitte, 75009 Paris. Détails de l'emploi.",
    );
    assert_eq!(company.as_deref(), Some("Idoine Conseil"));
  }
}
