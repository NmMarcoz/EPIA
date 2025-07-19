import { ConfigState } from "../../utils/types/InternalTypes.dt";
import { readFileSync, writeFileSync, writeSync } from "fs";
import {
    writeTextFile,
    BaseDirectory,
    readTextFile,
} from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";

export const saveConfig = async (config: ConfigState, path:string) => {
    try {
        const jsonString = JSON.stringify(config);
        console.log("config: ", jsonString);
        await invoke("save_file",{
          path:path,
          content:jsonString
        })
    } catch (error) {
        console.log("error saving conffig", error);
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
        return parsed;
    } catch (error) {
        console.error("Error retrieving config:", error);
        return null;
    }
};
