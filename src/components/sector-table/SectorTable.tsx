import { Sector } from "../../utils/types/EpiaTypes";
import "./SectorTable.css";

interface SectorTableProps {
    sectors: Sector[];
    handleSectorClick: (sector:Sector) => void;
}

export const SectorTable = ({sectors, handleSectorClick}:SectorTableProps) => {
    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Regras</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sectors.map((sector) => (
                        <tr key={sector.id}>
                            <td>{sector.name}</td>
                            <td>{sector.id}</td>
                            <td>{sector.code}</td>
                            <td>{sector.rules.join(", ")}</td>
                            <td><button type="button" onClick={() => handleSectorClick(sector)} className="edit-button">
                                    editar
                                </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};