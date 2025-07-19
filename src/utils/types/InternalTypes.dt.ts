export type ConfigState = {
    // Sources de Video e Modelo
    modelPath: string;
    sources: string[];
    // Performance
    logInterval: number;
    frameCount: number;
};