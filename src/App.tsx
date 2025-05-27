import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Homepage } from "./pages/home/homepage";
import EditPage from "./pages/edit/editpage" // ou { EditPage } se for named export
import { WebcamCapture } from "./pages/webcam/WebcamModal";
import "./App.css";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [currentPage, setCurrentPage] = useState("home");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", { name }));
    }

    async function hello_fellas() {
        await invoke("hello_fellas");
    }

    // Função para renderizar a página atual
    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <Homepage />;
            case "edit":
                return <EditPage />;
            case "dashboard":
                return <div>Dashboard (Em desenvolvimento)</div>;
            case "webcam":
                return <WebcamCapture />;
            default:
                return <Homepage />;
        }
    };

    return (
        <div className="main-container">
            <div className="navigator">
                <h1>EPIA</h1>
                <a 
                    onClick={() => setCurrentPage("home")} 
                    className={currentPage === "home" ? "active" : ""}
                >
                    Inicio
                </a>
                <a 
                    onClick={() => setCurrentPage("edit")} 
                    className={currentPage === "edit" ? "active" : ""}
                >
                    Editar
                </a>
                <a 
                    onClick={() => setCurrentPage("dashboard")} 
                    className={currentPage === "dashboard" ? "active" : ""}
                >
                    Dashboard
                </a>
                <a 
                    onClick={() => setCurrentPage("webcam")} 
                    className={currentPage === "webcam" ? "active" : ""}
                >
                    Webcam
                </a>
            </div>
            <div className="app-container">
                
                <div className="search-container">
                    <input 
                        type="text" 
                        name="" 
                        id="" 
                        placeholder="pesquisar" 
                    />
                </div>
                {renderPage()}
            </div>
        </div>
    );
}

export default App;