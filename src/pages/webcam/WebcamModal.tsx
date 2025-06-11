import React, { useState, useEffect, useRef } from "react";
import "./WebcamModal.css";
import Webcam from "react-webcam";
import { invoke } from "@tauri-apps/api/core";

export const WebcamCapture = () => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
        null
    );
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <div>
            <button
                onClick={async () => {
                    console.log("clicou");
                    await invoke("run_ia")
                   // setIsModalOpen(true);
                }}
            >
                Abrir Webcam
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Fique parado</h2>
                        <p>
                            O sistema está processando a anáise, espere alguns
                            segundos
                        </p>
                        <div className="webcam-container">
                            <div className="webcam-wrapper">
                                {" "}
                                <Webcam className="webcam" height={300} width={400} />
                            </div>
                            <div className="button-webcam-container">
                                <button onClick={() => console.log("click")}>
                                    Tirar Foto
                                </button>
                                <button onClick={() => setIsModalOpen(false)}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
