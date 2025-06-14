# Importando as bibliotecas necessárias
from datetime import datetime
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import plotly.express as px
import dash_iconify
import requests

# Inicializando o aplicativo Dash
app = Dash(__name__)

# --- FUNÇÃO MODIFICADA PARA BUSCAR E TRANSFORMAR DADOS DA API ---
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

        # --- Bloco de Transformação dos Dados ---
        # Mapeia os nomes das colunas da API para nomes mais amigáveis no dashboard.
        mapa_colunas = {
            'createdAt': 'Horário da Checagem',
            'worker.registrationNumber': 'Matrícula', # Usando o número de registro
            'worker.name': 'Trabalhador',          # Adicionando o nome do trabalhador
            'sector.name': 'Área',                   # Usando o nome do setor
            'allEpiCorrects': 'Todos EPIs Corretos',
            'removedEpi': 'EPI Removido',
            'remotionHour': 'Hora da Remoção'
        }
        
        # Renomeia as colunas de acordo com o mapa
        df.rename(columns=mapa_colunas, inplace=True)
        
        # --- CORREÇÃO: Tratamento de Tipos para a Tabela ---
        # A coluna 'EPI Removido' pode vir como uma lista, o que não é aceito pela DataTable.
        # Vamos convertê-la para uma string para garantir a compatibilidade.
        if 'EPI Removido' in df.columns:
            df['EPI Removido'] = df['EPI Removido'].apply(
                lambda x: ', '.join(map(str, x)) if isinstance(x, list) else '-' if pd.isna(x) else str(x)
            )

        # --- Verificação e Conversão de Tipos ---
        # Lista de colunas essenciais que o dashboard precisa para funcionar
        colunas_necessarias = ['Horário da Checagem', 'Matrícula', 'Área', 'Todos EPIs Corretos']
        
        # Verifica se todas as colunas essenciais existem após renomear
        for col in colunas_necessarias:
            if col not in df.columns:
                print(f"ERRO CRÍTICO: A coluna essencial '{col}' não foi encontrada nos dados da API após a transformação.")
                return pd.DataFrame()

        # Converte a coluna de data/hora para o formato datetime
        df['Horário da Checagem'] = pd.to_datetime(df['Horário da Checagem'], errors='coerce')
        
        # Cria a coluna 'Alerta Gerado' com base na lógica de 'allEpiCorrects'
        df['Alerta Gerado'] = (~df['Todos EPIs Corretos']).astype(int)

        # Seleciona e reordena as colunas finais que o dashboard vai usar
        colunas_finais = ['Matrícula', 'Trabalhador', 'Área', 'Horário da Checagem', 'Alerta Gerado', 'EPI Removido', 'Hora da Remoção']
        
        colunas_existentes = [col for col in colunas_finais if col in df.columns]
        df_final = df[colunas_existentes]
        
        print("Dados transformados com sucesso. Colunas finais:", df_final.columns.tolist())

        return df_final

    except requests.exceptions.RequestException as e:
        print(f"ERRO: Não foi possível conectar à API em {url}. Detalhes: {e}")
        return pd.DataFrame()
    except (ValueError, KeyError) as e:
        print(f"ERRO: Problema ao processar os dados recebidos da API. Detalhes: {e}")
        return pd.DataFrame()


# Função auxiliar para estilizar os gráficos (sem alteração)
def estilizar_grafico(fig):
    fig.update_layout(
        plot_bgcolor='#3a3a3a',
        paper_bgcolor='#3a3a3a',
        font=dict(color='white', family="'Roboto', sans-serif"),
        title_font=dict(color='#3399ff'),
        legend=dict(bgcolor='#3a3a3a', font=dict(color='white')),
        margin=dict(l=40, r=20, t=50, b=40),
    )
    fig.update_traces(marker_color='#ff4d4d', textposition='outside', textfont=dict(color='white'))
    return fig

# --- Layout do Aplicativo (sem alteração) ---
app.layout = html.Div(
    style={
        'backgroundColor': '#2e2e2e', 'fontFamily': "'Roboto', sans-serif", 'color': 'white',
        'padding': '20px', 'minHeight': '100vh',
    },
    children=[
        html.H1('Visualização de Alertas', style={'color': '#3399ff', 'textAlign': 'center'}),
        html.P('Utilize os filtros abaixo para refinar os alertas exibidos na tabela.', style={'textAlign': 'center', 'marginBottom': '30px'}),
        
        # Seção de Filtros
        html.Div(
            style={'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap', 'marginBottom': '20px'},
            children=[
                html.Div([
                    html.Label("Pesquisar por Matrícula:", style={'marginRight': '10px'}),
                    dcc.Input(id='input-matricula', type='text', placeholder='Digite a matrícula...', debounce=True, style={'padding': '8px', 'borderRadius': '5px', 'border': '1px solid #3399ff', 'backgroundColor': '#3a3a3a', 'color': 'white', 'fontSize': '14px'}),
                ], style={'display': 'flex', 'alignItems': 'center'}),
                html.Div([
                    html.Label("Filtrar por Área:", style={'marginRight': '10px'}),
                    dcc.Dropdown(id='dropdown-area', options=[], multi=True, placeholder="Selecione a(s) área(s)...", style={'width': '250px', 'color': '#333'}, className='dash-bootstrap'),
                ], style={'display': 'flex', 'alignItems': 'center'}),
                html.Div([
                    html.Label("Filtrar por Data:", style={'marginRight': '10px'}),
                    dcc.DatePickerRange(id='date-picker-range', display_format='DD/MM/YYYY', start_date_placeholder_text="Data Início", end_date_placeholder_text="Data Fim", clearable=True, persistence=True, persisted_props=['start_date', 'end_date'], persistence_type='session'),
                ], style={'display': 'flex', 'alignItems': 'center'}),
                html.Button(id='botao-atualizar', n_clicks=0, children=[dash_iconify.DashIconify(icon="mdi:reload", width=20, height=20), " Atualizar dados"], style={'padding': '10px 20px', 'fontSize': '16px', 'backgroundColor': '#3399ff', 'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'gap': '8px'}),
            ]
        ),
        html.Div(id='ultimo-update', style={'fontSize': '14px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),
        
        # Seção de Conteúdo Principal
        html.Div(
            style={'display': 'flex', 'flexWrap': 'wrap', 'gap': '20px'},
            children=[
                html.Div(
                    style={'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px', 'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.2)', 'flex': '3', 'minWidth': '600px'},
                    children=[
                        dash_table.DataTable(id='tabela-alertas', style_table={'overflowX': 'auto', 'maxHeight': '600px', 'overflowY': 'auto'}, style_cell={'backgroundColor': '#5a1f1f', 'color': 'white', 'textAlign': 'left', 'padding': '10px', 'fontFamily': "'Roboto', sans-serif", 'minWidth': '120px', 'width': '150px', 'maxWidth': '300px', 'border': '1px solid #444'}, style_header={'backgroundColor': '#ff4d4d', 'fontWeight': 'bold', 'color': 'white', 'fontSize': '14px', 'padding': '12px', 'border': '1px solid #444'}, page_size=15, fixed_rows={'headers': True}, style_as_list_view=True),
                        html.Div(id='contagem-alertas', style={'textAlign': 'right', 'marginTop': '10px', 'color': '#ccc', 'fontWeight': 'bold'})
                    ]
                ),
                html.Div(
                    style={'flex': '2', 'display': 'flex', 'flexDirection': 'column', 'gap': '20px', 'minWidth': '300px'},
                    children=[
                        html.Div(style={'display': 'flex', 'gap': '20px', 'justifyContent': 'space-between'}, children=[
                            html.Div(id='card-alertas-dia', style={'flex': 1, 'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center'}),
                            html.Div(id='card-alertas-semana', style={'flex': 1, 'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center'}),
                        ]),
                        html.Div(style={'flex': 1, 'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px'}, children=[
                            dcc.Graph(id='grafico-alertas-mes', style={'height': '450px'})
                        ])
                    ]
                )
            ]
        )
    ]
)

# --- Callback Principal (sem grandes alterações na lógica) ---
@app.callback(
    Output('dropdown-area', 'options'),
    Output('tabela-alertas', 'data'),
    Output('tabela-alertas', 'columns'),
    Output('ultimo-update', 'children'),
    Output('contagem-alertas', 'children'),
    Output('card-alertas-dia', 'children'),
    Output('card-alertas-semana', 'children'),
    Output('grafico-alertas-mes', 'figure'),
    Input('botao-atualizar', 'n_clicks'),
    State('input-matricula', 'value'),
    State('dropdown-area', 'value'),
    State('date-picker-range', 'start_date'),
    State('date-picker-range', 'end_date')
)
def atualizar_tabela_alertas(n_clicks, matricula_digitada, areas_selecionadas, start_date, end_date):
    """
    Esta função busca os dados já transformados, aplica filtros e atualiza a interface.
    """
    df = buscar_dados_da_api()
    
    if df.empty:
        horario_falha = datetime.now().strftime("Falha ao carregar/processar dados da API em %d/%m/%Y %H:%M:%S")
        fig_vazia = estilizar_grafico(px.bar(title='Dados indisponíveis'))
        card_vazio = [html.H4("Dados", style={'color': '#ccc'}), html.H2("N/A", style={'color': '#ff4d4d', 'marginTop': '10px'})]
        return [], [], [], horario_falha, "N/A", card_vazio, card_vazio, fig_vazia

    # Cria a coluna 'Data da Checagem' para facilitar o filtro por data
    df['Data da Checagem'] = df['Horário da Checagem'].dt.date
    
    # Preenche as opções do dropdown de Área
    area_options = [{'label': str(area), 'value': str(area)} for area in sorted(df['Área'].dropna().unique())]

    # Aplica os filtros
    df_filtrado = df.copy()
    if matricula_digitada:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula_digitada, case=False, na=False)]
    if areas_selecionadas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas_selecionadas)]
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date.split('T')[0], '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date.split('T')[0], '%Y-%m-%d').date()
        df_filtrado = df_filtrado[(df_filtrado['Data da Checagem'] >= start_date_obj) & (df_filtrado['Data da Checagem'] <= end_date_obj)]
    
    # Filtra apenas os registros que são alertas
    df_alertas = df_filtrado[df_filtrado['Alerta Gerado'] == 1].copy()
    
    # Cálculos para os Cards
    today = datetime.now().date()
    start_of_week = today - pd.to_timedelta(today.weekday(), unit='d')
    alertas_hoje = df_alertas[df_alertas['Data da Checagem'] == today].shape[0]
    alertas_semana = df_alertas[df_alertas['Data da Checagem'] >= start_of_week].shape[0]
    card_dia_children = [html.H4("Alertas Hoje", style={'color': '#ccc'}), html.H2(f"{alertas_hoje}", style={'color': '#ff4d4d', 'marginTop': '10px'})]
    card_semana_children = [html.H4("Alertas na Semana", style={'color': '#ccc'}), html.H2(f"{alertas_semana}", style={'color': '#ff4d4d', 'marginTop': '10px'})]

    # Cálculo para o Gráfico Mensal
    df_alertas_mes = df_alertas[pd.to_datetime(df_alertas['Data da Checagem']).dt.month == today.month].copy()
    if not df_alertas_mes.empty:
        df_alertas_mes['Dia'] = pd.to_datetime(df_alertas_mes['Data da Checagem']).dt.day
        contagem_diaria = df_alertas_mes.groupby('Dia').size().reset_index(name='Contagem')
        fig_mensal = px.bar(contagem_diaria, x='Dia', y='Contagem', title=f'Alertas por Dia em {today.strftime("%B")}', text_auto=True)
        fig_mensal = estilizar_grafico(fig_mensal)
    else:
        fig_mensal = estilizar_grafico(px.bar(title=f'Alertas por Dia em {today.strftime("%B")}'))

    
    # Preparação para a Tabela
    df_alertas_tabela = df_alertas.copy()
    if not df_alertas_tabela.empty:
        # Formata a data para melhor visualização na tabela
        df_alertas_tabela['Horário da Checagem'] = df_alertas_tabela['Horário da Checagem'].dt.strftime('%d/%m/%Y %H:%M:%S')
    
    # Oculta colunas auxiliares da visualização final da tabela
    colunas_para_remover = ['Data da Checagem', 'Todos EPIs Corretos', 'Alerta Gerado']
    data_alertas = df_alertas_tabela.to_dict('records')
    columns_alertas = [{'name': col, 'id': col} for col in df_alertas_tabela.columns if col not in colunas_para_remover]
    contagem_alertas_texto = f"Total de Alertas Encontrados: {len(df_alertas)}"
    horario_atual = datetime.now().strftime("Última atualização: %d/%m/%Y %H:%M:%S")

    return area_options, data_alertas, columns_alertas, horario_atual, contagem_alertas_texto, card_dia_children, card_semana_children, fig_mensal

# --- Execução do Servidor (sem alteração) ---
if __name__ == '__main__':
    app.run(debug=True)
