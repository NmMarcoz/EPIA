
import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useState } from "react";
import "../../globals.css";
import "./Dashboard.css";
import { Dash } from "../components/Dash";

const Geral = () => {


    const runDashboard = async () => {
        const result = (await invoke("run_external_script", {
            scriptName: "geral"
        })) as string;
        console.log("Dashboard URL:", result);
 
    };

    // const handleSelected = (dash: string) => {
    //     console.log("Selected dashboard:", dash);
    //     setSelectedDash(dash);
    //     setLoading(true);
    //     runDashboard(dash);
    // };
    // useEffect(() => {
    //     runDashboard();
    // },[props.scriptName]);

    return (
        <div className="container">
            <section className="content">
                <div className="dashboard-container">
                    {/* <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <button
                            onClick={() => handleSelected("graficoEPIA")}
                            style={{
                                fontWeight:
                                    selectedDash === "graficoEPIA"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            Gráficos Gerais
                        </button>
                        <button
                            onClick={() => handleSelected("alertas")}
                            style={{
                                fontWeight:
                                    selectedDash === "alertas"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            Alertas
                        </button>
                        <button
                            onClick={() => handleSelected("funcionarios")}
                            style={{
                                fontWeight:
                                    selectedDash === "funcionarios"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            Funcionarios
                        </button>
                        <button
                            onClick={() => handleSelected("estatistica")}
                            style={{
                                fontWeight:
                                    selectedDash === "estatistica"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            Estatistica
                        </button>
                    </div> */}
                    <Dash/>
                    {/* {loading ? (
                        <h2>carregando...</h2>
                    ) : dashUrl ? (
                        <iframe
                            src={"http://127.0.0.1:8050/"}
                            title="Dashboard"
                            style={{ width: "100%", height: 600, border: "1px solid #ccc", borderRadius: 8 }}
                        />
                    ) : (
                        <div>Selecione um dashboard.</div>
                    )} */}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
