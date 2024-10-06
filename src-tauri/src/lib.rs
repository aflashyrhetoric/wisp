mod file_op_commands;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! {}", name, "LOL")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // .setup(|app| {
        //     let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        //         .title("Wisp")
        //         .inner_size(1400.0, 960.0);
        //     // set transparent title bar only when building for macOS
        //     #[cfg(target_os = "macos")]
        //     let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);
        //     let window = win_builder.build().unwrap();
        //     // set background color only when building for macOS
        //     #[cfg(target_os = "macos")]
        //     {
        //         use cocoa::appkit::{NSColor, NSWindow};
        //         use cocoa::base::{id, nil};
        //         let ns_window = window.ns_window().unwrap() as id;
        //         unsafe {
        //             let bg_color =
        //                 NSColor::colorWithRed_green_blue_alpha_(nil, 255.0, 255.0, 255.0, 1.0);
        //             ns_window.setBackgroundColor_(bg_color);
        //         }
        //     }
        //     Ok(())
        // })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        // *********************
        // START INVOKE HANDLERS
        // *********************
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![
            file_op_commands::get_file_metadata
        ])
        // *********************
        // END INVOKE HANDLERS
        // *********************
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
