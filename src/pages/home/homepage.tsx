import "./homepage.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { RoomInfos } from "../../utils/types/RoomInfos";
export const Homepage = () => {
    const [requirements, setRequirements] = useState<RoomInfos>();
    useEffect(()=>{
        const getRoomInfos = async () => {
            const response = await invoke("get_room_infos") as RoomInfos;
            setRequirements(response);
        }
        getRoomInfos();
    },[])
    return (
        <main className = "homepage-container">
            <div className="container">
                <section className="left-section">
                    <div className="basic-container">
                        <h1>{requirements?.name_id ?? "carregando"}</h1>
                        <p>{requirements?.subname}</p>
                    </div>
                    <div className="title-container">
                        <h2>Lista de Requerimentos</h2>
                        <div className="basic-container">
                            <div className="box">
                                {requirements?.equipments.map((item, index) => (
                                    <p>{item}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="right-section">
                    <div>
                        <h2>José Velares</h2>
                        <div className="basic-container">
                            <h2>teste</h2>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
