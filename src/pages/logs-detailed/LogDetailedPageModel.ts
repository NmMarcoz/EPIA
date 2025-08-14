// models/LogModel.ts
import * as epiaProvider from "../../infra/providers/EpiaServerProvider";
import { Log } from "../../utils/types/EpiaTypes";

export const LogModel = {
  async fetchLogById(logId: string): Promise<Log | null> {
    try {
      return await epiaProvider.getLogById(logId);
    } catch (error) {
      console.error("Error fetching log:", error);
      return null;
    }
  }
};