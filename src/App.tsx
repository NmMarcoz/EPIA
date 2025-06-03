"use client"

import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Homepage } from "./pages/home/homepage"
import EditPage from "./pages/edit/editpage"
import { WebcamCapture } from "./pages/webcam/WebcamModal"
import Acess from "./pages/acess/Acess"
import "./App.css"
import DashboardPage from "./pages/dashboard/DashboardPage"
import { Worker } from "./utils/types/EpiaTypes.ts";

interface User {
  id: number | string
  name: string
  type: "operator" | "admin"
  email?: string
  cardId?: string
}

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cardId, setCardId] = useState("");
  const [worker, setWorker] = useState<Worker>();
  // Verificar se há usuário logado ao inicializar


  const handleWorker = async()=>{
    console.log("começando....");
    setCardId("010102031");
    console.log("cardId", cardId);
    const worker = await invoke("get_worker_by_card_id", {
      cardId: "010102031"
    }) as Worker;
    console.log("worker", worker);
    setWorker(worker);
  }

  // async function greet() {
  //   setGreetMsg(await invoke("greet", { name }))
  // }

  // async function hello_fellas() {
  //   await invoke("hello_fellas")
  // }

  const handleLoginSuccess = async () => {
   
    try {
        console.log("handle login");
        await handleWorker(); // espera a função terminar
        setIsAuthenticated(true);
        setCurrentPage("home");
    } catch (error) {
        console.error("Erro ao buscar worker:", error);
        // Você pode decidir se ainda quer autenticar mesmo com erro
        setIsAuthenticated(false);
        setCurrentPage("home");
    }
}
  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  //renderizar a página atual
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Homepage worker={worker!}/>
      case "edit":
        return <EditPage />
      case "dashboard":
        return <DashboardPage/>
      case "webcam":
        return <WebcamCapture />
      default:
        return <Homepage worker={worker!}/>
    }
  }

  // Se não estiver autenticado, mostrar tela de acesso
  if (!isAuthenticated) {
    return <Acess onLoginSuccess= {handleLoginSuccess} />
  }

  return (
    <div className="main-container">
      <div className="navigator">
        <h1>EPIAI</h1>

        {/* Informações do usuário */}
        <div className="user-info">

          <span className={`user-badge ${currentUser?.type}`}>
            {currentUser?.type === "admin" ? "👨‍💼" : "👷"} {currentUser?.name}
          </span>
          
        </div>

        <a onClick={() => setCurrentPage("home")} className={currentPage === "home" ? "active" : ""}>
          Inicio
        </a>

        {/* Configurações só para administradores */}
        {currentUser?.type === "admin" && (
          <a onClick={() => setCurrentPage("edit")} className={currentPage === "edit" ? "active" : ""}>
            Configurações
          </a>
        )}

        {/* dashboard somente para administradores */}
        {currentUser?.type === "admin" && (
        <a onClick={() => setCurrentPage("dashboard")} className={currentPage === "dashboard" ? "active" : ""}>
          Dashboard
        </a>
        )}

        {/* Botão de logout */}
        <a onClick={handleLogout} className="logout-btn">
          Sair
        </a>
      </div>

      <div className="app-container">
        <div className="search-container">
          <input type="text" placeholder="pesquisar" />
        </div>
        {renderPage()}
      </div>
    </div>
  )
}

export default App
