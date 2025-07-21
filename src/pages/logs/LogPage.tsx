import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import * as epiaProvider from "../../infra/providers/EpiaServerProvider"
import { Log } from "../../utils/types/EpiaTypes"
import "./LogPage.css"


export const LogPage = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState<Log[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            const logs = await epiaProvider.getLogs();
            setLogs(logs);
            setIsLoading(false);
        };
        fetchLogs();
    }, []);


    // Paginação
    const totalPages = Math.ceil(logs.length / logsPerPage);
    const paginatedLogs = logs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

    if (isLoading) return <div className="container"><h2>Logs de Acesso</h2><p>Carregando logs...</p></div>;
    if (!logs.length) return <div className="container"><h2>Logs de Acesso</h2><p>Nenhum log encontrado.</p></div>;

    return (
        <div className="container">
            <h1 className="title">Logs de Conformidade</h1>
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #eee', padding: 8 }}>Data</th>
                            <th style={{ border: '1px solid #eee', padding: 8 }}>Hora</th>
                            <th style={{ border: '1px solid #eee', padding: 8 }}>Funcionário</th>
                            <th style={{ border: '1px solid #eee', padding: 8 }}>Setor</th>
                            <th style={{ border: '1px solid #eee', padding: 8 }}>EPI Removido</th>
                            <th style={{ border: '1px solid #eee', padding: 8 }}>Todos EPIs Corretos?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map((log) => (
                            <tr
                                key={log.id}
                                style={{ textAlign: 'center', background: log.allEpiCorrects ? '#e6ffe6' : '#ffe6e6', cursor: 'pointer' }}
                                onClick={() => navigate(`/logs/${log.id}`)}
                            >
                                <td style={{ border: '1px solid #eee', padding: 8 }}>{new Date(log.createdAt).toLocaleDateString()}</td>
                                <td style={{ border: '1px solid #eee', padding: 8 }}>{log.remotionHour}</td>
                                <td style={{ border: '1px solid #eee', padding: 8 }}>{log.worker.name}</td>
                                <td style={{ border: '1px solid #eee', padding: 8 }}>{log.sector.name}</td>
                                <td style={{ border: '1px solid #eee', padding: 8 }}>{log.removedEpi || '-'}</td>
                                <td style={{ border: '1px solid #eee', padding: 8, fontWeight: 600, color: log.allEpiCorrects ? '#2e7d32' : '#c62828' }}>{log.allEpiCorrects ? 'Sim' : 'Não'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Controles de Paginação */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 8 }}>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', background: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Anterior
                    </button>
                    <span style={{ margin: '0 12px' }}>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', background: currentPage === totalPages ? '#eee' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    )
}