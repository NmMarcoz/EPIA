import "./homepage.css";

import { WebcamCapture } from "../webcam/WebcamModal";
import { Worker, Sector } from "../../utils/types/EpiaTypes.ts";
import "../../globals.css";

interface HomePageProps {
    worker: Worker,
    sector:Sector
}

export const Homepage = (props: HomePageProps) => {

    return (
        <div className="container">
            <div className="homepage-container">
                <div className="header">
                    <h2>{props.sector?.code ?? "carregando"}</h2>
                    <p>{props.sector?.name ?? "carregando"}</p>
                </div>
                <div className="section-container">
                    <section className="right-section">
                        <div className="box">
                            <h2>Área do funcionário</h2>
                            <p>Confira se suas informações cadastrais batem.</p>
                        </div>
                        <div className="basic-container">
                            <div className="box">
                                <div className="box">
                                    <div>
                                        <div className="employee-info">
                                            <a>Nome</a>
                                            <h2>{props?.worker?.name || "carregando"}</h2>
                                        </div>
                                        <div className="employee-info">
                                            <a>Cargo</a>
                                            <h2>{props?.worker?.function || "carregando"}</h2>
                                        </div>
                                        <div className="employee-info">
                                            <a>Taxa de Esquecimento de EPI</a>
                                            <h2>12%</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="basic-container">
                            <WebcamCapture />
                        </div>
                    </section>

                    <section className="left-section">
                        <div className="box">
                            <h2>Lista de Requerimentos</h2>
                            <p>
                                Os seguintes itens são necessários para adentrar
                            </p>
                        </div>
                        <div className="title-container">
                            <div className="basic-container">
                                <div className="box">
                                    {props.sector?.rules.map(
                                        (item, index) => (
                                            <p>{item}</p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
