import { useEffect, useState } from "react";
import "../../globals.css";
import { WebcamCapture } from "../webcam/WebcamModal";
import { invoke } from "@tauri-apps/api/core";
import { ToastContainer } from "react-toastify";
import GreetingCard from "./GreetingCard"; // Adjust the import path as necessary
import { Worker } from "../../utils/types/EpiaTypes";

interface props {
    worker: Worker;
}
export const InicioPage = ({ worker }: props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const runIa = () => {
        invoke("run_ia", {
            iaName: "detect_webcam",
        })
            .then(() => {
                console.log("ia process started");
                setLoading(false);
            })
            .catch((err) => {
                console.log("falha ao executar a ia");
            });
    };
    // useEffect(()=>{
    //      invoke("run_ia",{
    //         iaName: "detect_webcam"
    //      }).then(() => {
    //         console.log("IA process started");
    //         setLoading(false);
    //     }).catch((error) => {
    //         console.error("Error starting IA process:", error);
    //         setLoading(false);
    //     })
    //     console.log("rodei")
    // }, [loading])
    return (
        <div className="container">
            <div className="greeting-container">
                <ToastContainer position="top-right" />
                <GreetingCard worker={worker} />
                <section className="inicio-section">
                    <h1>
                        Se posicione corretamente, a checagem vai começar...
                    </h1>
                    {loading && <p>Carregando...</p>}
                </section>
            </div>
        </div>
    );
};
