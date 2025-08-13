
export interface User {
    id: number | string;
    name: string;   
    type: "operator" | "admin";
    email?: string;
    cardId?: string;
}

export interface Worker {
    id: number | string;
    name: string;
}

export interface AccessProps {
    onLoginSuccess: (worker: Worker | User) => void;
    handleWorker: () => Promise<Worker>;
}

