import { useEffect, useState } from "react"
import * as epiaProvider from "../../infra/providers/EpiaServerProvider"
import { Log } from "../../utils/types/EpiaTypes"

export const LogPage = () => {
    const [logs, setLogs] = useState<Log[]>([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            const logs = await epiaProvider.getLogs();
            setLogs(logs);
            setIsLoading(false);
        };
        fetchLogs();
    }, []);

    if (isLoading) return <div className="container"><h2>Logs de Acesso</h2><p>Carregando logs...</p></div>;
    if (!logs.length) return <div className="container"><h2>Logs de Acesso</h2><p>Nenhum log encontrado.</p></div>;

    return (
        <div className="container">
            <div className="content">
                <h2>Logs de Acesso</h2>
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
                        {logs.map((log) => (
                            <tr key={log.id} style={{ textAlign: 'center', background: log.allEpiCorrects ? '#e6ffe6' : '#ffe6e6' }}>
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
        </div>
    )
}