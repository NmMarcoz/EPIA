import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useState } from "react";
import "../../globals.css";
import "./Dashboard.css"
import { Dash } from "../components/Dash";
const DashboardPage = () => {
    const [selectedDash, setSelectedDash] = useState<string>("alertas");
    const [dashUrl, setDashUrl] = useState<string>("");

    const runDashboard = async (scriptName?: string) => {
        const result = (await invoke("run_external_script", {
            scriptName: selectedDash,
        })) as string;
        setDashUrl(result); // Salva a URL do dash para exibir no iframe
    };

    useEffect(() => {
        runDashboard(selectedDash);
    }, [selectedDash]);

    return (
        <div className="container">
            <section className="content">
                <div className="dashboard-container">
                    <h2>Dashboard</h2>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <button onClick={() => setSelectedDash("graficoEPIA")}
                            style={{ fontWeight: selectedDash === "graficoEPIA" ? "bold" : "normal" }}>
                            Gráficos Gerais
                        </button>
                        <button onClick={() => setSelectedDash("alertas")}
                            style={{ fontWeight: selectedDash === "alertas" ? "bold" : "normal" }}>
                            Alertas
                        </button>
                        <button onClick={() => setSelectedDash("funcionarios")}
                            style={{ fontWeight: selectedDash === "funcionarios" ? "bold" : "normal" }}>
                            Funcionarios
                        </button>
                        <button onClick={() => setSelectedDash("estatistica")}
                            style={{ fontWeight: selectedDash === "estatistica" ? "bold" : "normal" }}>
                            Estatistica
                        </button>
                    </div>
                    {dashUrl ? (
                        <Dash/>
                    ) : (
                        <div>Carregando dashboard...</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
