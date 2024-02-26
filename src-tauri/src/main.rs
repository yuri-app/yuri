// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, path::PathBuf, sync::Mutex, thread};

use nanoid::nanoid;
use once_cell::sync::Lazy;
use serde::Serialize;
use static_dir::static_dir;
use static_web_server::{directory_listing, settings::cli::General, Server, Settings};
use tauri::{Manager, State};
use tokio::sync::watch::{channel, Sender};
use warp::Filter;

static NODES: Lazy<Mutex<HashMap<Scope, StaticServer>>> = Lazy::new(|| Mutex::new(HashMap::new()));

#[derive(Clone, Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

struct StaticServer {
    origin: String,
    path: String,
    singal: Sender<()>,
}

impl StaticServer {
    fn shutdown(&self) {
        let _ = self.singal.send(());
    }
}

type Scope = String;

#[derive(Default)]
struct ServerState {
    host: String,
    port: u16,
}

#[derive(Serialize)]
struct ScopeResponse {
    origin: String,
}

#[derive(Serialize)]
struct RootResponse {
    list: Vec<RootDirectory>
}

#[derive(Serialize)]
struct RootDirectory {
    scope: Scope,
    path: String
}

#[tauri::command]
fn start_static_server(path: String, server_state: State<'_, ServerState>) -> String {
    let ServerState { host, .. } = server_state.inner();
    let port = port_check::free_local_port().unwrap();
    let scope = nanoid!();
    let settings = Settings::get(false).unwrap();
    let server = Server::new(Settings {
        general: General {
            host: host.to_string(),
            port,
            directory_listing: true,
            directory_listing_format: directory_listing::DirListFmt::Json,
            root: PathBuf::from(path.clone()),
            #[cfg(windows)]
            windows_service: true,
            cors_allow_origins: "*".to_string(),
            ..settings.general
        },
        advanced: None,
    })
    .unwrap();
    let (tx, rx) = channel(());
    thread::spawn(|| {
        server.run_server_on_rt(Some(rx), || {}).unwrap();
    });
    let mut nodes = NODES.lock().unwrap();
    let url = format!("http://{}:{}/{}/%2F", host, server_state.port, scope);
    nodes.insert(
        scope.clone(),
        StaticServer {
            origin: format!("http://{}:{}", host, port),
            path,
            singal: tx,
        },
    );
    url
}

#[tauri::command]
fn shutdown_static_server(scope: Scope) {
    let mut nodes = NODES.lock().unwrap();
    let static_server = nodes.get(&scope);
    if let Some(static_server) = static_server {
        static_server.shutdown();
        nodes.remove(&scope);
    }
}

async fn run_server(port: u16) {
    let static_route = warp::path("static").and(static_dir!("src/static"));
    let root_route = warp::path("root").map(|| {
        let nodes = NODES.lock().unwrap();
        let result = RootResponse {
            list: nodes.iter().map(|(k, v)| RootDirectory {
            path: v.path.to_string(),
            scope: k.to_string()
        }).collect::<Vec<RootDirectory>>()
        };
        warp::reply::json(&result)
    });
    let scope_route = warp::path!("scope" / String).map(|scope| {
        let nodes = NODES.lock().unwrap();
        let static_server = nodes.get(&scope);
        static_server
            .map(|s| ScopeResponse {
                origin: s.origin.to_string(),
            })
            .map_or_else(
                || warp::reply::json(&Option::<ScopeResponse>::None),
                |response| warp::reply::json(&Some(response)),
            )
    });
    let api_route = warp::path("api").and(root_route.or(scope_route));
    let fallback_route = warp::any().map(|| warp::reply::html(include_str!("./static/index.html")));
    let routes = static_route
            .or(api_route)
            .or(fallback_route);
    warp::serve(routes).run(([0, 0, 0, 0], port)).await;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            app.emit("single-instance", Payload { args: argv, cwd })
                .unwrap();
            let window = app.get_webview_window("main").unwrap();
            window.show().unwrap();
        }))
        .invoke_handler(tauri::generate_handler![
            start_static_server,
            shutdown_static_server
        ])
        .setup(|app| {
            let host = local_ip_address::local_ip().unwrap();
            let port = port_check::free_local_port().unwrap();
            let state = ServerState {
                host: host.to_string(),
                port,
                ..Default::default()
            };
            app.manage(state);
            tauri::async_runtime::spawn(run_server(port));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
