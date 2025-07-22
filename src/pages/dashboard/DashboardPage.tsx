import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

const DashboardPage = () => {
    const [dashUrl, setDashUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const runDashboard = async () => {
        const result = (await invoke("run_external_script", {
            scriptName: "graficoEPIA",
        })) as string;
        setDashUrl(result);
        setLoading(true);

        // Polling para saber quando o dashboard está pronto
        const checkDashboard = async () => {
            try {
                const response = await axios.get(dashUrl);
                console.log("Dashboard response:", response);
                if (response.status === 200) {
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch {
                setTimeout(checkDashboard, 700);
            }
        };

        setTimeout(checkDashboard, 1000);
    };

    useEffect(() => {
        runDashboard();
    }, []);

    return (

            <section className="dashboard-container">
                    {loading ? (
                        <div className="loading-dashboard">
                            <div className="loading-spinner"></div>
                            <p>Carregando dashboard...</p>
                        </div>
                    ) : (
                        <iframe
                            src={dashUrl}
                            title="Dashboard"
                          
                            width="100%"
                            height="100%"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            allow="fullscreen"
                        />
                    )}
            </section>
    );
};

export default DashboardPage;
