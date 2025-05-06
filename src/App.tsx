import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Homepage } from "./pages/home/homepage";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  async function hello_fellas(){
    await invoke("hello_fellas");
  }

  return (
    <main className="main-container">
      <div className="navigator">
        <a> Inicio </a>
        <a> Configurações </a>
        <a> Dashboard </a>
      </div>
      <Homepage />
    </main>
  );
}

export default App;
