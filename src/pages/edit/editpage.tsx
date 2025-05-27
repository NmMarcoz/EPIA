"use client";

import { useState } from "react";
import "../../globals.css";
import "./editpage.css";

const EditPage = () => {
    const [roomName, setRoomName] = useState("Sala 24b");
    const [roomFunction, setRoomFunction] = useState("Estoque");
    const [requirements, setRequirements] = useState([
        "Botas",
        "Capacete",
        "Abafador",
    ]);

    const handleAddItem = () => {
        setRequirements([...requirements, ""]);
    };

    const handleRequirementChange = (index: number, value: string) => {
        const newRequirements = [...requirements];
        newRequirements[index] = value;
        setRequirements(newRequirements);
    };

    const handleSaveChanges = () => {
        console.log({
            nome: roomName,
            funcao: roomFunction,
            requisitos: requirements,
        });
    };

    return (
        <div className="container">
            <div className="content-area">
                <div className="card">
                    <h2>Editar sala</h2>
                    <p>
                        Edite as propriedades da sala e salve o resultado no
                        botão abaixo.
                    </p>
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Função</label>
                        <input
                            type="text"
                            value={roomFunction}
                            onChange={(e) => setRoomFunction(e.target.value)}
                        />
                    </div>
                    <button
                            className="add-button"
                            onClick={handleSaveChanges}
                        >
                            Salvar Mudanças
                        </button>
                </div>
                <div className="card requirements-card">
                    <div className="requirements-header">
                        <h2>Editar Requisitos</h2>
                        <p>
                            Edite os equipamentos necessários para adentrar a
                            sala.
                        </p>
                    </div>
                    <div className="requirements-container">
                        {requirements.map((req, index) => (
                            <div className="form-group" key={index}>
                                <label>Item {index + 1}</label>
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) =>
                                        handleRequirementChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>
                    <div className="button-container">
                        <button className="add-button" onClick={handleAddItem}>
                            Adicionar Item
                        </button>
                        <button
                            className="add-button"
                            onClick={handleSaveChanges}
                        >
                            Salvar Mudanças
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
