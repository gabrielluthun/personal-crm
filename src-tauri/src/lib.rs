mod bright_data;
mod error;
mod job_search;
mod job_search_map;
mod job_search_names;
mod models;
mod secrets;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      secrets::set_secret,
      secrets::has_secret,
      secrets::delete_secret,
      job_search::search_jobs,
      bright_data::test_bright_data_connection,
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
