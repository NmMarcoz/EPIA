// "use client";
// import { useState, useRef, useContext } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { Homepage } from "./pages/home/HomePageView.tsx";
// import EditPage from "./pages/edit/EditPageView.tsx";
// import { WebcamCapture } from "./pages/webcam/WebcamModal";
// // import Acess from "./pages/acess/Acess";
// // import GerenciamentoEpi from "./pages/gerenciamentoEpi/GerenciamentoEpi.tsx";
// // import OperacoesPontuais from "./pages/OperacoesPontuais/OperacoesPontuais.tsx";
// import "./App.css";
// import DashboardPage from "./pages/dashboard/DashboarPageView.ts.tsx";
// import type { Sector, UserSession, Worker } from "./utils/types/EpiaTypes.ts";
// import * as epiaProvider from "./infra/providers/EpiaServerProvider.ts";
// import { Setores } from "./pages/setores/SetoresPageView.tsx";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCirclePlay, faFileLines, faHouse, faLock, faShip, faUsersGear } from "@fortawesome/free-solid-svg-icons";
// import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
// import { faGear } from "@fortawesome/free-solid-svg-icons";
// import { faGauge } from "@fortawesome/free-solid-svg-icons";
// import { InicioPage } from "./pages/inicio/Inicio.tsx";
// import { ToastContainer, toast } from "react-toastify";
// import { LogPage } from "./pages/logs/LogPageView.tsx";
// // import NotificationBell from "./pages/components/NotificationBell";
// // import { EpiaContext } from "./infra/providers/EpiaProvider.tsx";
// // import { useNavigate } from "react-router";

// function App() {
//     const [currentPage, setCurrentPage] = useState("home");
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [cardId, setCardId] = useState("");
//     const [worker, setWorker] = useState<Worker>();
//     const [user, setUser] = useState<Worker | undefined | null>();
//     const [sector, setSector] = useState<Sector>();
//     // const [sectorCode, setSectorCode] = useState<string>("");
//     const [systemStatus, /*setSystemStatus*/] = useState("online");
//     // const [userSession, setUserSession] = useState<UserSession | null>(null);

//     // Estados para controle do menu
//     const [isMenuVisible, setIsMenuVisible] = useState(false);
//     const menuTimeoutRef = useRef<NodeJS.Timeout>();
//     const showTimeoutRef = useRef<NodeJS.Timeout>();

//     // Simular status do sistema

//     // useEffect(() => {
//     //     const checkSystemStatus = async () => {
//     //         if (userSession?._id) {
//     //             try {
//     //                 const newSession = await epiaProvider.getUserSessionById(
//     //                     userSession?._id!
//     //                 );
//     //                 if(newSession?.allCorrect){
//     //                     console.log("liberado")
//     //                     setUserSession(newSession);
//     //                 }
//     //             } catch (error) {
//     //                 console.error("autenticação do usuário", error);
//     //             }
//     //         }
//     //     };

//     //     checkSystemStatus();
//     //     const interval = setInterval(checkSystemStatus, 1500); // 10s
//     //     return () => clearInterval(interval);
//     // }, [userSession]);

//     const handleWorker = async (): Promise<Worker> => {
//         const worker = (await epiaProvider.getSession()) as Worker;
//         console.log("worker", worker);
//         setWorker(worker);
//         toast.success("teste");
//         return worker;
//     };
//     const getRoomInfos = async (sectorCode?: string) => {
//         const response = await epiaProvider.getSectorByCode(
//             sectorCode ?? "STD06"
//         );
//         toast.success("Setor carregado com sucesso");
//         setSector(response);
//     };

//     const handleLoginSuccess = async (worker: Worker) => {
//         try {
//             console.log("handle login");
//             //setWorker(worker)
//             await getRoomInfos();

//             //toast.success("Acesso autorizado");
//             console.log("worker", worker);
//             if (worker?.type === "user") {
//                 console.log("SHUHRUSHRU");
//                 //const result = await epiaProvider.setUserSession(worker.cardId);
//                 toast.success("Sessão iniciada com sucesso");
//                 // console.log("result", result);
//                 // setUserSession(result);
//                 await invoke("run_ia", {
//                     iaName: "detect_webcam",
//                 });
//             }
//             setIsAuthenticated(true);
//             setCurrentPage("home");
//         } catch (error) {
//             console.error("❌ Erro na autenticação:", error);
//             toast.error("Falha na autenticação");
//             setIsAuthenticated(false);
//         }
//     };

//     const handleConfigPage = (sector: Sector) => {
//         setSector(sector);
//         setCurrentPage("edit");
//     };

//     const handleLogout = () => {
//         toast.info("Sessão encerrada com segurança");
//         setIsMenuVisible(false);
//         setIsAuthenticated(false);
//         setWorker(null);
//     };

//     // Controle do menu otimizado
//     const handleMouseEnterTrigger = () => { 
//         if (menuTimeoutRef.current) {
//             clearTimeout(menuTimeoutRef.current);
//         }
//         setIsMenuVisible(true);
//     };

//     const handleMouseLeaveTrigger = () => {
//         if (showTimeoutRef.current) {
//             clearTimeout(showTimeoutRef.current);
//         }
//         menuTimeoutRef.current = setTimeout(() => {
//             setIsMenuVisible(false);
//         }, 250);
//     };

//     const handleMouseEnterMenu = () => {
//         if (menuTimeoutRef.current) {
//             clearTimeout(menuTimeoutRef.current);
//         }
//     };

//     const handleMouseLeaveMenu = () => {
//         menuTimeoutRef.current = setTimeout(() => {
//             setIsMenuVisible(false);
//         }, 150);
//     };

//     const getPageTitle = () => {
//         const titles = {
//             home: "Home",
//             setores: "Gestão de Setores",
//             edit: "Configurações do Sistema",
//             dashboard: "Dashboard Executivo",
//             webcam: "Captura de Imagem",
//         };
//         return titles[currentPage as keyof typeof titles] || "Sistema EPIAI";
//     };

//     const renderPage = () => {
//         switch (currentPage) {
//             case "home":
//                 return worker?.type === "admin" ? (
//                     <Homepage worker={worker!} sector={sector!} />
//                 ) : (
//                     <InicioPage worker={worker}></InicioPage>
//                 );
//             case "setores":
//                 return <Setores handleSectorClick={handleConfigPage} />;
//             case "edit":
//                 return (
//                     <EditPage
//                         sector={sector!}
//                         onSectorUpdate={async () => getRoomInfos(sector?.code!)}
//                     />
//                 );
//             case "dashboard":
//                 return <DashboardPage scriptName="graficoEPIA" />;
//             case "logs":
//                 return <LogPage />;
//             case "webcam":
//                 return <WebcamCapture />;
//                 case "gerenciamentoEpi":
//                     return <GerenciamentoEpi></GerenciamentoEpi>
//                 case "operacoes":
//                     return <OperacoesPontuais></OperacoesPontuais>
//             default:
//                 return <Acess handleWorker={handleWorker} />;
//         }
//     };

//     if (!isAuthenticated) {
//         return (
//             <Acess
//                 onLoginSuccess={handleLoginSuccess}
//                 handleWorker={handleWorker}
//             />
//         );
//     }

//     return (
//         <>
//             <NotificationBell />
//             <ToastContainer position="top-right" />
//             <div className="main-container">
//                 <div
//                     className="menu-trigger-zone"
//                     onMouseEnter={handleMouseEnterTrigger}
//                     onMouseLeave={handleMouseLeaveTrigger}
//                 />

//                 {/* Menu lateral corporativo */}
//                 <nav
//                     className={`navigator ${
//                         isMenuVisible ? "navigator-visible" : "navigator-hidden"
//                     }`}
//                     onMouseEnter={handleMouseEnterMenu}
//                     onMouseLeave={handleMouseLeaveMenu}
//                     role="navigation"
//                     aria-label="Menu principal do sistema"
//                 >
//                     <h1>EPIAI</h1>

//                     <a
//                         onClick={() => setCurrentPage("home")}
//                         className={currentPage === "home" ? "active" : ""}
//                         role="button"
//                         tabIndex={0}
//                         aria-current={
//                             currentPage === "home" ? "page" : undefined
//                         }
//                     >
//                         <FontAwesomeIcon
//                             icon={faHouse}
//                             className="yellow-icon"
//                         />
//                         Home
//                     </a>

//                     {worker?.type === "admin" && (
//                         <a
//                             onClick={() => setCurrentPage("setores")}
//                             className={
//                                 currentPage === "setores" ? "active" : ""
//                             }
//                             role="button"
//                             tabIndex={0}
//                             aria-current={
//                                 currentPage === "setores" ? "page" : undefined
//                             }
//                         >
//                             <FontAwesomeIcon
//                                 icon={faFolderOpen}
//                                 className="yellow-icon"
//                             />{" "}
//                             Setores
//                         </a>
//                     )}

//                     {worker?.type === "admin" && (
//                         <a
//                             onClick={() => setCurrentPage("edit")}
//                             className={currentPage === "edit" ? "active" : ""}
//                             role="button"
//                             tabIndex={0}
//                             aria-current={
//                                 currentPage === "edit" ? "page" : undefined
//                             }
//                         >
//                             <FontAwesomeIcon
//                                 icon={faGear}
//                                 className="yellow-icon"
//                             />
//                             Configurações
//                         </a>
//                     )}
//                     {worker?.type === "admin" && (
//                         <a
//                             onClick={() => setCurrentPage("logs")}
//                             className={currentPage === "logs" ? "active" : ""}
//                             role="button"
//                             tabIndex={0}
//                             aria-current={
//                                 currentPage === "logs" ? "page" : undefined
//                             }
//                         >
//                             <FontAwesomeIcon
//                                 icon={faFileLines}
//                                 className="yellow-icon"
//                             />
//                             Logs
//                         </a>
//                     )}

//                     {worker?.type === "admin" && (
//                         <a
//                             onClick={() => setCurrentPage("dashboard")}
//                             className={
//                                 currentPage === "dashboard" ? "active" : ""
//                             }
//                             role="button"
//                             tabIndex={0}
//                             aria-current={
//                                 currentPage === "dashboard" ? "page" : undefined
//                             }
//                         >
//                              <FontAwesomeIcon
//                                 icon={faGauge}
//                                 className="yellow-icon"
//                             />
//                             Dashboard
//                         </a>
//                     )}
//                         {worker?.type === "admin" && (
//                         <a
//                             onClick={() => setCurrentPage("gerenciamentoEpi")}
//                             className={
//                                 currentPage === "gerenciamentoEpi" ? "active" : ""
//                             }
//                             role="button"
//                             tabIndex={0}
//                             aria-current={
//                                 currentPage === "gerenciamentoEpi" ? "page" : undefined
//                             }
//                         >
//                              <FontAwesomeIcon
//                                 icon={faUsersGear }
//                                 className="yellow-icon"
//                             />
//                             Gerenciamento EPIA
//                         </a>
//                     )}
//                           {worker?.type === "admin" && (
//                         <a
//                             onClick={() => setCurrentPage("operacoes")}
//                             className={
//                                 currentPage === "operacoes" ? "active" : ""
//                             }
//                             role="button"
//                             tabIndex={0}
//                             aria-current={
//                                 currentPage === "operacoes" ? "page" : undefined
//                             }
//                         >
//                             <FontAwesomeIcon
//                                 icon={faShip }
//                                 className="yellow-icon"
//                             />
//                             Operacões 
//                         </a>
//                     )}

//                     <a
//                         onClick={handleLogout}
//                         className="logout-btn"
//                         role="button"
//                         tabIndex={0}
//                     >
//                          <FontAwesomeIcon
//                                 icon={faLock}
//                                 className="yellow-icon"
//                             />
//                         Encerrar Sessão
//                     </a>
//                 </nav>

//                 <main className="app-container">
//                     <div className="status-indicator">
//                         Sistema{" "}
//                         {systemStatus === "online"
//                             ? "Operacional"
//                             : "Verificando..."}
//                     </div>

//                     <div className="search-container">
//                         <input
//                             type="text"
//                             placeholder="Buscar funcionário, setor ou equipamento..."
//                             aria-label="Campo de pesquisa do sistema"
//                         />
//                     </div>
//                     <div className="page-content">{renderPage()}</div>
//                 </main>
//             </div>
//         </>
//     );
// }

// export default App;
