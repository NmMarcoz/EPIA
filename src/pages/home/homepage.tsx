import "./homepage.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
export const Homepage = () => {
    const [requirements, setRequirements] = useState(Array<string>());
    useEffect(()=>{
        const getRequirements = async () => {
            const response = await invoke("get_requirements") as Array<string>;
            setRequirements(response);
        }
        getRequirements();
    },[])
    return (
        <main className = "homepage-container">
            <div className="container">
                <section className="left-section">
                    <div className="basic-container">
                        <h1>Sala 24B</h1>
                        <p>Estoque</p>
                    </div>
                    <div className="title-container">
                        <h2>Lista de Requerimentos</h2>
                        <div className="basic-container">
                            <div className="box">
                                {requirements.map((item, index) => (
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
