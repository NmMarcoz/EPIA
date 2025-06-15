import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useState } from "react";
import "../../globals.css";
import "./Dashboard.css";
import { Dash } from "../components/Dash";
import axios from "axios";


interface props {
    scriptName: string;
}
const DashboardPage = (props: props) => {
    const [selectedDash, setSelectedDash] = useState<string>("graficoEPIA");
    const [dashUrl, setDashUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const runDashboard = async () => {
        const result = (await invoke("run_external_script", {
            scriptName: props.scriptName,
        })) as string;
        setDashUrl(result);
        setLoading(true);

        // Polling para saber quando o dashboard está pronto
        const checkDashboard = async () => {
            try {
                const response = await axios.get(dashUrl);
                console.log("Dashboard response:", response);
                if(response.status === 200){
                    setLoading(false);
                }else{
                    setLoading(true);
                }
                
            } catch {
                setTimeout(checkDashboard, 700);
            }
        };
    
        setTimeout(checkDashboard, 1000);
    };

    // const handleSelected = (dash: string) => {
    //     console.log("Selected dashboard:", dash);
    //     setSelectedDash(dash);
    //     setLoading(true);
    //     runDashboard(dash);
    // };
    useEffect(() => {
        runDashboard();
    }, [props.scriptName]);

    return (
        <div className="dashboard-container">
            <section className="content">
                <div className="dashboard-container">
                    {loading ? (
                        <div className="loading-dashboard">
                            <div className="loading-spinner"></div>
                            <p>Carregando dashboard...</p>
                        </div>
                    ) : (
                        <iframe
                            src={dashUrl}
                            title="Dashboard"
                            className="dashboard-iframe"
                            width="100%"
                            height="100%"
                            style={{
                                width: "100%",
                                height: 700,
                                border: "1px solid #ccc",
                                borderRadius: 8,
                            }}
                            allow="fullscreen"
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
