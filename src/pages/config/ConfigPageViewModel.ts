import { useState, useEffect } from "react";
import { ConfigState } from "../../utils/types/InternalTypes.dt";
import { 
    saveConfig, 
    retrieveConfig, 
    storeConfig, 
    getStorageCOnfig 
} from "./ConfigPageModel";
import { open, save } from "@tauri-apps/plugin-dialog";
import { toast } from "react-toastify";

export const useConfigViewModel = () => {
    const [activeTab, setActiveTab] = useState<"sources" | "performance">("sources");
    const [config, setConfig] = useState<ConfigState>({
        modelPath: "",
        sources: [
            { source: "", sector: "" },
            { source: "", sector: "" }
        ],
        logInterval: 5,
        frameCount: 5,
        sector: ""
    });

    useEffect(() => {
        const loadConfig = async () => {
            const storedConfig = await getStorageCOnfig();
            if (storedConfig) setConfig(storedConfig);
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        await storeConfig(config);
        toast.success("Configuração salva!");
    };

    const handleImport = async () => {
        const selected = await open({ multiple: false });
        if (selected) {
            const importedConfig = await retrieveConfig(selected);
            if (importedConfig) {
                setConfig(importedConfig);
                toast.success("Configuração importada!");
            } else {
                toast.error("Falha ao importar configuração");
            }
        }
    };

    const handleExport = async () => {
        if (config) {
            const path = await save({
                filters: [{ name: "julia_parameters", extensions: ["json"] }],
            });
            if (path) {
                await saveConfig(config, path);
                toast.success("Configuração exportada!");
            }
        }
    };

    const handleSourceChange = (index: number, field: 'source' | 'sector', value: string) => {
        const newSources = [...config.sources];
        newSources[index] = { ...newSources[index], [field]: value };
        setConfig({ ...config, sources: newSources });
    };

    const handleModelPathChange = (value: string) => {
        setConfig({ ...config, modelPath: value });
    };

    const handleLogIntervalChange = (value: number) => {
        setConfig({ ...config, logInterval: value });
    };

    const handleFrameCountChange = (value: number) => {
        setConfig({ ...config, frameCount: value });
    };

    return {
        activeTab,
        setActiveTab,
        config,
        handleSave,
        handleImport,
        handleExport,
        handleSourceChange,
        handleModelPathChange,
        handleLogIntervalChange,
        handleFrameCountChange
    };
};