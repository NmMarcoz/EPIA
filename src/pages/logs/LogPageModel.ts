import { Log } from "../../utils/types/EpiaTypes"
import * as epiaProvider from "../../infra/providers/EpiaServerProvider"


export const LogService = {
  getLogs: async (): Promise<Log[]> => {
    return await epiaProvider.getLogs();
  }
};