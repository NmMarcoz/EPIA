use std::collections::HashMap;

use serde::{Deserialize, Serialize};
mod controllers;
use controllers::external_scripts;
use reqwest;
mod utils;
use utils::jsonutils;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn hello_fellas() -> (){
    println!("Hello felas!")
}

//Quando enviar structs para o front, tem que serializar.
#[derive(Serialize)]
struct RoomInfos{
    name_id:String,
    subname:String,
    equipments: Vec<&'static str>
}

#[tauri::command]
fn get_room_infos()->RoomInfos{
    let mocked_infos = RoomInfos { 
        name_id: (String::from("Sala 24b")), 
        subname: String::from("Depósito"),
        equipments: (get_requirements()) 
    };
    return mocked_infos
}

#[tauri::command]
fn get_requirements()-> Vec<&'static str> {
    let s = ["Capacete", "Luva", "Oculos"];
    return Vec::from(s);
}

#[tauri::command]
fn run_external_script()->String{
    println!("entrou aqui");
    let result = external_scripts::run_python_dashboard();
    println!("{}", result);
    return String::from(result);
}

#[derive(Serialize, Deserialize)]
struct ipResponse{
    origin: String
}

#[tauri::command]
async fn show_ip() -> Result<ipResponse, String> {
    let resp = reqwest::get("https://httpbin.org/ip").await.map_err(|e| e.to_string())?;
    
    if !resp.status().is_success() {
        return Err(format!("Erro: status code {}", resp.status()));
    }

    let ip_data: ipResponse = resp.json().await.map_err(|e| e.to_string())?;
    jsonutils::pretty_json(&ip_data);
    Ok(ip_data)
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
            show_ip
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
