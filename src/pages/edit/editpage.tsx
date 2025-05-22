"use client"

import { useState } from "react"
import "./editpage.css"

const EditPage = () => {
  const [roomName, setRoomName] = useState("Sala 24b")
  const [roomFunction, setRoomFunction] = useState("Estoque")
  const [requirements, setRequirements] = useState(["Botas", "Capacete", "Abafador"])

  const handleAddItem = () => {
    setRequirements([...requirements, ""])
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
  }

  const handleSaveChanges = () => {
    console.log({
      nome: roomName,
      funcao: roomFunction,
      requisitos: requirements,
    })
  }

  return (
    <div className="edit-page">
      <div className="sidebar">
        {/* icones a esquerda(fotografia e outros) */}
        {/* <div className="sidebar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
        <div className="sidebar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
        </div>
        <div className="sidebar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="8" width="4" height="12"></rect>
            <rect x="9" y="5" width="4" height="15"></rect>
            <rect x="17" y="2" width="4" height="18"></rect>
          </svg>
        </div> */}
      </div>
      <div className="main-content">
        <div className="search-bar">
          {/* barra de busca */}
          {/* <input type="text" placeholder="Buscar..." /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div className="content-area">
          <div className="card">
            <h2>Editar sala</h2>
            <p>Edite as propriedades da sala e salve o resultado no botão abaixo.</p>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Função</label>
              <input type="text" value={roomFunction} onChange={(e) => setRoomFunction(e.target.value)} />
            </div>
          </div>
          <div className="card requirements-card">
            <div className="requirements-header">
              <h2>Editar Requisitos</h2>
              <p>Edite os equipamentos necessários para adentrar a sala.</p>
            </div>
            <div className="requirements-container">
              {requirements.map((req, index) => (
                <div className="form-group" key={index}>
                  <label>Item {index + 1}</label>
                  <input type="text" value={req} onChange={(e) => handleRequirementChange(index, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="button-container">
              <button className="add-button" onClick={handleAddItem}>
                Adicionar Item
              </button>
            </div>
          </div>
          <button className="save-button" onClick={handleSaveChanges}>
            Salvar Mudanças
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPage
