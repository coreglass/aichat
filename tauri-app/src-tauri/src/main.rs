// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::sync::Mutex;
use tauri::{Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder, Window};

// Model data structure
#[derive(Clone, Serialize, Deserialize)]
pub struct Model {
    pub id: String,
    pub name: String,
    pub provider: String,
    pub url: String,
    pub icon: String,
    #[serde(default = "true")]
    pub enabled: bool,
}

// Conversation data structure
#[derive(Clone, Serialize, Deserialize)]
pub struct Conversation {
    pub id: String,
    pub name: String,
    pub model_id: String,
    pub created_at: String,
}

// Application state
#[derive(Clone)]
struct AppState {
    conversations: Arc<Mutex<Vec<Conversation>>>,
    models: Arc<Mutex<Vec<Model>>>,
}

// Default models
fn get_default_models() -> Vec<Model> {
    vec![
        Model {
            id: "deepseek".to_string(),
            name: "DeepSeek".to_string(),
            provider: "深度求索".to_string(),
            url: "https://chat.deepseek.com/".to_string(),
            icon: "assets/deepseek.svg".to_string(),
            enabled: true,
        },
        Model {
            id: "tyqw".to_string(),
            name: "通义千问".to_string(),
            provider: "阿里".to_string(),
            url: "https://www.tongyi.com/".to_string(),
            icon: "assets/tyqw.png".to_string(),
            enabled: true,
        },
        Model {
            id: "doubao".to_string(),
            name: "豆包".to_string(),
            provider: "字节".to_string(),
            url: "https://www.doubao.com/".to_string(),
            icon: "assets/doubao.png".to_string(),
            enabled: true,
        },
        Model {
            id: "tenxun".to_string(),
            name: "元宝".to_string(),
            provider: "腾讯".to_string(),
            url: "https://yuanbao.tencent.com/chat/".to_string(),
            icon: "assets/tenxun.png".to_string(),
            enabled: true,
        },
        Model {
            id: "kimi".to_string(),
            name: "Kimi".to_string(),
            provider: "月之暗面".to_string(),
            url: "https://kimi.moonshot.cn/".to_string(),
            icon: "assets/kimi.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "openai".to_string(),
            name: "ChatGPT".to_string(),
            provider: "OpenAI".to_string(),
            url: "https://chatgpt.com/".to_string(),
            icon: "assets/chatgpt.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "google".to_string(),
            name: "Gemini".to_string(),
            provider: "Google".to_string(),
            url: "https://gemini.google.com/".to_string(),
            icon: "assets/google.png".to_string(),
            enabled: true,
        },
        Model {
            id: "claude".to_string(),
            name: "Claude".to_string(),
            provider: "Anthropic".to_string(),
            url: "https://claude.ai/".to_string(),
            icon: "assets/claude.png".to_string(),
            enabled: true,
        },
        Model {
            id: "poe".to_string(),
            name: "Poe".to_string(),
            provider: "Quora".to_string(),
            url: "https://poe.com/".to_string(),
            icon: "assets/poe.svg".to_string(),
            enabled: true,
        },
        Model {
            id: "manus".to_string(),
            name: "Manus".to_string(),
            provider: "蝴蝶效应".to_string(),
            url: "https://manus.im/".to_string(),
            icon: "assets/manus.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "grok".to_string(),
            name: "Grok".to_string(),
            provider: "xAI".to_string(),
            url: "https://x.ai/grok".to_string(),
            icon: "assets/grok.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "meta".to_string(),
            name: "Meta AI".to_string(),
            provider: "Meta".to_string(),
            url: "https://www.meta.ai/".to_string(),
            icon: "assets/meta.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "perplexity".to_string(),
            name: "Perplexity".to_string(),
            provider: "Perplexity".to_string(),
            url: "https://www.perplexity.ai/".to_string(),
            icon: "assets/perplexity.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "copilot".to_string(),
            name: "Copilot".to_string(),
            provider: "Microsoft".to_string(),
            url: "https://copilot.microsoft.com/".to_string(),
            icon: "assets/copilot.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "wxyy".to_string(),
            name: "文心一言".to_string(),
            provider: "百度".to_string(),
            url: "https://yiyan.baidu.com/".to_string(),
            icon: "assets/wxyy.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "deepl".to_string(),
            name: "DeepL".to_string(),
            provider: "DeepL".to_string(),
            url: "https://www.deepl.com/".to_string(),
            icon: "assets/deepl.png".to_string(),
            enabled: true,
        },
        Model {
            id: "youdao".to_string(),
            name: "有道翻译".to_string(),
            provider: "网易".to_string(),
            url: "https://fanyi.youdao.com/#/TextTranslate".to_string(),
            icon: "assets/youdao.ico".to_string(),
            enabled: true,
        },
        Model {
            id: "sciencepal".to_string(),
            name: "Sciencepal".to_string(),
            provider: "Sciencepal".to_string(),
            url: "https://sciencepal.ai/".to_string(),
            icon: "assets/sciencepal.png".to_string(),
            enabled: true,
        },
        Model {
            id: "bing".to_string(),
            name: "Bing".to_string(),
            provider: "Microsoft".to_string(),
            url: "https://www.bing.com/".to_string(),
            icon: "assets/bing.ico".to_string(),
            enabled: true,
        },
    ]
}

fn main() {
    // Initialize state
    let state = AppState {
        conversations: Arc::new(Mutex::new(Vec::new())),
        models: Arc::new(Mutex::new(get_default_models())),
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            // Initialize models
            let models = get_default_models();
            *app.state::<AppState>().models.lock().unwrap() = models;

            println!("App initialized with {} models", models.len());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Conversation management
            get_conversations,
            create_conversation,
            delete_conversation,
            update_conversation_model,
            // Model management
            get_models,
            toggle_model,
            save_models,
            // Network
            open_proxy_dialog,
            set_proxy,
            clear_proxy,
            // Other
            open_about_dialog,
            open_manual,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// ==================== Conversation Commands ====================

#[tauri::command]
fn get_conversations(state: tauri::State<AppState>) -> Vec<Conversation> {
    state.conversations.lock().unwrap().clone()
}

#[tauri::command]
fn create_conversation(
    name: String,
    model_id: String,
    state: tauri::State<AppState>,
) -> Result<Conversation, String> {
    use std::time::SystemTime;

    let conversation = Conversation {
        id: format!(
            "conv-{}",
            SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        ),
        name: name.clone(),
        model_id: model_id.clone(),
        created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    };

    {
        let mut conversations = state.conversations.lock().unwrap();
        conversations.push(conversation.clone());
    }

    // Save to file
    save_conversations(&state);

    Ok(conversation)
}

#[tauri::command]
fn delete_conversation(id: String, state: tauri::State<AppState>) {
    {
        let mut conversations = state.conversations.lock().unwrap();
        conversations.retain(|c| c.id != id);
    }

    // Save to file
    save_conversations(&state);
}

#[tauri::command]
fn update_conversation_model(id: String, model_id: String, state: tauri::State<AppState>) {
    {
        let mut conversations = state.conversations.lock().unwrap();
        if let Some(conv) = conversations.iter_mut().find(|c| c.id == id) {
            conv.model_id = model_id;
        }
    }

    save_conversations(&state);
}

// ==================== Model Commands ====================

#[tauri::command]
fn get_models(state: tauri::State<AppState>) -> Vec<Model> {
    state.models.lock().unwrap().clone()
}

#[tauri::command]
fn toggle_model(id: String, enabled: bool, state: tauri::State<AppState>) {
    {
        let mut models = state.models.lock().unwrap();
        if let Some(model) = models.iter_mut().find(|m| m.id == id) {
            model.enabled = enabled;
        }
    }

    // Auto-save to file
    save_models(&state);
}

#[tauri::command]
fn save_models(models: Vec<Model>, state: tauri::State<AppState>) {
    {
        let mut current_models = state.models.lock().unwrap();
        *current_models = models;
    }
}

fn save_models_to_file(models: &Vec<Model>) {
    save_models_to_file_inner(models);
}

fn save_models_to_file_inner(models: &Vec<Model>) {
    use std::fs;
    use dirs::data_local_dir;

    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = fs::create_dir_all(&data_dir);
        data_dir.push("models.json");

        if let Ok(json) = serde_json::to_string_pretty(models) {
            fs::write(&data_dir, json).ok();
        }
    }
}

#[tauri::command]
fn get_models(state: tauri::State<AppState>) -> Vec<Model> {
    state.models.lock().unwrap().clone()
}

#[tauri::command]
fn toggle_model(id: String, enabled: bool, state: tauri::State<AppState>) {
    {
        let mut models = state.models.lock().unwrap();
        if let Some(model) = models.iter_mut().find(|m| m.id == id) {
            model.enabled = enabled;
        }
    }

    // Auto-save to file
    save_models(&state);
}

    save_models_to_file(&models);
}

// ==================== File Operations ====================

fn save_conversations(state: &tauri::State<AppState>) {
    use dirs::data_local_dir;
    use std::fs;

    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = fs::create_dir_all(&data_dir);
        data_dir.push("conversations.json");

        if let Ok(conversations) = state.conversations.lock() {
            if let Ok(json) = serde_json::to_string_pretty(&*conversations) {
                fs::write(&data_dir, json).ok();
            }
        }
    }
}

fn save_models_to_file(models: &Vec<Model>) {
    use dirs::data_local_dir;
    use std::fs;

    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = fs::create_dir_all(&data_dir);
        data_dir.push("models.json");

        if let Ok(json) = serde_json::to_string_pretty(models) {
            fs::write(&data_dir, json).ok();
        }
    }
}

// ==================== Window Commands ====================

#[tauri::command]
fn open_proxy_dialog(window: Window) {
    let app = window.app_handle().clone();

    let _proxy_window =
        WebviewWindowBuilder::new(&app, "proxy-window", WebviewUrl::App("proxy.html".into()))
            .title("网络设置")
            .inner_size(400.0, 250.0)
            .resizable(false)
            .center()
            .build();
}

#[tauri::command]
fn set_proxy(address: String, window: Window) {
    use std::env;

    env::set_var("HTTP_PROXY", &address);
    env::set_var("HTTPS_PROXY", &address);
    env::set_var("http_proxy", &address);
    env::set_var("https_proxy", &address);

    window.emit("proxy-set", address).ok();
}

#[tauri::command]
fn clear_proxy(window: Window) {
    use std::env;

    env::remove_var("HTTP_PROXY");
    env::remove_var("HTTPS_PROXY");
    env::remove_var("http_proxy");
    env::remove_var("https_proxy");

    window.emit("proxy-cleared", ()).ok();
}

#[tauri::command]
fn open_about_dialog(window: Window) {
    let app = window.app_handle().clone();

    let _about_window =
        WebviewWindowBuilder::new(&app, "about-window", WebviewUrl::App("about.html".into()))
            .title("关于程序")
            .inner_size(400.0, 300.0)
            .resizable(false)
            .center()
            .build();
}

#[tauri::command]
fn open_manual(window: Window) {
    let app = window.app_handle().clone();
    app.shell().open("assets/Readme.pdf", None).ok();
}
