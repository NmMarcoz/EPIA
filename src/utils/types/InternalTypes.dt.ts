export type ConfigState = {
    // Sources de Video e Modelo
    modelPath: string;
    sources: {
      source: string,
      sector: string
    }[];
    // Performance
    logInterval: number;
    frameCount: number;
    sector: string;
};