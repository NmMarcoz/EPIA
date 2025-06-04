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
    code: string,
    name:string,
    rules: string[]
}