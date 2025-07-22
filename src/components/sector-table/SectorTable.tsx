import { useEffect, useState } from "react";
import { Sector } from "../../utils/types/EpiaTypes";
import "./SectorTable.css";
import * as epiaServer from "../../infra/providers/EpiaServerProvider";
import { useNavigate } from "react-router";


export const SectorTable = () => {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleSectorClick = (sector: Sector) => {
        console.log('Sector clicked:', sector);
    };

    useEffect(()=>{
        // Fetch sectors from API or any data source
        const fetchSectors = async () => {
            const sectors = await epiaServer.getSectors();
            setSectors(sectors);
            setLoading(false);
        };
        fetchSectors();
    }, [])
     {return loading ? <div> <h1 className="title"> Carregando setores...</h1>... </div> :<div className="sector-table-container">
        <h1 className="title">Setores cadastrados</h1>
        <p className="subtitle">Seu plano atual permite até dois setores</p>
        <table className="table">
            <thead className="table-header"> 
                <tr className="header-row">
                    <th className="header-cell">Nome</th>
                    <th className="header-cell">ID</th>
                    <th className="header-cell">Código</th>
                    <th className="header-cell">Regras</th>
                    <th className="header-cell">Ações</th>
                </tr>
            </thead>
            <tbody className="table-body">
                {sectors.map((sector) => (
                    <tr key={sector.id} className="table-row">
                        <td className="table-cell">{sector.name}</td>
                        <td className="table-cell">{sector.id}</td>
                        <td className="table-cell">{sector.code}</td>
                        <td className="table-cell">{sector.rules.join(", ")}</td>
                        <td className="table-cell">
                            <button 
                                type="button" 
                                onClick={() => navigate(`/sectors/${sector.code}`)} 
                                className="edit-button"
                            >
                                editar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>}
};