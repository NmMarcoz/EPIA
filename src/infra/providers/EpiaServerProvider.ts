import axios from 'axios';
import { Sector, Worker } from '../../utils/types/EpiaTypes';

const epiaServer = axios.create({
    baseURL: 'http://localhost:3000', 
    timeout: 5000, 
})

export const getWorkerByCardId = async(cardId: string): Promise<Worker> => {
    try {
        console.log("card id", cardId);
        const worker = await epiaServer.get<Worker>(`/workers/cardId/${cardId}`);
        if(!worker){
            throw new Error("Falha ao autenticar, verifique o cartão");
        }
        return worker.data;
    } catch (err) {
        throw new Error("Falha ao autenticar, verifique o cartão");
    }
}

export const getSectors = async(): Promise<Sector[]> => {
    try {;
        const sectors = await epiaServer.get<Sector[]>(`/sectors`);
        if(!sectors){
            throw new Error("Falha ao buscar setoores");
        }
        return sectors.data;
    } catch (err) {
        throw new Error("Falha ao buscar setoores");
    }
}

export const getSectorByCode = async(sectorCode: string): Promise<Sector> => {
    try {
        const sector = await epiaServer.get<Sector>(`/sectors/${sectorCode}`);
        if(!sector){
            throw new Error("Falha ao buscar setor");
        }
        return sector.data;
    } catch (err) {
        throw new Error("Falha ao buscar setor");
    }
}