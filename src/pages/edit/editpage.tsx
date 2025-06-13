"use client";

import { useState } from "react";
import "../../globals.css";
import "./editpage.css";
import { invoke } from "@tauri-apps/api/core";
import { Sector } from "../../utils/types/EpiaTypes";
import { toast } from "sonner";

interface EditPageProps {
    sector: Sector;
    onSectorUpdate?: (updatedSector: Sector) => void;
}

const EditPage = (props: EditPageProps) => {
    const [sectorData, setSectorData] = useState<Sector>({
        ...props.sector
    });
    
    const handleInputChange = (field: keyof Sector, value: string | string[]) => {
        setSectorData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRequirementChange = (index: number, value: string) => {
        const newRules = [...sectorData.rules];
        newRules[index] = value;
        handleInputChange('rules', newRules);
    };

    const handleAddRequirement = () => {
        handleInputChange('rules', [...sectorData.rules, '']);
    };

    const handleRemoveRequirement = (index: number) => {
        const newRules = sectorData.rules.filter((_, i) => i !== index);
        handleInputChange('rules', newRules);
    };

    const handleSaveChanges = async () => {
        try {
            const updates: Record<string, any> = {
                name: sectorData.name, // Sempre envie o name
                rules: sectorData.rules // Sempre envie as rules
            };

            const updatedSector = await invoke<Sector>('update_sector', {
                code: props.sector.code,
                sector: updates
            });

            toast.success('Setor atualizado com sucesso!');
            
            if (props.onSectorUpdate) {
                props.onSectorUpdate(updatedSector);
            }
        } catch (error) {
            console.error('Erro ao atualizar setor:', error);
            toast.error('Erro ao salvar alterações');
        }
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
                        <label className="n1">Nome</label>
                        <input className="enter"
                            type="text"
                            value={sectorData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Código</label>
                        <input
                            type="text"
                            value={sectorData.code}
                            disabled
                            className="disabled-input"
                        />
                    </div>
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
                        {sectorData.rules.map((rule, index) => (
                            <div className="form-group requirement-item" key={index}>
                                <label>Item {index + 1}</label>
                                <div className="requirement-input-group">
                                    <input
                                        type="text"
                                        value={rule}
                                        onChange={(e) =>
                                            handleRequirementChange(index, e.target.value)  
                                        }
                                    />
                                    <button 
                                        className="remove-button"
                                        onClick={() => handleRemoveRequirement(index)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="button-container">
                        <button 
                            className="add-button"
                            onClick={handleAddRequirement}
                        >
                            Adicionar Item
                        </button>
                        <button
                            className="save-button"
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