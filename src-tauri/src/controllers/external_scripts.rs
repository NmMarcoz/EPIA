use std::process::Command;

#[tauri::command]
pub fn run_python_dashboard()->Result<String, String>{
    let output = Command::new("python3")
        .arg("../core/scripts/graficoEPIA.py")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success(){
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }else{
        Err(String::from_utf8_lossy(&output.stdout).to_string())
    }
}