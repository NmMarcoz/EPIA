export type Worker = {
    id: string;
    name: string;
    registrationNumber: string;
    email: string;
    function: string;
    cardId: string;
    type: string;
};

export type Sector = {
    id: string;
    code: string;
    name: string;
    rules: string[];
};

export type Log = {
    id: string;
    worker: {
        _id: string;
        name: string;
        registrationNumber: string;
        email: string;
        function: string;
        cardId: string;
        type: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    sector: {
        _id: string;
        code: string;
        name: string;
        rules: string[];
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    removedEpi: string | null;
    remotionHour: string;
    allEpiCorrects: boolean;
    createdAt: string;
};

export type Notification = {
    type: string;
    data: {
        message: string;
        summary: string;
        log: {
            worker: string;
            sector: string;
            removedEpi: string[];
            remotionHour: string;
            allEpiCorrects: boolean;
            notify: boolean;
            _id: string;
            createdAt: string;
            updatedAt: string;
            __v: number;
        };
    };
};

export interface UserSession {
    _id: string | null;
    allCorrect: boolean;
    cardId: string;
}
