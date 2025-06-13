"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Homepage } from "./pages/home/homepage";
import EditPage from "./pages/edit/editpage";
import { WebcamCapture } from "./pages/webcam/WebcamModal";
import Acess from "./pages/acess/Acess";
import "./App.css";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { Sector, Worker } from "./utils/types/EpiaTypes.ts";
import {Toaster, toast} from "sonner";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cardId, setCardId] = useState("");
    const [worker, setWorker] = useState<Worker>();
    const [user, setUser] = useState<Worker | undefined>();
    const [sector, setSector] = useState<Sector>();
    const handleWorker = async ():Promise<Worker> => {
        console.log("começando....");
        setCardId("010102031");
        console.log("cardId", cardId);
        const worker = await invoke("get_worker_by_card_id", {
            cardId: "   ",
        }) as Worker;
        console.log("worker", worker);
        setWorker(worker);
        return worker;
    };
    const getRoomInfos = async()=>{
        const response = await invoke("get_room_infos", {code: "STD06"}) as Sector;
        setSector(response);
    }

    const handleLoginSuccess = async () => {
        try {
            console.log("handle login");
            await handleWorker()
            console.log("worker", worker);

            await getRoomInfos();
            toast.success("autenticado!")
            setIsAuthenticated(true);
            setCurrentPage("home");
        } catch (error) {
            console.error("Erro ao buscar worker:", error);
            toast.error('falha ao autenticar');
            setIsAuthenticated(false);
            setCurrentPage("home");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

        const renderPage = () => {
            switch (currentPage) {
                case "home":
                    return <Homepage worker={worker!} sector={sector!} />;
                case "edit":
                    return <EditPage sector={sector!} onSectorUpdate={()=>getRoomInfos()}/>;
                case "dashboard":
                    
                    return <DashboardPage />;
                case "webcam":
                    return <WebcamCapture />;
                default:
                    return <Acess handleWorker={handleWorker}/>;
            }
        };

    if (!isAuthenticated) {
        return <Acess onLoginSuccess={handleLoginSuccess} handleWorker={handleWorker} />;
    }

    return (
        <div className="main-container">
            {/* Adicione o Toaster aqui (pode ser no início ou no fim do JSX) */}
            <Toaster position="bottom-right" />

            <div className="navigator">
                <h1>EPIAI</h1>
                <a onClick={() => setCurrentPage("home")} className={currentPage === "home" ? "active" : ""}>
                    Inicio
                </a>
                {worker?.type === "operator" && (
                    <a onClick={() => setCurrentPage("edit")} className={currentPage === "edit" ? "active" : ""}>
                        Configurações
                    </a>
                )}
                {worker?.type === "operator" && (
                    <a onClick={() => setCurrentPage("dashboard")} className={currentPage === "dashboard" ? "active" : ""}>
                        Dashboard
                    </a>
                )}
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
    );
}

export default App;
