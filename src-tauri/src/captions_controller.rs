use async_openai::{
    types::{AudioResponseFormat, CreateTranscriptionRequestArgs, TimestampGranularity},
    Client,
};
use serde::Serialize;
use std::error::Error;
use std::fmt;

// #[tokio::main]
// async fn main() -> Result<(), Box<dyn Error>> {
//     // transcribe_json().await?;
//     // transcribe_verbose_json().await?;
//     // transcribe_vtt().await?;
//     Ok(())
// }

// async fn transcribe_json() -> Result<(), Box<dyn Error>> {
//     let client = Client::new();
//     // Credits and Source for audio: https://www.youtube.com/watch?v=oQnDVqGIv4s
//     let request = CreateTranscriptionRequestArgs::default()
//         .file(
//             "./audio/A Message From Sir David Attenborough A Perfect Planet BBC Earth_320kbps.mp3",
//         )
//         .model("whisper-1")
//         .response_format(AudioResponseFormat::Json)
//         .build()?;

//     let response = client.audio().transcribe(request).await?;
//     println!("{}", response.text);
//     Ok(())
// }

// async fn transcribe_verbose_json() -> Result<(), Box<dyn Error>> {
//     let client = Client::new();
//     let request = CreateTranscriptionRequestArgs::default()
//         .file(
//             "./audio/A Message From Sir David Attenborough A Perfect Planet BBC Earth_320kbps.mp3",
//         )
//         .model("whisper-1")
//         .response_format(AudioResponseFormat::VerboseJson)
//         .timestamp_granularities(vec![
//             TimestampGranularity::Word,
//             TimestampGranularity::Segment,
//         ])
//         .build()?;

//     let response = client.audio().transcribe_verbose_json(request).await?;

//     println!("{}", response.text);
//     if let Some(words) = &response.words {
//         println!("- {} words", words.len());
//     }
//     if let Some(segments) = &response.segments {
//         println!("- {} segments", segments.len());
//     }

//     Ok(())
// }

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
