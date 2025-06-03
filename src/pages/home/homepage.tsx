import "./homepage.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { RoomInfos } from "../../utils/types/RoomInfos";
import { WebcamCapture } from "../webcam/WebcamModal";
import { Worker } from "../../utils/types/EpiaTypes.ts";
import "../../globals.css";

interface HomePageProps {
    worker: Worker,
}

export const Homepage = (props: HomePageProps) => {
    const [requirements, setRequirements] = useState<RoomInfos>();
    useEffect(() => {
        const getRoomInfos = async () => {
            const response = (await invoke("get_room_infos")) as RoomInfos;
            setRequirements(response);
        };
        getRoomInfos();
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
                                            <h2>{props?.worker?.name || "carregando"}</h2>
                                        </div>
                                        <div className="employee-info">
                                            <a>Cargo</a>
                                            <h2>{props?.worker?.function || "carregando"}</h2>
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
                                        (item) => (
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
