"use client"

import type React from "react"
import type { LogViewProps } from "./LogModel"
import type { FormattedLog } from "./LogModel"


interface LogViewExtendedProps extends LogViewProps {
  logs: FormattedLog[]
  logStats: {
    total: number
    correct: number
    incorrect: number
    successRate: number
  }
}

const LogView: React.FC<LogViewExtendedProps> = ({ logs, isLoading, hasError, logStats, onRetry }) => {
  if (isLoading) {
    return (
      <div className="container">
        <div className="content">
          <h2>Logs de Acesso</h2>
          <div className="loading-container">
            <p>Carregando logs...</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="container">
        <div className="content">
          <h2>Logs de Acesso</h2>
          <div className="error-container">
            <p>Erro ao carregar logs.</p>
            <button onClick={onRetry} className="retry-button">
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!logs.length) {
    return (
      <div className="container">
        <div className="content">
          <h2>Logs de Acesso</h2>
          <div className="empty-container">
            <p>Nenhum log encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="content">
        <h2>Logs de Acesso</h2>

        {/* Estatísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-number">{logStats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card success">
            <span className="stat-number">{logStats.correct}</span>
            <span className="stat-label">Corretos</span>
          </div>
          <div className="stat-card error">
            <span className="stat-number">{logStats.incorrect}</span>
            <span className="stat-label">Incorretos</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{logStats.successRate}%</span>
            <span className="stat-label">Taxa de Sucesso</span>
          </div>
        </div>

        {/* Tabela de Logs */}
        <div className="table-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Funcionário</th>
                <th>Setor</th>
                <th>EPI Removido</th>
                <th>Todos EPIs Corretos?</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ backgroundColor: log.rowBackgroundColor }}>
                  <td>{log.formattedDate}</td>
                  <td>{log.formattedTime}</td>
                  <td>{log.worker.name}</td>
                  <td>{log.sector.name}</td>
                  <td>{log.removedEpi || "-"}</td>
                  <td style={{ fontWeight: 600, color: log.statusColor }}>{log.statusText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LogView
