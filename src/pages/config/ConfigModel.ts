import { ConfigState } from "../../utils/types/InternalTypes.dt";
import { invoke } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";


export const saveConfig = async (config: ConfigState, path: string) => {
    try {
        const jsonString = JSON.stringify(config);
        console.log("config: ", jsonString);
        await invoke("save_file", {
            path: path,
            content: jsonString,
        });
        await storeConfig(config);
    } catch (error) {
        console.log("error saving config", error);
        return null;
    }
};

export const retrieveConfig = async (
    path: string,
): Promise<ConfigState | null> => {
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

export const storeConfig = async (config: ConfigState) => {
    try {
        const jsonString = JSON.stringify(config);
        console.log("config no store: ", jsonString)
        const store = await load("julia_config.json", { autoSave: false });
        await store.set("config", jsonString);
        await store.save();
    } catch (error) {
        console.log("error while storing the config", error);
    }
};

export const getStorageCOnfig = async (): Promise<ConfigState | null> => {
    try {
        const store = await load("julia_config.json", { autoSave: false });
        const config = await store.get("config") as string;
        if(config){
            return JSON.parse(config) as ConfigState;
        }
        return null
    } catch (error) {
        console.error("Error retrieving config from storage:", error);
        return null;
    }
}
