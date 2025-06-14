# Importando as bibliotecas necessárias
from datetime import datetime
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import plotly.express as px
import dash_iconify
import requests # Essencial para buscar dados da API

# Inicializando o aplicativo Dash
app = Dash(__name__)

# --- FUNÇÃO PARA BUSCAR E TRANSFORMAR DADOS DA API (INTEGRADA DO CÓDIGO ANTERIOR) ---
def buscar_dados_da_api():
    """
    Busca dados da API, transforma o JSON no formato esperado pelo dashboard,
    trata erros e retorna um DataFrame do Pandas.
    """
    # !!! ATENÇÃO: Ajuste esta URL para o endpoint correto da sua API !!!
    url = "http://localhost:3000/logs" 
    try:
        # Faz a requisição com um timeout para não travar o app indefinidamente
        response = requests.get(url, timeout=10)
        # Lança um erro HTTP para respostas ruins (como 404 ou 500)
        response.raise_for_status()
        
        # Converte a lista de objetos JSON da resposta em um DataFrame
        dados_json = response.json()
        if not dados_json:
            print("Aviso: A API retornou uma lista vazia.")
            return pd.DataFrame()
            
        df = pd.json_normalize(dados_json)
        
        print(f"Sucesso! {len(df)} registros recebidos da API.")
        print("Colunas originais recebidas:", df.columns.tolist())

        # --- Bloco de Transformação dos Dados (MODIFICADO) ---
        # Mapeia os nomes das colunas da API para nomes mais amigáveis no dashboard.
        mapa_colunas = {
            'createdAt': 'Horário da Checagem',
            'worker.registrationNumber': 'Matrícula',
            'worker.name': 'Trabalhador',
            'sector.name': 'Área',
            'allEpiCorrects': 'Todos EPIs Corretos',
            'removedEpi': 'EPI Removido',
            'remotionHour': 'Hora da Remoção',
            'sector.rules': 'Regras da Área' # <-- NOVA COLUNA MAPEADA
        }
        
        # Renomeia as colunas de acordo com o mapa
        df.rename(columns=mapa_colunas, inplace=True)
        
        # Converte a coluna 'EPI Removido' para uma string, evitando erros na tabela
        if 'EPI Removido' in df.columns:
            df['EPI Removido'] = df['EPI Removido'].apply(
                lambda x: ', '.join(map(str, x)) if isinstance(x, list) else '-' if pd.isna(x) else str(x)
            )

        # --- NOVA CORREÇÃO ---
        # Converte a coluna 'Regras da Área' para string, pois ela também pode ser uma lista
        if 'Regras da Área' in df.columns:
            df['Regras da Área'] = df['Regras da Área'].apply(
                lambda x: ', '.join(map(str, x)) if isinstance(x, list) else '-' if pd.isna(x) else str(x)
            )

        # Garante que as colunas essenciais existam
        colunas_necessarias = ['Horário da Checagem', 'Matrícula', 'Área', 'Todos EPIs Corretos']
        for col in colunas_necessarias:
            if col not in df.columns:
                print(f"ERRO CRÍTICO: A coluna essencial '{col}' não foi encontrada.")
                return pd.DataFrame()

        # Converte a coluna de data/hora
        df['Horário da Checagem'] = pd.to_datetime(df['Horário da Checagem'], errors='coerce')
        
        # Cria a coluna 'Alerta Gerado'
        df['Alerta Gerado'] = (~df['Todos EPIs Corretos']).astype(int)
        
        print("Dados transformados com sucesso.")

        return df

    except requests.exceptions.RequestException as e:
        print(f"ERRO: Não foi possível conectar à API em {url}. Detalhes: {e}")
        return pd.DataFrame()
    except (ValueError, KeyError) as e:
        print(f"ERRO: Problema ao processar os dados recebidos da API. Detalhes: {e}")
        return pd.DataFrame()


# Função auxiliar para estilizar os gráficos
def estilizar_grafico(fig):
    fig.update_layout(
        plot_bgcolor='#3a3a3a',
        paper_bgcolor='#3a3a3a',
        font=dict(color='white', family="'Roboto', sans-serif"),
        title_font=dict(color='#3399ff', size=16),
        legend=dict(bgcolor='#2e2e2e', font=dict(color='white')),
        margin=dict(l=40, r=40, t=60, b=40)
    )
    fig.update_traces(textposition='outside', textfont=dict(color='white'))
    return fig

# --- Layout do Aplicativo ---
app.layout = html.Div(
    style={
        'backgroundColor': '#2e2e2e',
        'fontFamily': "'Roboto', sans-serif",
        'color': 'white',
        'padding': '20px',
        'minHeight': '100vh',
    },
    children=[
        # Título da página
        html.H1('Visão Geral dos Dados', style={'color': '#3399ff', 'textAlign': 'center'}),
        html.P('Dashboard analítico de registros de EPI.', style={'textAlign': 'center', 'marginBottom': '30px'}),

        # --- Seção de Filtros ---
        html.Div(
            style={'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap', 'marginBottom': '20px'},
            children=[
                dcc.Input(id='input-matricula', type='text', placeholder='Pesquisar Matrícula...', debounce=True, style={'padding': '8px', 'borderRadius': '5px', 'border': '1px solid #3399ff', 'backgroundColor': '#3a3a3a', 'color': 'white'}),
                dcc.Dropdown(id='dropdown-area', options=[], multi=True, placeholder="Filtrar por Área...", style={'width': '250px', 'color': '#333'}, className='dash-bootstrap'),
                dcc.DatePickerRange(id='date-picker-range', display_format='DD/MM/YYYY', start_date_placeholder_text="Data Início", end_date_placeholder_text="Data Fim", clearable=True),
                html.Button(id='botao-atualizar', n_clicks=0, children=[dash_iconify.DashIconify(icon="mdi:reload", width=20), " Atualizar"], style={'padding': '10px 20px', 'fontSize': '14px', 'backgroundColor': '#3399ff', 'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'gap': '8px'}),
            ]
        ),
        html.Div(id='ultimo-update', style={'fontSize': '12px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),
        
        # --- Seção de Gráficos ---
        html.Div(
            style={'display': 'grid', 'gridTemplateColumns': 'repeat(auto-fit, minmax(400px, 1fr))', 'gap': '20px', 'marginBottom': '20px'},
            children=[
                dcc.Graph(id='grafico-area', style={'borderRadius': '10px'}),
                dcc.Graph(id='grafico-epirem', style={'borderRadius': '10px'}),
                dcc.Graph(id='grafico-epirem-area', style={'borderRadius': '10px'}),
                dcc.Graph(id='grafico-alertas', style={'borderRadius': '10px'}),
            ]
        ),
        
        # --- Seção da Tabela de Dados Completos ---
        html.Div(
            style={'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px', 'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.2)'},
            children=[
                html.H3('Registros Completos', style={'textAlign': 'center', 'color': '#3399ff', 'marginBottom': '15px'}),
                dash_table.DataTable(
                    id='tabela-dados',
                    style_table={'overflowX': 'auto'},
                    style_cell={'backgroundColor': '#3a3a3a', 'color': 'white', 'textAlign': 'left', 'padding': '10px', 'fontFamily': "'Roboto', sans-serif", 'border': '1px solid #555'},
                    style_header={'backgroundColor': '#3399ff', 'fontWeight': 'bold', 'color': 'white', 'fontSize': '14px', 'padding': '12px', 'border': '1px solid #555'},
                    page_size=10,
                    fixed_rows={'headers': True},
                    style_as_list_view=True,
                ),
                html.Div(id='contagem-dados', style={'textAlign': 'right', 'marginTop': '10px', 'color': '#ccc', 'fontWeight': 'bold'})
            ]
        )
    ]
)

# --- Callback para Atualizar os Dados ---
@app.callback(
    Output('dropdown-area', 'options'),
    Output('grafico-area', 'figure'),
    Output('grafico-epirem', 'figure'),
    Output('grafico-epirem-area', 'figure'),
    Output('grafico-alertas', 'figure'),
    Output('tabela-dados', 'data'),
    Output('tabela-dados', 'columns'),
    Output('ultimo-update', 'children'),
    Output('contagem-dados', 'children'),
    Input('botao-atualizar', 'n_clicks'),
    State('input-matricula', 'value'),
    State('dropdown-area', 'value'),
    State('date-picker-range', 'start_date'),
    State('date-picker-range', 'end_date')
)
def atualizar_tudo(n_clicks, matricula_digitada, areas_selecionadas, start_date, end_date):
    # --- MODIFICAÇÃO: Usa a função da API em vez de gerar dados de exemplo ---
    df = buscar_dados_da_api()
    
    # Se a API falhar ou retornar dados vazios, exibe gráficos e tabelas vazias
    if df.empty:
        horario_falha = datetime.now().strftime("Falha ao carregar dados da API em %d/%m/%Y %H:%M:%S")
        fig_vazia = estilizar_grafico(px.bar(title='Dados indisponíveis'))
        return [], fig_vazia, fig_vazia, fig_vazia, fig_vazia, [], [], horario_falha, "Nenhum registro encontrado"

    df['Data da Checagem'] = df['Horário da Checagem'].dt.date
    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].dropna().unique())]

    df_filtrado = df.copy()
    if matricula_digitada:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula_digitada, case=False, na=False)]
    if areas_selecionadas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas_selecionadas)]
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date.split('T')[0], '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date.split('T')[0], '%Y-%m-%d').date()
        df_filtrado = df_filtrado[(df_filtrado['Data da Checagem'] >= start_date_obj) & (df_filtrado['Data da Checagem'] <= end_date_obj)]

    # --- Gráfico de Área ---
    contagem_area = df_filtrado['Área'].value_counts().reset_index()
    contagem_area.columns = ['Área', 'Quantidade']
    grafico_area = estilizar_grafico(px.bar(contagem_area, x='Área', y='Quantidade', title='Registros por Área', text_auto=True))

    # --- Gráfico EPI Removido ---
    contagem_epi = df_filtrado['EPI Removido'].value_counts().reset_index()
    contagem_epi.columns = ['EPI Removido', 'Quantidade']
    grafico_epirem = estilizar_grafico(px.bar(contagem_epi, x='EPI Removido', y='Quantidade', title='Contagem por Tipo de EPI', text_auto=True))

    # --- Gráfico EPI Removido por Área ---
    grafico_epirem_area = estilizar_grafico(px.histogram(df_filtrado, x='Área', color='EPI Removido', barmode='group', title='EPI Removido por Área', text_auto=True))

    # --- Gráfico Alertas por Horário ---
    df_alertas_filtrado = df_filtrado[df_filtrado['Alerta Gerado'] == 1].copy()
    if not df_alertas_filtrado.empty:
        df_alertas_filtrado['Hora'] = df_alertas_filtrado['Horário da Checagem'].dt.hour
        contagem_horas = df_alertas_filtrado['Hora'].value_counts().sort_index().reset_index()
        contagem_horas.columns = ['Hora', 'Quantidade de Alertas']
        grafico_alertas = estilizar_grafico(px.bar(contagem_horas, x='Hora', y='Quantidade de Alertas', title='Distribuição de Alertas por Hora', text_auto=True))
        grafico_alertas.update_xaxes(tickvals=list(range(24)))
    else:
        grafico_alertas = estilizar_grafico(px.bar(title='Nenhum Alerta no Período'))


    # --- Tabela de Dados Completos ---
    # Define explicitamente as colunas que queremos exibir na tabela
    colunas_para_exibir = [
        'Matrícula', 'Trabalhador', 'Área', 'Horário da Checagem', 
        'EPI Removido', 'Hora da Remoção', 'Regras da Área'
    ]
    colunas_existentes = [col for col in colunas_para_exibir if col in df_filtrado.columns]
    df_tabela = df_filtrado[colunas_existentes].copy()
    
    # Formata a data para a tabela
    if 'Horário da Checagem' in df_tabela.columns:
        df_tabela['Horário da Checagem'] = df_tabela['Horário da Checagem'].dt.strftime('%d/%m/%Y %H:%M:%S')

    data_tabela = df_tabela.to_dict('records')
    colunas_tabela = [{'name': col, 'id': col} for col in df_tabela.columns]

    contagem_dados_texto = f"Total de Registros: {len(df_filtrado)}"
    horario_atual = datetime.now().strftime("Atualizado em: %d/%m/%Y %H:%M:%S")

    return (area_options, grafico_area, grafico_epirem, grafico_epirem_area, 
            grafico_alertas, data_tabela, colunas_tabela, horario_atual, contagem_dados_texto)

# --- Execução do Servidor ---
if __name__ == '__main__':
    app.run(debug=True)