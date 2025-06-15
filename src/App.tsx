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
import * as epiaProvider from "./infra/providers/EpiaServerProvider.ts";
import { Setores } from "./pages/setores/Setores.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { InicioPage } from "./pages/inicio/Inicio.tsx";
import { ToastContainer, toast } from "react-toastify";
import { LogPage } from "./pages/logs/LogPage.tsx";

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
    

    const handleWorker = async (): Promise<Worker> => {
        const worker = (await epiaProvider.getSession()) as Worker;
        console.log("worker", worker);
        setWorker(worker);
        toast.success("teste")
        return worker;
    };
    const getRoomInfos = async (sectorCode?: string) => {
        const response = await epiaProvider.getSectorByCode(
            sectorCode ?? "STD06"
        );
        toast.success("Setor carregado com sucesso");
        setSector(response);
    };

    const handleLoginSuccess = async () => {
        try {
            console.log("handle login");
            // await handleWorker();
            // console.log("worker", worker);

            await getRoomInfos();

            toast.success("Acesso autorizado");

            setIsAuthenticated(true);
            setCurrentPage("home");
        } catch (error) {
            console.error("❌ Erro na autenticação:", error);
            toast.error("Falha na autenticação");
            setIsAuthenticated(false);
        }
    };

    const handleConfigPage = (sector: Sector) => {
        setSector(sector);
        setCurrentPage("edit");
    };

    const handleLogout = () => {
        toast.info("Sessão encerrada com segurança");
        setIsMenuVisible(false);
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
                return worker?.type === "admin" ? (
                    <Homepage worker={worker!} sector={sector!} />
                ) : (
                    <InicioPage></InicioPage>
                );
            case "setores":
                return <Setores handleSectorClick={handleConfigPage} />;
            case "edit":
                return (
                    <EditPage
                        sector={sector!}
                        onSectorUpdate={async () => getRoomInfos(sector?.code!)}
                    />
                );
            case "dashboard":
                return <DashboardPage scriptName="graficoEPIA" />;
            case "logs":
                return <LogPage/>;
            case "webcam":
                return <WebcamCapture />;
            case "Alertas":
                return <DashboardPage scriptName="alertas" />;
            case "Funcionarios":
                return <DashboardPage scriptName="funcionarios" />;
            case "Estatistica":
                return <DashboardPage scriptName="estatistica" />;
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
        <>
            <ToastContainer position="top-right" />
            <div className="main-container">
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
                        aria-current={
                            currentPage === "home" ? "page" : undefined
                        }
                    >
                        <FontAwesomeIcon
                            icon={faHouse}
                            className="yellow-icon"
                        />
                        Home
                    </a>

                    {worker?.type === "admin" && (
                        <a
                            onClick={() => setCurrentPage("setores")}
                            className={
                                currentPage === "setores" ? "active" : ""
                            }
                            role="button"
                            tabIndex={0}
                            aria-current={
                                currentPage === "setores" ? "page" : undefined
                            }
                        >
                            <FontAwesomeIcon
                                icon={faFolderOpen}
                                className="yellow-icon"
                            />{" "}
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
                            <FontAwesomeIcon
                                icon={faGear}
                                className="yellow-icon"
                            />
                            Configurações
                        </a>
                    )}
                    {worker?.type === "admin" && (
                        <a
                            onClick={() => setCurrentPage("logs")}
                            className={currentPage === "logs" ? "active" : ""}
                            role="button"
                            tabIndex={0}
                            aria-current={
                                currentPage === "logs" ? "page" : undefined
                            }
                        >
                            <FontAwesomeIcon
                                icon={faGear}
                                className="yellow-icon"
                            />
                            Logs
                        </a>
                    )}

                    {worker?.type === "admin" && (
                        <a
                            onClick={() => setCurrentPage("dashboard")}
                            className={
                                currentPage === "dashboard" ? "active" : ""
                            }
                            role="button"
                            tabIndex={0}
                            aria-current={
                                currentPage === "dashboard" ? "page" : undefined
                            }
                        >
                            <span className="icon">📊</span>
                            Gráficos Gerais
                        </a>
                    )}
                    {worker?.type === "admin" && (
                        <a
                            onClick={() => setCurrentPage("Alertas")}
                            className={
                                currentPage === "Alertas" ? "active" : ""
                            }
                            role="button"
                            tabIndex={0}
                            aria-current={
                                currentPage === "dashboard" ? "page" : undefined
                            }
                        >
                            <span className="icon">📊</span>
                            Alertas
                        </a>
                    )}
                    {worker?.type === "admin" && (
                        <a
                            onClick={() => setCurrentPage("Funcionarios")}
                            className={
                                currentPage === "Funcionarios" ? "active" : ""
                            }
                            role="button"
                            tabIndex={0}
                            aria-current={
                                currentPage === "dashboard" ? "page" : undefined
                            }
                        >
                            <span className="icon">📊</span>
                            Funcionário
                        </a>
                    )}
                    {worker?.type === "admin" && (
                        <a
                            onClick={() => setCurrentPage("Estatistica")}
                            className={
                                currentPage === "Estatísca" ? "active" : ""
                            }
                            role="button"
                            tabIndex={0}
                            aria-current={
                                currentPage === "dashboard" ? "page" : undefined
                            }
                        >
                            <span className="icon">📊</span>
                            Estatísca
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
                    <div className="page-content">{renderPage()}</div>
                </main>
            </div>
        </>
    );
}

export default App;
