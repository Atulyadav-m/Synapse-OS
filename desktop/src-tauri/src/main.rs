
// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Humare custom commands ko import kiya
mod commands;

use commands::{greet, run_workflow, get_system_info};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            run_workflow,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
