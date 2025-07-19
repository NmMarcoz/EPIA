"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Camera, Search, Shield } from "lucide-react";
import "./Acess.css";
import { Toaster } from "sonner";
import { Worker } from "../../utils/types/EpiaTypes.ts";
import { ToastContainer, toast } from "react-toastify";
import img from "../../assets/img/icon.png";
import epia from "../../assets/img/EPIA.png";
interface User {
    id: number | string;
    name: string;
    type: "operator" | "admin";
    email?: string;
    cardId?: string;
}

interface AccessProps {
    onLoginSuccess?: (worker: Worker | User) => void;
    handleWorker?: () => Promise<Worker>;
}

const Acess: React.FC<AccessProps> = ({ onLoginSuccess, handleWorker }) => {
    const [authMode, setAuthMode] = useState<"operator" | "admin">("operator");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [scanningStatus, setScanningStatus] = useState(
        "Aguardando cartão ou QR Code..."
    );

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validação temporária para teste
            if (email === "admin@epia.com" && password === "admin123") {
                const adminUser: User = {
                    id: 1,
                    name: "Administrador EPIA",
                    type: "admin",
                    email: email,
                };

                onLoginSuccess!(adminUser);
            } else {
                alert("Credenciais inválidas! Use: admin@epia.com / admin123");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao fazer login. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOperatorAccess = async () => {
        setScanningStatus("Processando...");
        setIsLoading(true);

        setTimeout(async () => {
            const worker = await handleWorker!().catch((error) => {
                console.error("Erro ao buscar trabalhador:", error);
                toast.error("Falha ao autenticar, verifique o cartão");
                setIsLoading(false);
                return;
            });
            onLoginSuccess!(worker!);

            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <div className="access-container">
                <ToastContainer position="top-right" />
                <div className="sidebar">
                    <div className="sidebar-header">
                        <img
                            src={epia}
                            alt=""
                            style={{
                                width: "150px",
                                height: "90px",
                                marginRight: "8px",
                            }}
                        />
                        {/* <h2 className="sidebar-title">EPIA</h2> */}
                    </div>

                    <div className="sidebar-icons">
                        <button
                            className={`sidebar-icon ${
                                authMode === "operator" ? "active" : ""
                            }`}
                            onClick={() => setAuthMode("operator")}
                            title="Acesso Operário"
                        >
                            <img
                                src={img}
                                alt=""
                                style={{ width: "24px", height: "24px" }}
                            />
                            <span className="icon-label">
                                <span style={{ color: " #FFD700" }}>Operário</span>
                            </span>
                        </button>

                        <button
                            className={`sidebar-icon ${
                                authMode === "admin" ? "active" : ""
                            }`}
                            onClick={() => setAuthMode("admin")}
                            title="Acesso Administrador"
                        >
                            <img
                                src={img}
                                alt=""
                                style={{ width: "24px", height: "24px" }}
                            />
                            <span className="icon-label">
                                <span style={{ color: " #FFD700" }}>Administrador</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="main-content">
                    <Toaster position="top-right" closeButton />
                    {/* Card Central */}
                    <div className="content-card">
                        {authMode === "admin" ? (
                            // Formulário de Login Administrador
                            <div className="admin-form">
                                <div className="auth-header">
                                    <Shield
                                        size={48}
                                        className="auth-icon admin-icon"
                                    />
                                    <h2 className="form-title">
                                        Insira as
                                        <br />
                                        credenciais de administrador.
                                    </h2>
                                </div>

                                <form
                                    onSubmit={handleAdminLogin}
                                    className="login-form"
                                >
                                    <div className="form-group">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Digite seu email"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Senha
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Digite sua senha"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="auth-button admin-button"
                                    >
                                        {isLoading
                                            ? "Autenticando..."
                                            : "Autenticar"}
                                    </button>
                                </form>

                                <div className="auth-info">
                                    <p className="info-text">
                                        <strong>Teste:</strong> admin@epia.com /
                                        admin123
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Interface Operário - Webcam
                            <div className="operator-interface">
                                <div className="auth-header">
                                    <Shield
                                        size={48}
                                        className="auth-icon operator-icon"
                                    />
                                    <h2 className="form-title">
                                        Acesso Operário
                                        <br />
                                        <span className="subtitle">
                                            Cartão ou QR Code
                                        </span>
                                    </h2>
                                </div>

                                <div className="webcam-container">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="webcam-video"
                                    />
                                    {!isWebcamActive && (
                                        <div className="webcam-placeholder">
                                            <Camera
                                                size={64}
                                                className="text-gray-400"
                                            />
                                            <p>Ativando câmera...</p>
                                        </div>
                                    )}
                                    <div className="scan-overlay">
                                        <div className="scan-frame"></div>
                                    </div>
                                </div>

                                <div className="scanning-status">
                                    <p className="status-text">
                                        {scanningStatus}
                                    </p>
                                    <div className="status-indicator">
                                        <div className="pulse-dot"></div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleOperatorAccess}
                                    disabled={isLoading}
                                    className="auth-button operator-button"
                                >
                                    {isLoading
                                        ? "Processando..."
                                        : "Simular Leitura (Teste)"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Acess;
