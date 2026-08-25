//! Display names and light heuristics for WTTJ company slugs.

pub fn company_name_from_slug(slug: &str) -> String {
  match slug {
    "listen-too" => "Listen too".into(),
    "nexton-consulting" => "NEXTON".into(),
    "sopra-steria" => "Sopra Steria".into(),
    "sii" => "Groupe SII".into(),
    "cgi" => "CGI".into(),
    "webnet" => "Webnet".into(),
    "open" => "Open".into(),
    "meritis" => "Meritis".into(),
    other => humanize_slug(other),
  }
}

pub fn is_probable_city(part: &str) -> bool {
  let lower = part.to_lowercase();
  matches!(
    lower.as_str(),
    "lille"
      | "paris"
      | "lyon"
      | "bordeaux"
      | "nantes"
      | "toulouse"
      | "strasbourg"
      | "montpellier"
      | "rennes"
      | "marseille"
      | "nice"
      | "villeneuve-d'ascq"
      | "villeneuve d'ascq"
  ) || lower.starts_with("à ")
}

fn humanize_slug(slug: &str) -> String {
  slug
    .split('-')
    .filter(|part| !part.is_empty())
    .map(|part| {
      let mut chars = part.chars();
      match chars.next() {
        Some(first) => format!("{}{}", first.to_uppercase(), chars.as_str()),
        None => String::new(),
      }
    })
    .collect::<Vec<_>>()
    .join(" ")
}
