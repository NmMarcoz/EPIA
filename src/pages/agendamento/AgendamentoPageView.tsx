"use client";
import "./AgendamentoPageStyle.css";
import circle from "../../assets/circle.svg";
import elipse from "../../assets/elipse.svg";
export function Agendamento() {
    return (
        <div className="configuracao">
            <section className="secao1">
                <h1>Painel de Agendamentos</h1>
                <p>
                    Um recurso experimental da <strong>JuI.IA</strong> Permite
                    que você defina horários onde gostaria que o sistema de
                    monitoramento desligasse.
                </p>
            </section>
            <div className="header-config">
                <h1>Meus Agendamentos</h1>
                <p>Aqui você pode monitorar e adicionar novos.</p>
            </div>

            <section className="secao2">
                <div className="agendamentos-lista">
                    <div className="agendamento-card">
                        <div className="card-content">
                            <div className="card-header">
                                <h2>Sistema OFF para visita comemorativa</h2>
                                <p>
                                    Solicito o desligamento do sistema para um
                                    evento comemorativo
                                </p>
                            </div>

                            <div className="card-details">
                                <div className="detail-row">
                                    <span className="label">Setor -</span>
                                    <span className="value">
                                        Sala de Almoxarifado.
                                    </span>
                                    <span className="label">Data:</span>
                                    <span className="value">
                                        13 de agosto, 2025.
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="horario">
                                        Horário 13h30-17h
                                    </span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="Button-editar">
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* <div className="agendamento-card">
                        <div className="card-content">
                            <div className="card-header">
                                <h2>Sistema OFF para visita comemorativa</h2>
                                <p>
                                    Solicito o desligamento do sistema para um
                                    evento comemorativo
                                </p>
                            </div>

                            <div className="card-details">
                                <div className="detail-row">
                                    <span className="label">Setor -</span>
                                    <span className="value">
                                        Sala de Almoxarifado.
                                    </span>
                                    <span className="label">Data:</span>
                                    <span className="value">
                                        13 de agosto, 2025.
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="horario">
                                        Horário 13h30-17h
                                    </span>
                                </div>
                                <div className="card-actions">
                                    <button className="Button-editar">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
             <button className="floating-add-btn">
                <img src={circle} alt="Adicionar agendamento" className="circle" />
                <img src={elipse} alt="" className="elipse" />
            </button>
            
        </div>
    );
}
