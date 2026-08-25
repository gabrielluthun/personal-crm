use keyring::Entry;

use crate::error::AppError;

const SERVICE_NAME: &str = "com.personalcrm.app";

const ALLOWED_KEYS: &[&str] = &["bright_data_token", "supabase_anon_key"];

fn assert_allowed_key(key: &str) -> Result<(), AppError> {
  if ALLOWED_KEYS.contains(&key) {
    Ok(())
  } else {
    Err(AppError::InvalidSecretKey(key.to_string()))
  }
}

fn entry_for(key: &str) -> Result<Entry, AppError> {
  assert_allowed_key(key)?;
  Entry::new(SERVICE_NAME, key).map_err(AppError::from)
}

/// Stores a secret in the OS keychain. Never returns the value.
#[tauri::command]
pub fn set_secret(key: String, value: String) -> Result<(), AppError> {
  let trimmed = value.trim();
  if trimmed.is_empty() {
    return Err(AppError::EmptySecret);
  }
  let entry = entry_for(&key)?;
  entry.set_password(trimmed)?;
  Ok(())
}

/// Returns whether a secret exists. Never returns the secret value.
#[tauri::command]
pub fn has_secret(key: String) -> Result<bool, AppError> {
  let entry = entry_for(&key)?;
  match entry.get_password() {
    Ok(_) => Ok(true),
    Err(keyring::Error::NoEntry) => Ok(false),
    Err(error) => Err(AppError::from(error)),
  }
}

/// Deletes a secret from the OS keychain if present.
#[tauri::command]
pub fn delete_secret(key: String) -> Result<(), AppError> {
  let entry = entry_for(&key)?;
  match entry.delete_credential() {
    Ok(()) => Ok(()),
    Err(keyring::Error::NoEntry) => Ok(()),
    Err(error) => Err(AppError::from(error)),
  }
}

/// Reads a secret for internal Rust use only (e.g. Bright Data bridge).
/// Must never be exposed as a Tauri command to the frontend.
#[allow(dead_code)]
pub fn read_secret_internal(key: &str) -> Result<Option<String>, AppError> {
  let entry = entry_for(key)?;
  match entry.get_password() {
    Ok(value) => Ok(Some(value)),
    Err(keyring::Error::NoEntry) => Ok(None),
    Err(error) => Err(AppError::from(error)),
  }
}
