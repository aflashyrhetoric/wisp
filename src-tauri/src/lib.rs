mod captions_controller;
mod file_op_commands;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! {}", name, "LOL")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        // *********************
        // START INVOKE HANDLERS
        // *********************
        .invoke_handler(tauri::generate_handler![
            greet,
            captions_controller::transcribe_vtt,
            file_op_commands::get_file_metadata
        ])
        // *********************
        // END INVOKE HANDLERS
        // *********************
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
