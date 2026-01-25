// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;
use std::sync::Mutex;
use tauri::{Emitter, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder, Window};
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Model {
    pub id: String,
    pub name: String,
    pub provider: String,
    pub url: String,
    pub icon: String,
    pub enabled: bool,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Conversation {
    pub id: String,
    pub name: String,
    pub model_id: String,
    pub created_at: String,
}

#[derive(Clone)]
struct AppState {
    detached_windows: Arc<Mutex<Vec<WebviewWindow>>>,
    proxy_address: Arc<Mutex<Option<String>>>,
    conversations: Arc<Mutex<Vec<Conversation>>>,
    models: Arc<Mutex<Vec<Model>>>,
}

fn main() {
    let state = AppState {
        detached_windows: Arc::new(Mutex::new(Vec::new())),
        proxy_address: Arc::new(Mutex::new(None)),
        conversations: Arc::new(Mutex::new(Vec::new())),
        models: Arc::new(Mutex::new(get_default_models())),
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            // Load saved proxy settings
            if let Some(proxy) = load_proxy_settings() {
                set_system_proxy(&proxy);
            }
            // Load saved data
            load_saved_data(&app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_proxy_dialog,
            set_proxy,
            clear_proxy,
            open_version_dialog,
            detach_webview,
            restore_sidebar,
            close_window,
            // Conversation management
            create_conversation,
            delete_conversation,
            get_conversations,
            // Model management
            get_models,
            update_model,
            save_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

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

fn load_saved_data(app: &tauri::App) {
    use std::fs;
    use dirs::data_local_dir;

    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = std::fs::create_dir_all(&data_dir);

        // Load conversations
        let conversations_file = data_dir.join("conversations.json");
        if let Ok(content) = fs::read_to_string(&conversations_file) {
            if let Ok(convs) = serde_json::from_str::<Vec<Conversation>>(&content) {
                let mut state = app.state::<AppState>();
                let convs_clone = convs.clone();
                *state.conversations.lock().unwrap() = convs_clone;
                println!("Loaded {} conversations", convs.len());
            }
        }

        // Load models
        let models_file = data_dir.join("models.json");
        if let Ok(content) = fs::read_to_string(&models_file) {
            if let Ok(mods) = serde_json::from_str::<Vec<Model>>(&content) {
                let mut state = app.state::<AppState>();
                let mods_clone = mods.clone();
                *state.models.lock().unwrap() = mods_clone;
                println!("Loaded {} models", mods.len());
            }
        }
    }
}

fn save_conversations(conversations: &Vec<Conversation>) {
    use std::fs;
    use dirs::data_local_dir;

    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = std::fs::create_dir_all(&data_dir);
        data_dir.push("conversations.json");

        if let Ok(json) = serde_json::to_string_pretty(conversations) {
            fs::write(&data_dir, json).ok();
        }
    }
}

fn save_models_to_file(models: &Vec<Model>) {
    use std::fs;
    use dirs::data_local_dir;

    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = std::fs::create_dir_all(&data_dir);
        data_dir.push("models.json");

        if let Ok(json) = serde_json::to_string_pretty(models) {
            fs::write(&data_dir, json).ok();
        }
    }
}

fn load_proxy_settings() -> Option<String> {
    use std::fs;
    use dirs::data_local_dir;
    
    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = std::fs::create_dir_all(&data_dir);
        data_dir.push("proxy_settings.txt");
        
        fs::read_to_string(data_dir).ok().filter(|s| !s.trim().is_empty())
    } else {
        None
    }
}

fn save_proxy_settings(proxy: &str) {
    use std::fs;
    use dirs::data_local_dir;
    
    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        let _ = std::fs::create_dir_all(&data_dir);
        data_dir.push("proxy_settings.txt");
        
        fs::write(data_dir, proxy).ok();
    }
}

fn delete_proxy_settings() {
    use std::fs;
    use dirs::data_local_dir;
    
    if let Some(mut data_dir) = data_local_dir() {
        data_dir.push("Ai Talk");
        data_dir.push("proxy_settings.txt");
        
        fs::remove_file(data_dir).ok();
    }
}

fn set_system_proxy(proxy_address: &str) {
    use std::env;
    
    // Set environment variables for HTTP and HTTPS proxy
    env::set_var("HTTP_PROXY", proxy_address);
    env::set_var("HTTPS_PROXY", proxy_address);
    env::set_var("http_proxy", proxy_address);
    env::set_var("https_proxy", proxy_address);
    
    println!("System proxy set to: {}", proxy_address);
}

fn clear_system_proxy() {
    use std::env;
    
    env::remove_var("HTTP_PROXY");
    env::remove_var("HTTPS_PROXY");
    env::remove_var("http_proxy");
    env::remove_var("https_proxy");
    
    println!("System proxy cleared");
}

// Open proxy settings dialog
#[tauri::command]
fn open_proxy_dialog(window: Window) {
    let app = window.app_handle().clone();

    let _proxy_window =
        WebviewWindowBuilder::new(&app, "proxy-window", WebviewUrl::App("proxy.html".into()))
            .title("网络设置")
            .inner_size(370.0, 250.0)
            .resizable(false)
            .center()
            .build();
}

// Set proxy
#[tauri::command]
fn set_proxy(window: Window, proxy_address: String, state: tauri::State<AppState>) {
    println!("Setting proxy to: {}", proxy_address);
    
    // Save proxy settings
    save_proxy_settings(&proxy_address);
    
    // Set system proxy
    set_system_proxy(&proxy_address);
    
    // Update state
    *state.proxy_address.lock().unwrap() = Some(proxy_address.clone());

    // Show message to user
    window.emit("proxy-set", proxy_address).ok();
}

// Clear proxy
#[tauri::command]
fn clear_proxy(window: Window, state: tauri::State<AppState>) {
    println!("Clearing proxy settings");
    
    // Delete proxy settings
    delete_proxy_settings();
    
    // Clear system proxy
    clear_system_proxy();
    
    // Update state
    *state.proxy_address.lock().unwrap() = None;
    
    window.emit("proxy-cleared", ()).ok();
}

// Open version/about dialog
#[tauri::command]
fn open_version_dialog(window: Window) {
    let app = window.app_handle().clone();

    let _version_window =
        WebviewWindowBuilder::new(&app, "version-window", WebviewUrl::App("about.html".into()))
            .title("关于程序")
            .inner_size(500.0, 685.0)
            .resizable(false)
            .center()
            .build();
}

// Detach webview to new window (session clone)
#[tauri::command]
fn detach_webview(window: Window, url: String, state: tauri::State<AppState>) {
    if url.is_empty() {
        return;
    }

    let app = window.app_handle().clone();
    let detached_windows = state.detached_windows.clone();

    let detached = WebviewWindowBuilder::new(
        &app,
        format!(
            "detached-{}",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        ),
        WebviewUrl::External(url.parse().unwrap()),
    )
    .title("会话分身")
    .inner_size(1080.0, 745.0)
    .center()
    .build();

    if let Ok(detached_win) = detached {
        // Track this window
        let mut windows = detached_windows.lock().unwrap();
        windows.push(detached_win.clone());

        // Handle window close
        let detached_url = url.clone();
        let detached_win_label = detached_win.label().to_string();
        let main_window = window.clone();
        let detached_windows_for_closure = detached_windows.clone();

        detached_win.on_window_event(move |event| {
            if let tauri::WindowEvent::Destroyed = event {
                // Remove from tracking
                let mut windows = detached_windows_for_closure.lock().unwrap();
                windows.retain(|w: &WebviewWindow| w.label() != &detached_win_label);

                // Notify main window to restore webview
                main_window
                    .emit("restore-webview-url", detached_url.clone())
                    .ok();
            }
        });
    }
}

// Restore sidebar (when detached window is closed)
#[tauri::command]
fn restore_sidebar(window: Window) {
    window.emit("restore-sidebar", ()).ok();
}

// Close window
#[tauri::command]
async fn close_window(window: Window) {
    window.close().ok();
}

// ==================== Conversation Management Commands ====================

// Create a new conversation
#[tauri::command]
fn create_conversation(
    window: Window,
    name: String,
    model_id: String,
    state: tauri::State<AppState>
) -> Result<Conversation, String> {
    use std::time::SystemTime;

    let conversation = Conversation {
        id: format!("conv-{}", SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs()),
        name,
        model_id,
        created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    };

    let mut conversations = state.conversations.lock().unwrap();
    conversations.push(conversation.clone());

    // Save to file
    save_conversations(&conversations);

    // Emit event
    window.emit("conversation-created", conversation.clone()).ok();

    Ok(conversation)
}

// Delete a conversation
#[tauri::command]
fn delete_conversation(
    window: Window,
    id: String,
    state: tauri::State<AppState>
) {
    let mut conversations = state.conversations.lock().unwrap();
    conversations.retain(|c| c.id != id);

    // Save to file
    save_conversations(&conversations);

    // Emit event
    window.emit("conversation-deleted", id).ok();
}

// Get all conversations
#[tauri::command]
fn get_conversations(state: tauri::State<AppState>) -> Vec<Conversation> {
    state.conversations.lock().unwrap().clone()
}

// ==================== Model Management Commands ====================

// Get all models
#[tauri::command]
fn get_models(state: tauri::State<AppState>) -> Vec<Model> {
    state.models.lock().unwrap().clone()
}

// Update model (enable/disable)
#[tauri::command]
fn update_model(
    window: Window,
    id: String,
    enabled: bool,
    state: tauri::State<AppState>
) {
    let mut models = state.models.lock().unwrap();
    if let Some(model) = models.iter_mut().find(|m| m.id == id) {
        model.enabled = enabled;
    }

    // Save to file
    save_models_to_file(&models);

    // Emit event
    window.emit("model-updated", (id, enabled)).ok();
}

// Save models configuration
#[tauri::command]
fn save_models(window: Window, models: Vec<Model>, state: tauri::State<AppState>) {
    let mut current_models = state.models.lock().unwrap();
    *current_models = models.clone();

    // Save to file
    save_models_to_file(&models);

    // Emit event
    window.emit("models-saved", ()).ok();
}
