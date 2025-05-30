"use client"

import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Homepage } from "./pages/home/homepage"
import EditPage from "./pages/edit/editpage"
import { WebcamCapture } from "./pages/webcam/WebcamModal"
import Acess from "./pages/acess/Acess"
import "./App.css"

interface User {
  id: number | string
  name: string
  type: "operator" | "admin"
  email?: string
  cardId?: string
}

function App() {
  const [greetMsg, setGreetMsg] = useState("")
  const [name, setName] = useState("")
  const [currentPage, setCurrentPage] = useState("home")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Verificar se há usuário logado ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem("epiaUser")
    const authToken = localStorage.getItem("epiaAuthToken")

    if (savedUser && authToken) {
      try {
        const user: User = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Erro ao recuperar usuário:", error)
        localStorage.removeItem("epiaUser")
        localStorage.removeItem("epiaAuthToken")
      }
    }
  }, [])

  // async function greet() {
  //   setGreetMsg(await invoke("greet", { name }))
  // }

  // async function hello_fellas() {
  //   await invoke("hello_fellas")
  // }

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    setCurrentPage("home")
  }

  const handleLogout = () => {
    localStorage.removeItem("epiaUser")
    localStorage.removeItem("epiaAuthToken")
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  //renderizar a página atual
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Homepage />
      case "edit":
        return <EditPage />
      case "dashboard":
        return <div>Dashboard (Em desenvolvimento)</div>
      case "webcam":
        return <WebcamCapture />
      default:
        return <Homepage />
    }
  }

  // Se não estiver autenticado, mostrar tela de acesso
  if (!isAuthenticated) {
    return <Acess onLoginSuccess={handleLoginSuccess} />
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
