"use client";

import React, { useState } from "react";
import { Camera, Shield } from "lucide-react";
import "./Acess.css";

const Acess: React.FC = () => {
  const [authMode, setAuthMode] = useState<"operator" | "admin">("operator");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

  return (
    <div className="access-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">EPIA</h2>
        </div>
        <div className="sidebar-icons">
          <button
            className={`sidebar-icon ${authMode === "operator" ? "active" : ""}`}
            onClick={() => setAuthMode("operator")}
            title="Acesso Operário"
          >
            <Shield size={24} />
            <span className="icon-label">Operário</span>
          </button>
          <button
            className={`sidebar-icon ${authMode === "admin" ? "active" : ""}`}
            onClick={() => setAuthMode("admin")}
            title="Acesso Administrador"
          >
            <Shield size={24} />
            <span className="icon-label">Admin</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-card">
          {authMode === "admin" ? (
            <div className="admin-form">
              <div className="auth-header">
                <Shield
                  size={48}
                  className="auth-icon admin-icon"
                />
                <h2 className="form-title">
                  Insira as<br />
                  credenciais de administrador.
                </h2>
              </div>

              <form className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    className="form-input"
                  />
                </div>

                <button
                  type="button"
                  className="auth-button admin-button"
                >
                  Autenticar
                </button>
              </form>

              <div className="auth-info">
                <p className="info-text">
                  <strong>Teste:</strong> admin@epia.com / admin123
                </p>
              </div>
            </div>
          ) : (
            <div className="operator-interface">
              <div className="auth-header">
                <Shield
                  size={48}
                  className="auth-icon operator-icon"
                />
                <h2 className="form-title">
                  Operário<br />
                  <span className="subtitle">Cartão</span>
                </h2>
              </div>

              <div className="webcam-container">
                <div className="webcam-placeholder">
                  {/* <Camera
                    size={64}
                    className="text-gray-400"
                  /> */}
                  <p>Área de leitura</p>
                </div>
                <div className="scan-overlay">
                  <div className="scan-frame"></div>
                </div>
              </div>

              <div className="scanning-status">
                <div className="status-indicator">
                  <div className="pulse-dot"></div>
                </div>
              </div>

              <button
                className="auth-button operator-button"
              >
                insira o cartão
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Acess;