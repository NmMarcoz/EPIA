import "./homepage.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { RoomInfos } from "../../utils/types/RoomInfos";
import { WebcamCapture } from "../webcam/WebcamModal";
import "../../globals.css";
export const Homepage = () => {
    const [requirements, setRequirements] = useState<RoomInfos>();
    useEffect(() => {
        const getRoomInfos = async () => {
            const response = (await invoke("get_room_infos")) as RoomInfos;
            setRequirements(response);
        };
        getRoomInfos();
        const ip_response = async()=>{
            return await invoke("show_ip");
        }
        console.log("ip response", ip_response());
        
    }, []);
    return (
        <div className="container">
            <div className="homepage-container">
                <div className="header">
                    <h2>{requirements?.name_id ?? "carregando"}</h2>
                    <p>{requirements?.subname}</p>
                </div>
                <div className="section-container">
                    <section className="right-section">
                        <div className="box">
                            <h2>Área do funcionário</h2>
                            <p>Confira se suas informações cadastrais batem.</p>
                        </div>
                        <div className="basic-container">
                            <div className="box">
                                <div className="box">
                                    <div>
                                        <div className="employee-info">
                                            <a>Nome</a>
                                            <h2>José Velares</h2>
                                        </div>
                                        <div className="employee-info">
                                            <a>Cargo</a>
                                            <h2>Operador de Máquina</h2>
                                        </div>
                                        <div className="employee-info">
                                            <a>Taxa de Esquecimento de EPI</a>
                                            <h2>12%</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="basic-container">
                            <WebcamCapture />
                        </div>
                    </section>

                    <section className="left-section">
                        <div className="box">
                            <h2>Lista de Requerimentos</h2>
                            <p>
                                Os seguintes itens são necessários para adentrar
                            </p>
                        </div>
                        <div className="title-container">
                            <div className="basic-container">
                                <div className="box">
                                    {requirements?.equipments.map(
                                        (item, index) => (
                                            <p>{item}</p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
