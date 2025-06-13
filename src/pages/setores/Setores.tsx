import { useEffect, useState } from "react";
import "../../globals.css";
import { Sector } from "../../utils/types/EpiaTypes";
import * as epiaProvider from "../../infra/providers/EpiaServerProvider";
import { Toaster, toast } from "sonner";
import { SectorTable } from "../components/SectorTable";

interface setoresInterface {
    handleSectorClick: (sector: Sector) => void;
}

export const Setores = ({handleSectorClick}:setoresInterface) => {
    const [setores, setSetores] = useState<Sector[]>([]);
    useEffect(() => {
        const sectors = epiaProvider
            .getSectors()
            .catch((err) => {
                toast.error(err.message);
            })
            .then((sectoresResponse) => {
                setSetores(sectoresResponse!);
            });
    }, []);
    return (
        <div className="container">
            <div className="content">
                <h1>Tabela de setores</h1>
                <p>Bem vindo a área de informações dos setores cadastrados</p>
                <Toaster position="bottom-right" />
                {setores.length > 0 ? (
                    <SectorTable
                        handleSectorClick={handleSectorClick}
                        sectors={setores}
                    />
                ) : (
                    <h2>Sem setores encontrados...</h2>
                )}
            </div>
        </div>
    );
};
