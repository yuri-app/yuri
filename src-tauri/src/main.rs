// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, path::PathBuf, sync::Mutex, thread};

use once_cell::sync::Lazy;
use static_web_server::{settings::cli::General, Server, Settings};
use tokio::sync::watch::{channel, Sender};

static SERVER_MAP: Lazy<Mutex<HashMap<String, Sender<()>>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

#[tauri::command]
fn start_server(path: String) -> String {
    let host = local_ip_address::local_ip().unwrap().to_string();
    let port = port_check::free_local_port().unwrap();
    let settings = Settings::get(false).unwrap();
    let server = Server::new(Settings {
        general: General {
            host: host.clone(),
            port,
            directory_listing: true,
            root: PathBuf::from(path),
            windows_service: true,
            ..settings.general
        },
        advanced: None,
    })
    .unwrap();
    let (tx, rx) = channel(());
    thread::spawn(|| {
        server.run_server_on_rt(Some(rx), || {}).unwrap();
    });
    let mut map = SERVER_MAP.lock().unwrap();
    let url = format!("{}:{}", host, port);
    map.insert(url.clone(), tx);
    url
}

#[tauri::command]
fn stop_server(url: String) {
    let mut map = SERVER_MAP.lock().unwrap();
    let tx = map.get(&url);
    if let Some(tx) = tx {
        tx.send(()).unwrap();
        map.remove(&url);
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
