use std::{net::TcpStream, process::Command};

fn is_port_in_use(port: u16) -> bool {
    return TcpStream::connect(("127.0.0.1", port)).is_ok();
}

pub fn run_python_dashboard(script_string: String) -> &'static str {
    println!("script selecionado: {}", script_string);
    if (is_port_in_use(8050)) {
        print!("já está rodando");
        // let pid = Command::new("zsh")
        //     .arg("-c")
        //     .arg("lsof -t -i:8050 | xargs kill -9")
        //     .output()
        //     .expect("Failed to execute command");
        // println!("pid status: {}", pid.status);
        // println!("dashboard morto!")
        return "http://127.0.0.1:8050/";
    }
    let script_path = format!("core/python/{}.py", script_string);
    let output = Command::new("python3").arg(script_path).spawn();
    println!("server python rodando");
    return "http://127.0.0.1:8050/";
}

pub fn run_ia(ia_name: String) -> () {
    println!("entrou teste");
    println!("ianame {} ", ia_name);
    if (is_port_in_use(8050)) {
        println!("ja ta rodando");
    }
    let path = format!("core/IA/{}.py", ia_name);
    let output = Command::new("python3").arg(path).spawn();
    println!("server python rodando");
    println!("rodou!!!");
}
