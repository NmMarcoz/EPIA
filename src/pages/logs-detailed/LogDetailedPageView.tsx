// views/LogDetailed.tsx
import React from "react";
import { useParams } from "react-router";
import "./LogDetailedStyle.css";
import { useLogDetailedViewModel } from "./LoDetailedPageViewModel";

const LogDetailed: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const {
    log,
    isLoading,
    error,
    formattedDate,
    hasMissingItems,
    hasRules
  } = useLogDetailedViewModel(logId);

  if (isLoading) 
    return <div className="log-detailed-container">Carregando...</div>;
  
  if (error) 
    return <div className="log-detailed-container">{error}</div>;
  
  if (!log) 
    return <div className="log-detailed-container">Log não encontrado.</div>;

  return (
    <div className="log-detailed-container">
      <div className="log-detailed-boxes">
        {/* Box 1: Detalhes do Log */}
        <div className="log-detailed-box">
          <h2>Detalhes do Log</h2>
          <div>Gerado em: <b>{formattedDate}</b></div>
          <div>Setor <b>{log.sector.name}</b></div>
          
          <h2 style={{ marginTop: 16 }}>Objetos em Falta</h2>
          {hasMissingItems ? (
            (Array.isArray(log.removedEpi) ? log.removedEpi : (typeof log.removedEpi === "string" ? [log.removedEpi] : [])).map((item, idx) => (
              <div key={idx}><b>Item</b> {item}</div>
            ))
          ) : (
            <div>Nenhum item em falta</div>
          )}
        </div>

        {/* Box 2: Detalhes do Setor */}
        <div className="log-detailed-box">
          <h2>Setor</h2>
          <div>Código <b>{log.sector.code}</b></div>
          <div>Nome <b>{log.sector.name}</b></div>
          <div>Id <b style={{ fontSize: 13 }}>{log.sector._id}</b></div>
          
          <h2 style={{ marginTop: 16 }}>Regras</h2>
          {hasRules ? (
            log.sector.rules.map((rule, idx) => (
              <div key={idx}><b>Item</b> {rule}</div>
            ))
          ) : (
            <div>Nenhuma regra</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogDetailed;