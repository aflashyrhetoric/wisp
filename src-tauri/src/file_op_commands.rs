use std::fs::metadata;
use std::time::UNIX_EPOCH;
use tauri::command;

#[command]
pub fn get_file_metadata(file_path: String) -> Result<String, String> {
    match metadata(&file_path) {
        Ok(meta) => {
            if let Ok(created) = meta.created() {
                // Convert SystemTime to a Unix timestamp
                if let Ok(duration_since_epoch) = created.duration_since(UNIX_EPOCH) {
                    // Get TIME VALUE in SECONDS (aka tv_sec)
                    let tv_sec = duration_since_epoch.as_secs(); // Get the seconds since epoch
                    // println!("tv_sec: {}", tv_sec);
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
