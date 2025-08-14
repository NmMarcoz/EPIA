"use client";


import "../../globals.css";
import "./EditPageStyle.css";
import { useSectorEditorViewModel } from "./EditPageViewModel";



export const EditPage = () => {
  const {
    state: { sector, loading },
    operations: { updateField, updateRule, addRule, removeRule, saveChanges }
  } = useSectorEditorViewModel();

  if (loading) return <div className="loading-spinner"></div>;
  if (!sector) return <div>Setor não encontrado</div>;

  return (
    <div className="editpage-container">
      <div className="editpage-content-area">
        <div className="editpage-card">
          <h2>Editar sala</h2>
          <p>Edite as propriedades da sala e salve o resultado no botão abaixo.</p>
          
          <div className="editpage-form-group">
            <label>Nome</label>
            <input
              type="text"
              value={sector.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          
          <div className="editpage-form-group">
            <label>Código</label>
            <input
              type="text"
              value={sector.code}
              disabled
              className="editpage-disabled-input"
            />
          </div>
        </div>

        <div className="editpage-requirements-card">
          <div className="editpage-requirements-header">
            <h2>Editar Requisitos</h2>
            <p>Edite os equipamentos necessários para adentrar a sala.</p>
          </div>
          
          <div className="editpage-requirements-container">
            {sector.rules.map((rule, index) => (
              <div className="editpage-requirement-item" key={index}>
                <div className="editpage-form-group">
                  <label>Item {index + 1}</label>
                  <div className="editpage-requirement-input-group">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                    />
                    <button
                      className="editpage-remove-button"
                      onClick={() => removeRule(index)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="editpage-button-container">
            <button className="editpage-add-button" onClick={addRule}>
              Adicionar Item
            </button>
            <button className="editpage-save-button" onClick={saveChanges}>
              Salvar Mudanças
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;