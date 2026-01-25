// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;
use std::sync::Mutex;
use tauri::{Emitter, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder, Window};

#[derive(Clone)]
struct AppState {
    detached_windows: Arc<Mutex<Vec<WebviewWindow>>>,
}

fn main() {
    let state = AppState {
        detached_windows: Arc::new(Mutex::new(Vec::new())),
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|_app| {
            // Main window is configured in tauri.conf.json
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

// Set proxy (Note: Tauri doesn't directly support setting session proxy like Electron)
#[tauri::command]
fn set_proxy(window: Window, proxy_address: String) {
    // Tauri uses system proxy settings
    // For custom proxy, you need to set environment variables or use system settings
    println!("Setting proxy to: {}", proxy_address);

    // Show a message to user about proxy settings
    window.emit("proxy-set", proxy_address).ok();
}

// Clear proxy
#[tauri::command]
fn clear_proxy(window: Window) {
    println!("Clearing proxy settings");
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
