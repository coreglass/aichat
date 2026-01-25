// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;
use std::sync::Mutex;
use tauri::{Emitter, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder, Window};

#[derive(Clone)]
struct AppState {
    detached_windows: Arc<Mutex<Vec<WebviewWindow>>>,
    proxy_address: Arc<Mutex<Option<String>>>,
}

fn main() {
    let state = AppState {
        detached_windows: Arc::new(Mutex::new(Vec::new())),
        proxy_address: Arc::new(Mutex::new(None)),
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|_app| {
            // Load saved proxy settings
            if let Some(proxy) = load_proxy_settings() {
                set_system_proxy(&proxy);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_proxy_dialog,
            set_proxy,
            clear_proxy,
            open_version_dialog,
            detach_webview,
            restore_sidebar,
            close_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
