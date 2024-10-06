use serde::Deserialize;
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

#[tauri::command]
pub fn rename_all_files(allRegisteredFiles: Vec<FileInfo>) {
    for file_info in allRegisteredFiles {
        println!("File info: {:?}", file_info);
    }
}
