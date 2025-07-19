import { User } from "lucide-react";
import { createContext, ReactNode, useState } from "react";
import { Worker } from "../../utils/types/EpiaTypes";

type epiaContextType = {
    saveWorker: (worker: Worker) => void;
    getWorker: () => Worker | null;
};

export const EpiaContext = createContext<epiaContextType | undefined>(undefined);

export const EpiaProvider = ({ children }: { children: ReactNode })=> {
    const [worker, setWorker] = useState<Worker | null>(null);

    const saveWorker = (worker: Worker) => {
        console.log("salvou o worker no contexto");
        console.log("worker salvo no context", worker);
        setWorker(worker);
    };

    const getWorker = () => {
        console.log("entrou no get worker context")
        console.log("worker: ", worker);
        return worker;
    };

    return (
        <EpiaContext.Provider value={{ saveWorker, getWorker }}>
            {children}
        </EpiaContext.Provider>
    );
};
