"use client"

import type React from "react"
import { Toaster } from "sonner"
import { SectorTable } from "../components/SectorTable"
import type { SetoresViewProps } from "./SetoresModel"
import "../../globals.css"

const SetoresView: React.FC<SetoresViewProps> = ({ sectors, isLoading, hasError, onSectorClick }) => {
  return (
    <div className="container">
      <div className="content">
        <h1>Tabela de setores</h1>
        <p>Bem vindo a área de informações dos setores cadastrados</p>
        <Toaster position="bottom-right" />

        {isLoading ? (
          <div className="loading-container">
            <h2>Carregando setores...</h2>
          </div>
        ) : hasError ? (
          <div className="error-container">
            <h2>Erro ao carregar setores</h2>
            <p>Tente novamente mais tarde</p>
          </div>
        ) : sectors.length > 0 ? (
          <SectorTable handleSectorClick={onSectorClick} sectors={sectors} />
        ) : (
          <div className="empty-container">
            <h2>Sem setores encontrados...</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default SetoresView
