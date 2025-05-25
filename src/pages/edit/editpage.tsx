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
          <div className="search-bar">
          
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
    )
  }

  export default EditPage;