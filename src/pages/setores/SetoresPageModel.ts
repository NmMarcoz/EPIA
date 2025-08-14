// models/SectorModel.ts
import * as epiaProvider from "../../infra/providers/EpiaServerProvider";
import { Sector } from "../../utils/types/EpiaTypes";

export const SectorModel = {
  async fetchSectors(): Promise<Sector[]> {
    try {
      return await epiaProvider.getSectors();
    } catch (error) {
      throw new Error("Falha ao carregar setores");
    }
  }
};