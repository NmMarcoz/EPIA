"use client"

import type React from "react"
import { Camera, Shield } from "lucide-react"
import { Toaster } from "sonner"
import { ToastContainer } from "react-toastify"
import type { AccessViewProps } from "./AccessModel"
import img from "../../assets/img/icon.png"
import epia from "../../assets/img/EPIA.png"
import "./Acess.css"

const AccessView: React.FC<AccessViewProps> = ({
  authMode,
  email,
  password,
  isLoading,
  isWebcamActive,
  scanningStatus,
  videoRef,
  onAuthModeChange,
  onEmailChange,
  onPasswordChange,
  onAdminLogin,
  onOperatorAccess,
}) => {
  return (  // Componente principal de visualização de acesso
    <div className="access-container">
      <ToastContainer position="top-right" />
      <div className="sidebar">
        <div className="sidebar-header">
          <img
            src={epia || "/placeholder.svg"}
            alt=""
            style={{
              width: "150px",
              height: "90px",
              marginRight: "8px",
            }}
          />
        </div>
        <div className="sidebar-icons">
          <button
            className={`sidebar-icon ${authMode === "operator" ? "active" : ""}`}
            onClick={() => onAuthModeChange("operator")}
            title="Acesso Operário"
          >
            <img src={img || "/placeholder.svg"} alt="" style={{ width: "24px", height: "24px" }} />
            <span className="icon-label">
              <span style={{ color: " #FFD700" }}>Operário</span>
            </span>
          </button>
          <button
            className={`sidebar-icon ${authMode === "admin" ? "active" : ""}`}
            onClick={() => onAuthModeChange("admin")}
            title="Acesso Administrador"
          >
            <img src={img || "/placeholder.svg"} alt="" style={{ width: "24px", height: "24px" }} />
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
                <Shield size={48} className="auth-icon admin-icon" />
                <h2 className="form-title">
                  Insira as
                  <br />
                  credenciais de administrador.
                </h2>
              </div>
              <form onSubmit={onAdminLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="Digite seu email"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Digite sua senha"
                    className="form-input"
                    required
                  />
                </div>
                <button type="submit" disabled={isLoading} className="auth-button admin-button">
                  {isLoading ? "Autenticando..." : "Autenticar"}
                </button>
              </form>
              <div className="auth-info">
                <p className="info-text">
                  <strong>Teste:</strong> admin@epia.com / admin123
                </p>
              </div>
            </div>
          ) : (
            // Interface Operário - Webcam
            <div className="operator-interface">
              <div className="auth-header">
                <Shield size={48} className="auth-icon operator-icon" />
                <h2 className="form-title">
                  Acesso Operário
                  <br />
                  <span className="subtitle">Cartão ou QR Code</span>
                </h2>
              </div>
              <div className="webcam-container">
                <video ref={videoRef} autoPlay playsInline muted className="webcam-video" />
                {!isWebcamActive && (
                  <div className="webcam-placeholder">
                    <Camera size={64} className="text-gray-400" />
                    <p>Ativando câmera...</p>
                  </div>
                )}
                <div className="scan-overlay">
                  <div className="scan-frame"></div>
                </div>
              </div>
              <div className="scanning-status">
                <p className="status-text">{scanningStatus}</p>
                <div className="status-indicator">
                  <div className="pulse-dot"></div>
                </div>
              </div>
              <button onClick={onOperatorAccess} disabled={isLoading} className="auth-button operator-button">
                {isLoading ? "Processando..." : "Simular Leitura (Teste)"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccessView
