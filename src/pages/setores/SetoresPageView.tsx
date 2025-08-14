// views/Setores.tsx

import React from "react";
import { Toaster } from "sonner";
import { SectorTable } from "../../components/sector-table/SectorTable";
import { useSectorsViewModel } from "./SetoresPageViewModel";
// import { Sector } from "../../utils/types/EpiaTypes";
import "./SetoresPageStyles.css"

export const Setores = () => {
  const { sectors, isLoading, error, hasSectors } = useSectorsViewModel();

  return (
    <div className="container">
      <div className="content">
        <h1>Tabela de setores</h1>
        <p>Bem vindo a área de informações dos setores cadastrados</p>
        <Toaster position="bottom-right" />
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando setores...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <h2>Erro ao carregar setores</h2>
            <p>{error}</p>
          </div>
        ) : hasSectors ? (
          <SectorTable sectors={sectors} />
        ) : (
          <h2>Sem setores encontrados...</h2>
        )}
      </div>
    </div>
  );
};