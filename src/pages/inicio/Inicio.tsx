import { useEffect, useState } from "react";
import "../../globals.css"
import { WebcamCapture } from "../webcam/WebcamModal";
import { invoke } from "@tauri-apps/api/core";
import { ToastContainer } from "react-toastify";
export const InicioPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(()=>{
         invoke("run_ia").then(() => {
            console.log("IA process started");
            setLoading(false);
        }).catch((error) => {
            console.error("Error starting IA process:", error);
            setLoading(false);
        })
    }, [])
    return (
        <div className="container">
            <ToastContainer position="top-right" />
            <section className="inicio-section">
                <h1>Se posicione corretamente, a checagem vai começar...</h1>
                {loading && <p>Carregando...</p>}
                
            </section>
        </div>
    );
}