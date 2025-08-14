// LogPage.tsx
import { useNavigate } from "react-router";
import { extractHourFromDateIso } from "../../utils/functions";
import { useLogsViewModel } from "./LogViewModel";
import "./LogPage.css";

export const LogPage = () => {
    const navigate = useNavigate();
    const {
        state: { logs, isLoading, currentPage, totalPages, hasLogs },
        handlers: { goToNextPage, goToPrevPage },
    } = useLogsViewModel();

    if (isLoading) {
        return (
            <div className="container">
                <h2>Logs de Acesso</h2>
                <p>Carregando logs...</p>
            </div>
        );
    }
    if (!hasLogs) {
        return (
            <div className="container">
                <h2>Logs de Acesso</h2>
                <p>Nenhum log encontrado.</p>
            </div>
        );
    }
    return (
        <div className="log-table-container">
            <h1 className="title">Logs de Conformidade</h1>
            <p className="subtitle">
                Acompanhe os registros de conformidade dos setores. <br />
                Clique em um para ver detalhes
            </p>

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
                            <tr
                                key={log.id}
                                className={
                                    log.allEpiCorrects
                                        ? "log-correct"
                                        : "log-incorrect"
                                }
                                onClick={() => navigate(`/logs/${log.id}`)}
                            >
                                <td>
                                    {new Date(
                                        log.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td>{extractHourFromDateIso(log.createdAt)}</td>
                                <td>{log.worker.name}</td>
                                <td>{log.sector.name}</td>
                                <td>{log.removedEpi || "-"}</td>
                                <td className="status-cell">
                                    {log.allEpiCorrects ? "Sim" : "Não"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Anterior
                    </button>
                    <span className="page-info">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
};
