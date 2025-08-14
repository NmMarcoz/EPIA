import { invoke } from "@tauri-apps/api/core";
import { Sector } from "../../utils/types/EpiaTypes";
import * as epiaServer from "../../infra/providers/EpiaServerProvider";


 const SectorService = {
  getSector: async (code: string): Promise<Sector> => {
    return await epiaServer.getSectorByCode(code);
  },

  updateSector: async (code: string, updates: Partial<Sector>): Promise<Sector> => {
    return await invoke<Sector>("update_sector", { code, sector: updates });
  }
};
export default SectorService;