import { Link, Outlet, useLocation } from "react-router";
import "./Sidebar.css";
import { useState } from "react";
import NotificationBell from "../notification-bell/NotificationBell";

export const SideBar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };
    
    const isActive = (path:string)=>{
      const location = useLocation();
      return location.pathname === path;
    }

    return (
        <main className="sidebar-container">
            <div className="header-sidebar-container">
                {/* Sidebar */}
                <div
                    className={`sidebar-flex ${isExpanded ? "expanded" : "collapsed"}`}
                >
                    <div className="container-logo">
                        <h2>Jul.Ia</h2>
                    </div>

                    <div className="content">
                        <nav>
                            <svg
                                className={`toggle-button ${isExpanded ? "" : "rotated"}`}
                                onClick={toggleSidebar}
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                            >
                                <path
                                    d="M24 4.5C20.1433 4.5 16.3731 5.64366 13.1664 7.78634C9.95963 9.92903 7.46027 12.9745 5.98436 16.5377C4.50845 20.1008 4.12228 24.0216 4.8747 27.8043C5.62711 31.5869 7.4843 35.0615 10.2114 37.7886C12.9386 40.5157 16.4131 42.3729 20.1957 43.1253C23.9784 43.8777 27.8992 43.4916 31.4623 42.0156C35.0255 40.5397 38.071 38.0404 40.2137 34.8336C42.3564 31.6269 43.5 27.8567 43.5 24C43.4945 18.83 41.4383 13.8732 37.7826 10.2174C34.1268 6.56167 29.1701 4.50546 24 4.5ZM24 40.5C20.7366 40.5 17.5465 39.5323 14.8331 37.7192C12.1197 35.9062 10.0048 33.3293 8.756 30.3143C7.50715 27.2993 7.1804 23.9817 7.81705 20.781C8.45371 17.5803 10.0252 14.6403 12.3327 12.3327C14.6403 10.0252 17.5803 8.4537 20.781 7.81704C23.9817 7.18039 27.2993 7.50714 30.3143 8.75599C33.3293 10.0048 35.9062 12.1197 37.7193 14.8331C39.5323 17.5465 40.5 20.7366 40.5 24C40.495 28.3745 38.7551 32.5685 35.6618 35.6618C32.5685 38.7551 28.3746 40.495 24 40.5ZM33 24C33 24.3978 32.842 24.7794 32.5607 25.0607C32.2794 25.342 31.8978 25.5 31.5 25.5H20.1206L23.5613 28.9387C23.7006 29.0781 23.8112 29.2436 23.8866 29.4257C23.962 29.6077 24.0008 29.8029 24.0008 30C24.0008 30.1971 23.962 30.3923 23.8866 30.5743C23.8112 30.7564 23.7006 30.9219 23.5613 31.0613C23.4219 31.2006 23.2564 31.3112 23.0744 31.3866C22.8923 31.462 22.6971 31.5008 22.5 31.5008C22.3029 31.5008 22.1078 31.462 21.9257 31.3866C21.7436 31.3112 21.5781 31.2006 21.4388 31.0613L15.4388 25.0613C15.2993 24.9219 15.1887 24.7565 15.1132 24.5744C15.0377 24.3923 14.9988 24.1971 14.9988 24C14.9988 23.8029 15.0377 23.6077 15.1132 23.4256C15.1887 23.2435 15.2993 23.0781 15.4388 22.9387L21.4388 16.9387C21.7202 16.6573 22.102 16.4992 22.5 16.4992C22.8981 16.4992 23.2798 16.6573 23.5613 16.9387C23.8427 17.2202 24.0008 17.602 24.0008 18C24.0008 18.398 23.8427 18.7798 23.5613 19.0613L20.1206 22.5H31.5C31.8978 22.5 32.2794 22.658 32.5607 22.9393C32.842 23.2206 33 23.6022 33 24Z"
                                    fill="#CCCCCC"
                                />
                            </svg>
                            <div style={{ position: "relative", display: "inline-block" }}>
                                <NotificationBell open={notificationOpen} onToggle={() => setNotificationOpen((v) => !v)} />
                            </div>
                            <ul className= {`sidebar-ul ${isExpanded ? "" : "collapsed"}`}>
                                <li className="sidebar-nav">
                                  <Link className = {isActive("/home") ? "active" : ""} to="/home">Inicio</Link>
                                </li>
                                <li className="sidebar-nav">
                                    <Link className = {isActive("/dashboard") ? "active" : ""} to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="sidebar-nav">
                                    <Link className = {isActive("/config") ? "active" : ""} to="/config">Configurar Jul.Ia</Link>
                                </li>
                                <li className="sidebar-nav">
                                    <Link className = {isActive("/logs") ? "active" : ""} to="/logs">Logs</Link>
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
