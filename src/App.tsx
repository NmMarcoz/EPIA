"use client";

import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Homepage } from "./pages/home/homepage";
import EditPage from "./pages/edit/editpage";
import { WebcamCapture } from "./pages/webcam/WebcamModal";
import Acess from "./pages/acess/Acess";
import "./App.css";
import DashboardPage from "./pages/dashboard/DashboardPage";
import type { Sector, Worker } from "./utils/types/EpiaTypes.ts";
import { Toaster, toast } from "sonner";
import * as epiaProvider from "./infra/providers/EpiaServerProvider.ts";
import { Setores } from "./pages/setores/Setores.tsx";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cardId, setCardId] = useState("");
    const [worker, setWorker] = useState<Worker>();
    const [user, setUser] = useState<Worker | undefined>();
    const [sector, setSector] = useState<Sector>();
    const [sectorCode, setSectorCode] = useState<string>("");
    const [systemStatus, setSystemStatus] = useState("online");

    // Estados para controle do menu
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuTimeoutRef = useRef<NodeJS.Timeout>();
    const showTimeoutRef = useRef<NodeJS.Timeout>();

    // Simular status do sistema
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemStatus(Math.random() > 0.1 ? "online" : "checking");
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleWorker = async (): Promise<Worker> => {
        console.log("🔐 Iniciando autenticação...");
        const testCardId = "010102031";
        setCardId(testCardId);
        console.log("cardId", testCardId);
        const worker = (await epiaProvider.getWorkerByCardId(
            testCardId
        )) as Worker;
        console.log("👤 Worker autenticado:", worker);
        setWorker(worker);
        return worker;
    };

    const getRoomInfos = async () => {
        const response = (await invoke("get_room_infos", {
            code: "STD06",
        })) as Sector;
        setSector(response);
    };

    const handleLoginSuccess = async () => {
        try {
            console.log("🚀 Processando login...");
            await handleWorker();
            await getRoomInfos();

            toast.success("Sistema EPIAI - Acesso autorizado", {
                description: `Bem-vindo ao sistema de detecção EPI`,
                style: {
                    background: "rgba(26, 29, 41, 0.98)",
                    border: "1px solid rgba(255, 176, 86, 0.2)",
                    color: "#FFB056",
                    backdropFilter: "blur(12px)",
                },
            });

            setIsAuthenticated(true);
            setCurrentPage("home");
        } catch (error) {
            console.error("❌ Erro na autenticação:", error);
            toast.error("Falha na autenticação", {
                description: "Verifique suas credenciais e tente novamente",
                style: {
                    background: "rgba(26, 29, 41, 0.98)",
                    border: "1px solid rgba(255, 107, 107, 0.2)",
                    color: "#ff6b6b",
                    backdropFilter: "blur(12px)",
                },
            });
            setIsAuthenticated(false);
        }
    };

    const handleConfigPage = (sector: Sector) => {
        setSector(sector);
        setCurrentPage("edit");
    };

    const handleLogout = () => {
        toast.info("Sessão encerrada com segurança", {
            description: "Sistema EPIAI desconectado",
            style: {
                background: "rgba(26, 29, 41, 0.98)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                backdropFilter: "blur(12px)",
            },
        });
        setIsAuthenticated(false);
    };

    // Controle do menu otimizado
    const handleMouseEnterTrigger = () => {
        if (menuTimeoutRef.current) {
            clearTimeout(menuTimeoutRef.current);
        }
        setIsMenuVisible(true);
    };

    const handleMouseLeaveTrigger = () => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
        }
        menuTimeoutRef.current = setTimeout(() => {
            setIsMenuVisible(false);
        }, 250);
    };

    const handleMouseEnterMenu = () => {
        if (menuTimeoutRef.current) {
            clearTimeout(menuTimeoutRef.current);
        }
    };

    const handleMouseLeaveMenu = () => {
        menuTimeoutRef.current = setTimeout(() => {
            setIsMenuVisible(false);
        }, 150);
    };

    const getPageTitle = () => {
        const titles = {
            home: "Home",
            setores: "Gestão de Setores",
            edit: "Configurações do Sistema",
            dashboard: "Dashboard Executivo",
            webcam: "Captura de Imagem",
        };
        return titles[currentPage as keyof typeof titles] || "Sistema EPIAI";
    };

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <Homepage worker={worker!} sector={sector!} />;
            case "setores":
                return <Setores handleSectorClick={handleConfigPage} />;
            case "edit":
                return (
                    <EditPage
                        sector={sector!}
                        onSectorUpdate={() => getRoomInfos()}
                    />
                );
            case "dashboard":
                return <DashboardPage />;
            case "webcam":
                return <WebcamCapture />;
            default:
                return <Acess handleWorker={handleWorker} />;
        }
    };

    if (!isAuthenticated) {
        return (
            <Acess
                onLoginSuccess={handleLoginSuccess}
                handleWorker={handleWorker}
            />
        );
    }

    return (
        <div className="main-container">
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "rgba(26, 29, 41, 0.98)",
                        border: "1px solid rgba(255, 176, 86, 0.15)",
                        color: "white",
                        backdropFilter: "blur(12px)",
                        fontFamily: "IBM Plex Sans, sans-serif",
                    },
                }}
            />

            {/* Área de trigger do menu */}
            <div
                className="menu-trigger-zone"
                onMouseEnter={handleMouseEnterTrigger}
                onMouseLeave={handleMouseLeaveTrigger}
            />

            {/* Menu lateral corporativo */}
            <nav
                className={`navigator ${
                    isMenuVisible ? "navigator-visible" : "navigator-hidden"
                }`}
                onMouseEnter={handleMouseEnterMenu}
                onMouseLeave={handleMouseLeaveMenu}
                role="navigation"
                aria-label="Menu principal do sistema"
            >
                <h1>EPIAI</h1>

                <a
                    onClick={() => setCurrentPage("home")}
                    className={currentPage === "home" ? "active" : ""}
                    role="button"
                    tabIndex={0}
                    aria-current={currentPage === "home" ? "page" : undefined}
                >
                    <span className="icon">🏠</span>
                    Home
                </a>

                {worker?.type === "admin" && (
                    <a
                        onClick={() => setCurrentPage("setores")}
                        className={currentPage === "setores" ? "active" : ""}
                        role="button"
                        tabIndex={0}
                        aria-current={
                            currentPage === "setores" ? "page" : undefined
                        }
                    >
                        <span className="icon">🏢</span>
                        Setores
                    </a>
                )}

                {worker?.type === "admin" && (
                    <a
                        onClick={() => setCurrentPage("edit")}
                        className={currentPage === "edit" ? "active" : ""}
                        role="button"
                        tabIndex={0}
                        aria-current={
                            currentPage === "edit" ? "page" : undefined
                        }
                    >
                        <span className="icon">⚙️</span>
                        Configurações
                    </a>
                )}

                {worker?.type === "admin" && (
                    <a
                        onClick={() => setCurrentPage("dashboard")}
                        className={currentPage === "dashboard" ? "active" : ""}
                        role="button"
                        tabIndex={0}
                        aria-current={
                            currentPage === "dashboard" ? "page" : undefined
                        }
                    >
                        <span className="icon">📊</span>
                        Dashboard
                    </a>
                )}

                <a
                    onClick={handleLogout}
                    className="logout-btn"
                    role="button"
                    tabIndex={0}
                >
                    <span className="icon">🔒</span>
                    Encerrar Sessão
                </a>
            </nav>

            <main className="app-container">
                {/* Header com status */}
                <div className="status-indicator">
                    Sistema{" "}
                    {systemStatus === "online"
                        ? "Operacional"
                        : "Verificando..."}
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar funcionário, setor ou equipamento..."
                        aria-label="Campo de pesquisa do sistema"
                    />
                </div>

                <h2 className="page-title">{getPageTitle()}</h2>

                {/* ⚡ NOVO: Container com scroll para o conteúdo */}
                <div className="page-content">{renderPage()}</div>
            </main>
        </div>
    );
}

export default App;
