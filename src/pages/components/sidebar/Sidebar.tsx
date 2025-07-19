import { Link, Outlet } from "react-router";
import "./Sidebar.css";
import { useState } from "react";

export const SideBar = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <main className="sidebar-container">
            <div className="header-sidebar-container">
                {/* Sidebar */}
                <div
                    className={`sidebar-flex ${isExpanded ? "expanded" : "collapsed"}`}
                >
                    <div className="container-logo">
                        <h2>Jul.Ia</h2>
                        <hr />
                    </div>

                    <div className="content">
                        <nav>
                            <button
                                className={`toggle-button ${isExpanded ? "" : "rotated"}`}
                                onClick={toggleSidebar}
                            >
                                ◄
                            </button>
                            <ul>
                                <li>
                                    <Link to="/home">Inicio</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/config">Configurar Jul.Ia</Link>
                                </li>
                                <li>
                                    <Link to="/logs">Logs</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Área principal: Header e Conteúdo */}
                <div className="aplication-sidebar-container">
                    <div className="header">
                        <nav className="nav-header">
                            <ul>
                                <li>
                                    <Link to="/home">Solicitar Modelos</Link>
                                </li>
                                <li>
                                    <Link to="/home">Minha organização</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="container">
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    );
};
