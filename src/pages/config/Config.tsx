import { useEffect, useState } from "react";
import "./Config.css";
import { ConfigState } from "../../utils/types/InternalTypes.dt";
import * as viewModel from "./ConfigViewModel";
import { open, save } from "@tauri-apps/plugin-dialog";
import { toast } from "react-toastify";

export const Config = () => {
    const [activeTab, setActiveTab] = useState<"sources" | "performance">(
        "sources"
    );
    const [config, setConfig] = useState<ConfigState>({
        modelPath:
            "/Users/nogueira/Desenvolvimento/Projetos/EPIA/src-tauri/core/IA/runs/detect/train2/weights/best.pt",
        sources: ["", ""],
        logInterval: 5,
        frameCount: 5,
    });

    useEffect(() => {
        viewModel.getStorageCOnfig().then((storedConfig) => {
            if (storedConfig) setConfig(storedConfig);
        });
    }, []);

    const handleSave = async () => {
        //console.log("Configuração salva:", config);
        await viewModel.storeConfig(config);
        toast.success("configuração salva!");
    };

    const handleImport = async () => {
        const selected = await open({
            multiple: false,
        });
        if (selected) {
            viewModel.retrieveConfig(selected).then((config) => {
                if (config) {
                    setConfig(config);
                } else {
                    console.log("falha ao pegar a configuração");
                }
            });
        }
    };

    const handleExport = async () => {
        if (config) {
            const path = await save({
                filters: [
                    {
                        name: "julia_parameters",
                        extensions: ["json"],
                    },
                ],
            });
            if (path) {
                viewModel.saveConfig(config, path);
                toast.success("Configuração exportada com sucesso!");
            }
        }
    };

    const handleSourceChange = (index: number, value: string) => {
        const newSources = [...config.sources];
        newSources[index] = value;
        setConfig({
            ...config,
            sources: newSources,
        });
    };

    return (
        <div className="config-container">
            <div className="config-header">
                <h1>Painel de Configuração da Jul.ia</h1>
                <p className="warning-text">
                    Atenção, certos parâmetros elevam as capacidades de
                    processamento. Tome cuidado e não mexa sem ter a devida
                    atenção, para não acarretar em mal funcionamento do sistema.
                </p>
            </div>

            {activeTab === "sources" && (
                <div className="config-section">
                    <h2>Sources de Vídeo e Modelo</h2>
                    <p>
                        Aqui você pode configurar a localização do modelo e os
                        inputs de vídeo.
                    </p>

                    <div className="config-card">
                        <h3>Localização do modelo treinado</h3>
                        <p>
                            Insira a localização do modelo treinado para sua
                            empresa. Em caso de dúvida, consulte o suporte da
                            Jul.ia
                        </p>
                        <div className="input-group">
                            <input
                                type="text"
                                value={config.modelPath}
                                onChange={(e) =>
                                    setConfig({
                                        ...config,
                                        modelPath: e.target.value,
                                    })
                                }
                                placeholder="/models/best.pt"
                            />
                            <button className="secondary-button">
                                Selecionar
                            </button>
                        </div>

                        <h3>Sources de vídeo</h3>
                        <p>
                            Aqui você pode configurar as câmeras que irão prover
                            a imagem a ser processada.
                        </p>
                        <p>Seu plano atual permite 2 sources de vídeo.</p>

                        {config.sources.map((source, index) => (
                            <div key={index} className="source-section">
                                <h4>Source {index + 1}</h4>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={source}
                                    onChange={(e) =>
                                        handleSourceChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    placeholder={`Câmera ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "performance" && (
                <div className="config-section">
                    <h2>Configurações de Performance</h2>
                    <p>Permite configurar o rendimento da Jul.ia</p>
                    <p className="warning-text">
                        Muito cuidado aqui, configurações descalibradas podem
                        afetar o rendimento do sistema.
                    </p>

                    <div className="config-card">
                        <h3>Intervalo de envio de logs (segundos)</h3>
                        <p>
                            Define quanto tempo o modelo espera para enviar um
                            log.
                        </p>
                        <p className="error-text">
                            Logs com maior frequência afetam o rendimento do
                            servidor, e podem acarretar em custos maiores.
                        </p>
                        <input
                            type="number"
                            value={config.logInterval}
                            onChange={(e) =>
                                setConfig({
                                    ...config,
                                    logInterval: Number(e.target.value),
                                })
                            }
                            min="1"
                        />

                        <h3>Quantidade de quadros a serem processados</h3>
                        <p>
                            Define a quantidade de frames que a Jul.ia irá
                            processar. Essa configuração impacta fortemente a
                            performance.
                        </p>
                        <input
                            type="number"
                            value={config.frameCount}
                            onChange={(e) =>
                                setConfig({
                                    ...config,
                                    frameCount: Number(e.target.value),
                                })
                            }
                            min="1"
                        />
                    </div>
                </div>
            )}

            <div className="config-footer">
                <div className="action-buttons">
                    <button className="primary-button" onClick={handleSave}>
                        Salvar
                    </button>
                    <button className="secondary-button" onClick={handleImport}>
                        importar
                    </button>
                    <button className="secondary-button" onClick={handleExport}>
                        exportar
                    </button>
                </div>

                <div className="tab-buttons">
                    <button
                        className={`tab-button ${
                            activeTab === "sources" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("sources")}
                    >
                        Sources de Vídeo e Modelo
                    </button>
                    <button
                        className={`tab-button ${
                            activeTab === "performance" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("performance")}
                    >
                        Performance
                    </button>
                </div>
            </div>
        </div>
    );
};
