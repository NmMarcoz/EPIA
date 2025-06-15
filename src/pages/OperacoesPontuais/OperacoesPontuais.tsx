"use client";

import type React from "react";
import { useState } from "react";
import "./OperacoesPontuais.css";

const OperacoesPontuais: React.FC = () => {
    const [selectedArea, setSelectedArea] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [selectedEpis, setSelectedEpis] = useState<string[]>([]);

    const areas = [
        "STD01 - Área de Carga",
        "STD02 - Área de Descarga",
        "STD03 - Pátio de Contêineres",
        "STD04 - Oficina Mecânica",
        "STD05 - Área de Combustível",
        "STD06 - Sala de Marcenaria",
        "STD07 - Área de Soldagem",
        "STD08 - Depósito Geral",
    ];

    const episDisponiveis = [
        "Capacete de Segurança",
        "Óculos de Proteção",
        "Protetor Auricular",
        "Máscara Respiratória",
        "Luvas de Segurança",
        "Colete Refletivo",
        "Calçado de Segurança",
        "Cinto de Segurança",
    ];

    const handleEpiChange = (epi: string) => {
        setSelectedEpis((prev) =>
            prev.includes(epi)
                ? prev.filter((item) => item !== epi)
                : [...prev, epi]
        );
    };

    const handleAtivar = () => {
        if (selectedArea && dateTime && selectedEpis.length > 0) {
            alert(
                `Operação pontual ativada para ${selectedArea} em ${new Date(
                    dateTime
                ).toLocaleString("pt-BR")}`
            );
            // Reset form
            setSelectedArea("");
            setDateTime("");
            setSelectedEpis([]);
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Operações Pontuais</h1>
                <p>
                    Configure requisições temporárias de EPI para áreas
                    específicas
                </p>
            </div>

            <div className="main-content">
                <div className="form-columns">
                    {/* Coluna 1: Área Portuária */}
                    <div className="form-column">
                        <div className="column-header">
                            <div className="column-icon area-icon">🏭</div>
                            <h2>Área Portuária</h2>
                        </div>
                        <div className="column-content">
                            <div className="form-group">
                                <label htmlFor="area-select">
                                    Selecione a área *
                                </label>
                                <select
                                    id="area-select"
                                    value={selectedArea}
                                    onChange={(e) =>
                                        setSelectedArea(e.target.value)
                                    }
                                    className="form-select"
                                >
                                    <option value="">
                                        Selecione uma área...
                                    </option>
                                    {areas.map((area, index) => (
                                        <option key={index} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Data e Hora */}
                    <div className="form-column">
                        <div className="column-header">
                            <div className="column-icon datetime-icon">📅</div>
                            <h2>Data e Hora</h2>
                        </div>
                        <div className="column-content">
                            <div className="form-group">
                                <label htmlFor="datetime-input">
                                    Defina quando *
                                </label>
                                <input
                                    id="datetime-input"
                                    type="datetime-local"
                                    value={dateTime}
                                    onChange={(e) =>
                                        setDateTime(e.target.value)
                                    }
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Coluna 3: EPIs Requeridos */}
                    <div className="form-column epi-column">
                        <div className="column-header">
                            <div className="column-icon epi-icon">🛡️</div>
                            <h2>EPIs Requeridos</h2>
                            <span className="epi-counter">
                                {selectedEpis.length} selecionados
                            </span>
                        </div>
                        <div className="column-content">
                            <label>Selecione os EPIs necessários *</label>
                            <div className="checkbox-list">
                                {episDisponiveis.map((epi, index) => (
                                    <div key={index} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            id={`epi-${index}`}
                                            checked={selectedEpis.includes(epi)}
                                            onChange={() =>
                                                handleEpiChange(epi)
                                            }
                                        />
                                        <label htmlFor={`epi-${index}`}>
                                            {epi}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-primary" onClick={handleAtivar}>
                        Ativar Operação Pontual
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OperacoesPontuais;
