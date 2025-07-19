import { ConfigState } from "../../utils/types/InternalTypes.dt";
import { invoke } from "@tauri-apps/api/core";
import {load} from "@tauri-apps/plugin-store"
export const saveConfig = async (config: ConfigState, path:string) => {
    try {
        const jsonString = JSON.stringify(config);
        console.log("config: ", jsonString);
        await invoke("save_file",{
          path:path,
          content:jsonString
        })
        const store = await load("julia_config.json", { autoSave: false });
        await store.set("config", jsonString);
        await store.save();
    } catch (error) {
        console.log("error saving config", error);
        return null;
    }
};

export const retrieveConfig = async (path:string): Promise<ConfigState | null> => {
    try {
        const file = (await invoke("open_file", {
            path: path,
        })) as string;
        const parsed = JSON.parse(file) as ConfigState;
        console.log("parsed", parsed);
        
        const store = await load("julia_config.json", { autoSave: false });
        await store.set("config", file);
        await store.save();
        
        return parsed;
    } catch (error) {
        console.error("Error retrieving config:", error);
        return null;
    }
};
