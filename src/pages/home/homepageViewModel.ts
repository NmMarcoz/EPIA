import * as epiaServerProvider from "../../infra/providers/EpiaServerProvider"
import { Sector } from "../../utils/types/EpiaTypes";

export const getRoomInfos = async ():Promise<Sector>=>{
  const roomInfos = await epiaServerProvider.getSectorByCode("STD06");
  return roomInfos;
}

