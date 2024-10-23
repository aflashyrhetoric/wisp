use async_openai::{
    types::{AudioResponseFormat, CreateTranscriptionRequestArgs},
    Client,
};
use serde::Serialize;
use std::fmt;

// Define a custom error struct that implements Serialize and Debug
#[derive(Serialize, Debug)]
pub struct CustomError {
    message: String,
}

impl fmt::Display for CustomError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for CustomError {}

// Define the struct for the successful response
#[derive(Serialize)]
pub struct TranscriptionResponse {
    transcription: String,
}

// The Tauri command function
#[tauri::command]
pub async fn transcribe_vtt(file_path: String) -> Result<TranscriptionResponse, CustomError> {
    let client = Client::new();
    let request = CreateTranscriptionRequestArgs::default()
        .file(file_path)
        .model("whisper-1")
        .response_format(AudioResponseFormat::Vtt)
        .build()
        .map_err(|e| CustomError {
            message: e.to_string(),
        })?;

    let response = client
        .audio()
        .transcribe_raw(request)
        .await
        .map_err(|e| CustomError {
            message: e.to_string(),
        })?;
    let transcription = String::from_utf8_lossy(response.as_ref()).to_string();

    Ok(TranscriptionResponse { transcription })
}
