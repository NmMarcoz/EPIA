"use client";

import { useEffect, useState } from "react";
import "../../globals.css";
import "./editpage.css";
import { invoke } from "@tauri-apps/api/core";
import { Sector } from "../../utils/types/EpiaTypes";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import * as epiaServer from "../../infra/providers/EpiaServerProvider";

interface EditPageProps {
    sector: Sector;
    onSectorUpdate?: (updatedSector: Sector) => void;
}

export const EditPage = () => {
    const [sector, setSectorData] = useState<Sector | null>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { sectorId } = useParams();
    useEffect(()=>{
      const fetchSector = async()=>{
        setLoading(true)
        const sector = await epiaServer.getSectorByCode(sectorId);
        setSectorData(sector);
        setLoading(false);
      }
      fetchSector();
    }, [sectorId])

    const handleInputChange = (
        field: keyof Sector,
        value: string | string[],
    ) => {
        setSectorData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRequirementChange = (index: number, value: string) => {
        const newRules = [...sector!.rules];
        newRules[index] = value;
        handleInputChange("rules", newRules);
    };

    const handleAddRequirement = () => {
        handleInputChange("rules", [...sector!.rules, ""]);
    };

    const handleRemoveRequirement = (index: number) => {
        const newRules = sector!.rules.filter((_, i) => i !== index);
        handleInputChange("rules", newRules);
    };

    const handleSaveChanges = async () => {
        try {
            const updates: Record<string, any> = {
                name: sector!.name, // Sempre envie o name
                rules: sector!.rules, // Sempre envie as rules
            };

            const updatedSector = await invoke<Sector>("update_sector", {
                code: sector!.code,
                sector: updates,
            });

            toast.success("Setor atualizado com sucesso!");
            navigate("/sectors")

        } catch (error) {
            console.error("Erro ao atualizar setor:", error);
            toast.error("Erro ao salvar alterações");
        }
    };
    {return loading ? <div className="loading-spinner"></div> : <div className="editpage-container">
        <div className="editpage-content-area">
            <div className="editpage-card">
                <h2>Editar sala</h2>
                <p>
                    Edite as propriedades da sala e salve o resultado no
                    botão abaixo.
                </p>
                <div className="editpage-form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        value={sector!.name}
                        onChange={(e) =>
                            handleInputChange("name", e.target.value)
                        }
                    />
                </div>
                <div className="editpage-form-group">
                    <label>Código</label>
                    <input
                        type="text"
                        value={sector!.code}
                        disabled
                        className="editpage-disabled-input"
                    />
                </div>
            </div>

            <div className="editpage-requirements-card">
                <div className="editpage-requirements-header">
                    <h2>Editar Requisitos</h2>
                    <p>
                        Edite os equipamentos necessários para adentrar a
                        sala.
                    </p>
                </div>
                <div className="editpage-requirements-container">
                    {sector!.rules.map((rule, index) => (
                        <div
                            className="editpage-requirement-item"
                            key={index}
                        >
                            <div className="editpage-form-group">
                                <label>Item {index + 1}</label>
                                <div className="editpage-requirement-input-group">
                                    <input
                                        type="text"
                                        value={rule}
                                        onChange={(e) =>
                                            handleRequirementChange(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <button
                                        className="editpage-remove-button"
                                        onClick={() =>
                                            handleRemoveRequirement(index)
                                        }
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="editpage-button-container">
                    <button
                        className="editpage-add-button"
                        onClick={handleAddRequirement}
                    >
                        Adicionar Item
                    </button>
                    <button
                        className="editpage-save-button"
                        onClick={handleSaveChanges}
                    >
                        Salvar Mudanças
                    </button>
                </div>
            </div>
        </div>
    </div>}

};

export default EditPage;
