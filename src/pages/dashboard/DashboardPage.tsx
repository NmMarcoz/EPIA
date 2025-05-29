import { invoke } from "@tauri-apps/api/core";
import React, { useEffect } from "react";
import "../../globals.css";
const DashboardPage = () => {
    const runDashboard = async () => {
        console.log("....");
        const result = (await invoke("run_external_script")) as string;
        console.log("result", result);
        window.open(result, "_blank");
    };
    useEffect(() => {
        runDashboard();
    }, []);
    return (
        <div className="container">
            <section className="content">
                <h2>Dashboard</h2>
                <p>Bem vindo a área de visualização dos dados</p>
                <iframe
                    src="http://127.0.0.1:8050/"
                    title="Dashboard Python"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    allow="fullscreen"
                />
            </section>
        </div>
    );
};

export default DashboardPage;
