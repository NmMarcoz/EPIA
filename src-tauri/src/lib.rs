// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn hello_fellas() -> (){
    println!("Hello felas!")
}

#[tauri::command]
fn get_requirements()-> Vec<&'static str> {
    let s = ["Teste", "Teste2", "Teste3"];
    return Vec::from(s);
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, hello_fellas, get_requirements])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
