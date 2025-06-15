export type Worker = {
    id: string,
    name:string,
    registrationNumber:string,
    email:string,
    function:string,
    cardId:string,
    type: string
}

export type Sector = {
    id:string,
    code: string,
    name:string,
    rules: string[]
}


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

export type Notification={
  message: string,
  summary:string,
  type:string,
  consumed:boolean,
  createdAt: string,
  updatedAt: string,
  log:Log
}