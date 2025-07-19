import { Link, Outlet } from "react-router";
import "./Sidebar.css";

export const SideBar = () => {
    return (
        <main className="sidebar-container">
            <div className="header-sidebar-container">
                {/* Sidebar */}
                <div className="sidebar-flex">
                    <div className="container-logo">
                        <h2>Jul.Ia</h2>
                        <hr />
                    </div>

                    <div className="content">
                        <nav>
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
                    <header className="header">
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
                    </header>

                    {/* Container para o conteúdo dinâmico da aplicação */}
                    <div className="container">
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    );
};
