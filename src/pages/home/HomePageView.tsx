import "./HomepageStyles.css";
import * as viewModel from "./HomePageViewModel"
export const Homepage = () => {
  const handleIa = async(debug = false)=>{
    await viewModel.launchJulia(debug);
  }
    return (
        <div className="main-container">
            <section className="left-container">
                <h1 className="title">Bem vindo a Jul.Ia</h1>
                <p className="subtitle">Seu sistema de monitoramento por IA</p>
                <div className="card">
                    <h1>Status do Sistema</h1>
                    <p>Offline</p>
                    <a onClick={async ()=> await handleIa()}>Ligar</a>
                    <a onClick={async ()=> await handleIa(true)}>Ligar em modo de debug</a>
                </div>
            </section>

            <section className="right-container">
                <h1 className="title">Resumo Geral</h1>
                <p className="subtitle">Acompanhe aqui as últimas atualizações</p>
                <div className="card-black">
                    <div className="status-item">
                        <h2>Logs Processados</h2>
                        <p>48 logs</p>
                    </div>

                    <div className="status-item">
                        <h2>Alertas gerados</h2>
                        <p>24 alertas</p>
                    </div>

                    <div className="status-item">
                        <h2>Setores cadastrados</h2>
                        <p>3 setores</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
