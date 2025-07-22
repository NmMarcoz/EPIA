import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as epiaProvider from "../../infra/providers/EpiaServerProvider";
import { Log } from "../../utils/types/EpiaTypes";
import "./LogDetailed.css";

const LogDetailed: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const [log, setLog] = useState<Log | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      setIsLoading(true);
      try {
        if (logId) {
          const logData = await epiaProvider.getLogById(logId);
          setLog(logData);
        }
      } catch (error) {
        setLog(null);
      }
      setIsLoading(false);
    };
    fetchLog();
  }, [logId]);

  if (isLoading) return <div className="log-detailed-container">Carregando...</div>;
  if (!log) return <div className="log-detailed-container">Log não encontrado.</div>;

  return (
    <div className="log-detailed-container">
      <div className="log-detailed-boxes">
        <div className="log-detailed-box">
          <h2>Detalhes do Log</h2>
          <div>Gerado em: <b>{new Date(log.createdAt).toISOString().slice(0, 10)}</b></div>
          <div>Setor <b>{log.sector.name}</b></div>
          <h2 style={{ marginTop: 16 }}>Objetos em Falta</h2>
          {log.removedEpi && log.removedEpi.length > 0 ? (
            //@ts-ignore
            log.removedEpi.map((item, idx) => (
              <div key={idx}><b>Item</b> {item}</div>
            ))
          ) : (
            <div>Nenhum item em falta</div>
          )}
        </div>
        <div className="log-detailed-box">
          <h2>Setor</h2>
          <div>Código <b>{log.sector.code}</b></div>
          <div>Nome <b>{log.sector.name}</b></div>
          <div>Id <b style={{ fontSize: 13 }}>{log.sector._id}</b></div>
          <h2 style={{ marginTop: 16 }}>Regras</h2>
          {log.sector.rules && log.sector.rules.length > 0 ? (
            log.sector.rules.map((rule, idx) => (
              <div key={idx}><b>Item</b> {rule}</div>
            ))
          ) : (
            <div>Nenhuma regra</div>
          )}
        </div>
      </div>
      {/* <div className="log-detailed-conformidade">
        <h2>Conformidade?</h2>
        <button className="log-detailed-nao">Não</button>
      </div> */}
    </div>
  );
};

export default LogDetailed;
