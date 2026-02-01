// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    timestamp: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatRequest {
    messages: Vec<Message>,
    api_key: String,
    endpoint: String,
    model: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ZhipuMessage {
    role: String,
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ZhipuRequest {
    model: String,
    messages: Vec<ZhipuMessage>,
    stream: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct ZhipuResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Choice {
    message: ZhipuMessage,
}

#[derive(Debug, Serialize, Deserialize)]
struct ZhipuError {
    error: ErrorDetail,
}

#[derive(Debug, Serialize, Deserialize)]
struct ErrorDetail {
    message: String,
    #[serde(rename = "type")]
    error_type: String,
}

// Default Zhipu AI endpoint
const DEFAULT_ENDPOINT: &str = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

// 窗口控制命令
#[tauri::command]
async fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize()
        .map_err(|e| format!("最小化失败: {}", e))
}

#[tauri::command]
async fn maximize_window(window: tauri::Window) -> Result<(), String> {
    if window.is_maximized().map_err(|e| format!("获取窗口状态失败: {}", e))? {
        window.unmaximize()
            .map_err(|e| format!("还原窗口失败: {}", e))
    } else {
        window.maximize()
            .map_err(|e| format!("最大化失败: {}", e))
    }
}

#[tauri::command]
async fn close_window(window: tauri::Window) -> Result<(), String> {
    window.close()
        .map_err(|e| format!("关闭失败: {}", e))
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn chat_completion(
    messages: Vec<Message>,
    api_key: String,
    endpoint: String,
    model: String,
) -> Result<String, String> {
    let client = Client::new();

    // Convert our message format to Zhipu's format
    let zhipu_messages: Vec<ZhipuMessage> = messages
        .into_iter()
        .map(|msg| ZhipuMessage {
            role: msg.role,
            content: msg.content,
        })
        .collect();

    let request_body = ZhipuRequest {
        model,
        messages: zhipu_messages,
        stream: false,
    };

    // Use custom endpoint or default
    let api_endpoint = if endpoint.trim().is_empty() {
        DEFAULT_ENDPOINT
    } else {
        endpoint.trim()
    };

    // Make API request
    let response = client
        .post(api_endpoint)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("请求失败: {}", e))?;

    let status = response.status();

    if status.is_success() {
        let response_body: ZhipuResponse = response
            .json()
            .await
            .map_err(|e| format!("解析响应失败: {}", e))?;

        if let Some(choice) = response_body.choices.first() {
            Ok(choice.message.content.clone())
        } else {
            Err("未收到响应内容".to_string())
        }
    } else {
        let error_text = response.text().await.unwrap_or_else(|_| "未知错误".to_string());

        // Try to parse as Zhipu error
        if let Ok(error_response) = serde_json::from_str::<ZhipuError>(&error_text) {
            Err(format!("API 错误: {}", error_response.error.message))
        } else {
            Err(format!("请求失败 ({}): {}", status.as_u16(), error_text))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            chat_completion,
            minimize_window,
            maximize_window,
            close_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}
