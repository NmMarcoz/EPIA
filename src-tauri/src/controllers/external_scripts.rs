use std::{net::TcpStream, process::Command};

fn is_port_in_use(port:u16)->bool{
    return TcpStream::connect(("127.0.0.1", port)).is_ok();
}

pub fn run_python_dashboard()->&'static str{
    println!("entrou na função tauri");
    if(is_port_in_use(8050)){
        return "dashboard já está rodando!"
    }
    let output = Command::new("python3")
        .arg("core/scripts/graficoEPIA.py")
        .spawn();
    println!("server python rodando");
   return "http://127.0.0.1:8050/";
}