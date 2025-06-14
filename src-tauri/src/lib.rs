use std::collections::HashMap;

use serde::{Deserialize, Serialize};
mod controllers;
use controllers::external_scripts;
use reqwest;
mod repositories;
mod utils;
use repositories::epia_server::{get_worker, ApiError, Worker};

use crate::repositories::epia_server;
use crate::repositories::epia_server::Sector;
use utils::jsonutils;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!", name);
}
#[tauri::command]
fn hello_fellas() -> () {
    println!("Hello felas!")
}

//Quando enviar structs para o front, tem que serializar.
#[tauri::command]
async fn get_room_infos(code: String) -> Result<Sector, String> {
    epia_server::get_sector_by_code(code)
        .await
        .map_err(|e| match e {
            ApiError::RequestError(err) => format!("Erro na requisição: {}", err),
            ApiError::JsonError(err) => format!("Erro ao processar JSON: {}", err),
        })
}
#[tauri::command]
fn get_requirements() -> Vec<&'static str> {
    let s = ["Capacete", "Luva", "Oculos"];
    return Vec::from(s);
}

#[tauri::command]
fn run_ia()->(){
    println!("entrou no run ia");
    external_scripts::run_ia();
}

#[derive(Serialize, Deserialize)]
pub struct SectorUpdate {
    pub name: Option<String>,
    pub code: Option<String>,
    pub rules: Option<Vec<String>>,
}

#[tauri::command]
async fn update_sector(sector: SectorUpdate, code: String) -> Result<Sector, String> {
    epia_server::update_sector(sector, code)
        .await
        .map_err(|e| match e {
            ApiError::RequestError(err) => format!("Erro na requisição: {}", err),
            ApiError::JsonError(err) => format!("Erro ao processar JSON: {}", err),
        })
}

#[tauri::command]
fn run_external_script(script_name:String) -> String {
    println!("entrou aqui");
    let result = external_scripts::run_python_dashboard(script_name);
    println!("{}", result);
    return String::from(result);
}

#[derive(Serialize, Deserialize)]
struct ipResponse {
    origin: String,
}

#[tauri::command]
async fn show_ip() -> Result<ipResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| e.to_string())?;

    let resp = client
        .get("https://httpbin.org/ip")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(format!("Erro: status code {}", resp.status()));
    }

    let ip_data: ipResponse = resp.json().await.map_err(|e| e.to_string())?;
    jsonutils::pretty_json(&ip_data);
    Ok(ip_data)
}

// ... outros imports ...
#[tauri::command]
async fn get_worker_by_card_id(card_id: String) -> Result<Worker, String> {
    println!("Iniciando busca do worker com card_id: {}", card_id);
    get_worker(card_id).await.map_err(|e| match e {
        ApiError::RequestError(err) => format!("Erro na requisição: {}", err),
        ApiError::JsonError(err) => format!("Erro ao processar JSON: {}", err),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            hello_fellas,
            get_requirements,
            get_room_infos,
            run_external_script,
            show_ip,
            get_worker_by_card_id,
            update_sector,
            run_ia
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
