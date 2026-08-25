use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
  #[error("Clé de secret non autorisée: {0}")]
  InvalidSecretKey(String),
  #[error("Le secret ne peut pas être vide")]
  EmptySecret,
  #[error("Jeton Bright Data manquant — configurez-le dans Settings")]
  MissingBrightDataToken,
  #[error("Jeton Bright Data refusé (401/403) — vérifiez la clé API")]
  BrightDataUnauthorized,
  #[error("Bright Data a répondu HTTP {0}")]
  BrightDataHttp(u16),
  #[error("Impossible de joindre Bright Data: {0}")]
  BrightDataNetwork(String),
  #[error("Erreur keychain: {0}")]
  Keyring(String),
}

impl Serialize for AppError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::Serializer,
  {
    serializer.serialize_str(&self.to_string())
  }
}

impl From<keyring::Error> for AppError {
  fn from(value: keyring::Error) -> Self {
    AppError::Keyring(value.to_string())
  }
}
