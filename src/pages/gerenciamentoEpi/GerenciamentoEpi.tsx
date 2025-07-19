"use client"

import type React from "react"
import { useState } from "react"
import "./GerenciamentoEpi.css"

const GerenciamentoEpi: React.FC = () => {
  const [tempoTolerancia, setTempoTolerancia] = useState("5")
  const [unidadeTolerancia, setUnidadeTolerancia] = useState("min")
  const [horarioInicio, setHorarioInicio] = useState("08:00")
  const [horarioFim, setHorarioFim] = useState("17:00")

  const [episCadastrados, setEpisCadastrados] = useState([
    { id: 1, nome: "Capacete de Segurança", ativo: true },
    { id: 2, nome: "Óculos de Proteção", ativo: true },
    { id: 3, nome: "Protetor Auricular", ativo: false },
    { id: 4, nome: "Máscara Respiratória", ativo: true },
    { id: 5, nome: "Luvas de Segurança", ativo: true },
    { id: 6, nome: "Colete Refletivo", ativo: true },
    { id: 7, nome: "Calçado de Segurança", ativo: true },
    { id: 8, nome: "Cinto de Segurança", ativo: false },
    { id: 9, nome: "Protetor Facial", ativo: true },
    { id: 10, nome: "Respirador PFF2", ativo: true },
  ])

  const toggleEpiStatus = (id: number) => {
    setEpisCadastrados((prev) => prev.map((epi) => (epi.id === id ? { ...epi, ativo: !epi.ativo } : epi)))
  }

  const handleSalvar = () => {
    const configuracoes = {
      tempoTolerancia: `${tempoTolerancia} ${unidadeTolerancia}`,
      horarioObrigatorio: `${horarioInicio} - ${horarioFim}`,
      episAtivos: episCadastrados.filter((epi) => epi.ativo).length,
    }

    alert(
      `Configurações salvas:\n- Tolerância: ${configuracoes.tempoTolerancia}\n- Horário: ${configuracoes.horarioObrigatorio}\n- EPIs ativos: ${configuracoes.episAtivos}`,
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <h1>Gerenciamento de EPI</h1>
        <p>Configure tolerâncias, horários e gerencie EPIs cadastrados</p>
      </div>

      {/* Main Content - Two Panels */}
      <div className="main-panels">
        {/* Panel 1: Configurações de Tempo e Horário */}
        <div className="config-panel">
          <div className="panel-header">
            <div className="panel-title">
              <div className="panel-icon config-icon">⚙️</div>
              <h2>Configurações de Tempo</h2>
            </div>
            <p className="panel-description">Defina tolerâncias e horários obrigatórios</p>
          </div>

          <div className="panel-content">
            {/* Tolerância */}
            <div className="config-section">
              <div className="section-header">
                <div className="section-icon">🕐</div>
                <h3>Tempo de Tolerância</h3>
              </div>
              <p className="section-description">Tempo permitido sem EPI antes do alerta</p>
              <div className="tolerance-config">
                <input
                  type="number"
                  value={tempoTolerancia}
                  onChange={(e) => setTempoTolerancia(e.target.value)}
                  className="tolerance-input"
                  min="1"
                  max="60"
                />
                <select
                  value={unidadeTolerancia}
                  onChange={(e) => setUnidadeTolerancia(e.target.value)}
                  className="tolerance-unit"
                >
                  <option value="seg">segundos</option>
                  <option value="min">minutos</option>
                </select>
              </div>
            </div>

            {/* Horários */}
            <div className="config-section">
              <div className="section-header">
                <div className="section-icon">⏰</div>
                <h3>Horários Obrigatórios</h3>
              </div>
              <p className="section-description">Período em que o uso de EPI é obrigatório</p>
              <div className="schedule-config">
                <div className="time-group">
                  <label>Início</label>
                  <input
                    type="time"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                    className="time-input"
                  />
                </div>
                <div className="time-separator">até</div>
                <div className="time-group">
                  <label>Fim</label>
                  <input
                    type="time"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                    className="time-input"
                  />
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="config-summary">
              <h4>Resumo da Configuração</h4>
              <div className="summary-items">
                <p>• Tolerância: {tempoTolerancia} {unidadeTolerancia}</p>
                <p>• Horário: {horarioInicio} às {horarioFim}</p>
                <p>• EPIs ativos: {episCadastrados.filter((epi) => epi.ativo).length}</p>
              </div>
            </div>
          </div>
        </div>

     
        <div className="epi-panel">
          <div className="panel-header">
            <div className="panel-title">
              <div className="panel-icon epi-icon">🛡️</div>
              <h2>EPIs Cadastrados</h2>
              <button className="add-btn">+ Adicionar</button>
            </div>
            <p className="panel-description">Gerencie os EPIs e seus status de ativação</p>
          </div>

          <div className="panel-content">
            <div className="epi-list">
              {episCadastrados.map((epi) => (
                <div key={epi.id} className="epi-item">
                  <div className="epi-info">
                    <div className="epi-icon-small">🛡️</div>
                    <span className="epi-name">{epi.nome}</span>
                  </div>
                  <button
                    onClick={() => toggleEpiStatus(epi.id)}
                    className={`epi-status ${epi.ativo ? "ativo" : "inativo"}`}
                  >
                    {epi.ativo ? "Ativo" : "Inativo"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Footer */}
          <div className="panel-footer">
            <div className="stat-item">
              <span className="stat-label">Total de EPIs:</span>
              <span className="stat-value">{episCadastrados.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">EPIs ativos:</span>
              <span className="stat-value active">{episCadastrados.filter((epi) => epi.ativo).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="form-actions">
        <button className="btn-primary" onClick={handleSalvar}>
          Salvar Configurações
        </button>
      </div>
    </div>
  )
}

export default GerenciamentoEpi
