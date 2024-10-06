use serde::Deserialize;
use std::fs::metadata;
use std::time::UNIX_EPOCH;
use tauri::command;

#[derive(Debug, Deserialize)]
pub struct FileInfo {
    pub file_type: String,
    pub filename: String,
    pub id: String,
    pub is_directory: bool,
    pub is_file: bool,
    pub is_symlink: bool,
    pub name: String,
    pub path: String,
    pub revised_filename: String,
}

// #[tauri::command]
// pub fn rename_all_files(allRegisteredFiles: Vec<FileInfo>) {
//     for file_info in allRegisteredFiles {
//         println!("File info: {:?}", file_info);
//     }
// }

#[command]
pub fn get_file_metadata(file_path: String) -> Result<String, String> {
    match metadata(&file_path) {
        Ok(meta) => {
            if let Ok(created) = meta.created() {
                // Convert SystemTime to a Unix timestamp
                if let Ok(duration_since_epoch) = created.duration_since(UNIX_EPOCH) {
                    let tv_sec = duration_since_epoch.as_secs(); // Get the seconds since epoch
                    println!("tv_sec: {}", tv_sec);
                    Ok(format!("{}", tv_sec)) // Return the tv_sec value as a string
                } else {
                    Err("Could not calculate duration since UNIX_EPOCH".into())
                }
            } else {
                Err("Could not retrieve created_at timestamp".into())
            }
        }
        Err(err) => Err(format!("Error retrieving file metadata: {}", err)),
    }
}
