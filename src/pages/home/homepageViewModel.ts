import * as epiaServerProvider from "../../infra/providers/EpiaServerProvider"
import { Sector } from "../../utils/types/EpiaTypes";
import {load} from "@tauri-apps/plugin-store"
import { ConfigState } from "../../utils/types/InternalTypes.dt";
import { invoke } from "@tauri-apps/api/core";
export const getRoomInfos = async ():Promise<Sector>=>{
  const roomInfos = await epiaServerProvider.getSectorByCode("STD06");
  return roomInfos;
}

export const getJuliaParameters = async(debug = false):Promise<string> =>{
  const store = await load("julia_config.json", { autoSave: false });
  const file = await store.get("config") as string;
  const config = JSON.parse(file) as ConfigState;
  const cliParameters = `--source ${config.sources[0].source} --sector ${config.sources[0].sector} --interval ${config.logInterval} --processed_fps ${config.frameCount} ${debug ? "--debug" : ""} --model-path ${config.modelPath}`
  console.log("cli parameters", cliParameters);
  return cliParameters
}

export const launchJulia = async(debug = false):Promise<void> =>{
  const cliParameters = await getJuliaParameters(debug);
  console.log("cli parameters", cliParameters)
  await invoke("run_ia", {
    iaName: "detect_alternate_webcam",
    args: cliParameters
  })
}
