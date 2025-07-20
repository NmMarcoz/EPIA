"use client"

import type React from "react"
import type { EditViewProps } from "./EditModel"
import "../../globals.css"
import "./Edit.css"

const EditView: React.FC<EditViewProps> = ({
  sectorData,
  isLoading,
  onInputChange,
  onRequirementChange,
  onAddRequirement,
  onRemoveRequirement,
  onSaveChanges,
}) => {
  return (
    <div className="container">
      <div className="content-area">
        <div className="card">
          <h2>Editar sala</h2>
          <p>Edite as propriedades da sala e salve o resultado no botão abaixo.</p>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={sectorData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Código</label>
            <input type="text" value={sectorData.code} disabled className="disabled-input" />
          </div>
        </div>

        <div className="card requirements-card">
          <div className="requirements-header">
            <h2>Editar Requisitos</h2>
            <p>Edite os equipamentos necessários para adentrar a sala.</p>
          </div>
          <div className="requirements-container">
            {sectorData.rules.map((rule, index) => (
              <div className="form-group requirement-item" key={index}>
                <label>Item {index + 1}</label>
                <div className="requirement-input-group">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => onRequirementChange(index, e.target.value)}
                    disabled={isLoading}
                  />
                  <button className="remove-button" onClick={() => onRemoveRequirement(index)} disabled={isLoading}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="add-button" onClick={onAddRequirement} disabled={isLoading}>
              Adicionar Item
            </button>
            <button className="save-button" onClick={onSaveChanges} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Mudanças"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditView
