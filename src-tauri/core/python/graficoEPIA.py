# Importando as bibliotecas necessárias
from datetime import datetime
from dash import Dash, html, dcc, Output, Input, State, dash_table
import pandas as pd
import plotly.express as px
import dash_iconify
import requests

# --- 1. Inicialização do Aplicativo e Configurações Globais ---

# Inicializa o aplicativo Dash com folhas de estilo externas para fontes e ícones
app = Dash(__name__, suppress_callback_exceptions=True, external_stylesheets=[
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
])
app.title = "Dashboard de Monitoramento"

# URLs da API (centralizadas para fácil manutenção)
API_URL_LOGS = "http://localhost:3000/logs"
API_URL_WORKERS = "http://localhost:3000/workers"

# Paleta de cores e estilo
COLORS = {
    'background': '#1e2130',
    'background_component': '#282c3f',
    'text': '#f0f0f0',
    'primary': '#3399ff',
    'accent': '#ff4d4d',
    'border': '#555'
}

# --- 2. Funções de Busca e Transformação de Dados ---

def buscar_dados_logs_api():
    """
    Busca e transforma os dados de logs (registros de EPI) da API.
    Retorna um DataFrame do Pandas.
    """
    try:
        response = requests.get(API_URL_LOGS, timeout=10)
        response.raise_for_status()
        dados_json = response.json()
        if not dados_json:
            return pd.DataFrame()

        df = pd.json_normalize(dados_json)

        mapa_colunas = {
            'createdAt': 'Horário da Checagem',
            'worker.registrationNumber': 'Matrícula',
            'worker.name': 'Trabalhador',
            'sector.name': 'Área',
            'allEpiCorrects': 'Todos EPIs Corretos',
            'removedEpi': 'EPI Removido',
            'remotionHour': 'Hora da Remoção',
            'sector.rules': 'Regras da Área'
        }
        df.rename(columns=mapa_colunas, inplace=True)

        for col in ['EPI Removido', 'Regras da Área']:
            if col in df.columns:
                df[col] = df[col].apply(
                    lambda x: ', '.join(map(str, x)) if isinstance(x, list) else '-' if pd.isna(x) else str(x)
                )

        colunas_necessarias = ['Horário da Checagem', 'Matrícula', 'Área', 'Todos EPIs Corretos']
        if not all(col in df.columns for col in colunas_necessarias):
            print("ERRO CRÍTICO: Colunas essenciais de logs não encontradas.")
            return pd.DataFrame()

        df['Horário da Checagem'] = pd.to_datetime(df['Horário da Checagem'], errors='coerce')
        df['Alerta Gerado'] = (~df['Todos EPIs Corretos']).astype(int)
        
        return df

    except requests.exceptions.RequestException as e:
        print(f"ERRO de API (Logs): Não foi possível conectar a {API_URL_LOGS}. Detalhes: {e}")
        return pd.DataFrame()
    except (ValueError, KeyError) as e:
        print(f"ERRO de Processamento (Logs): Detalhes: {e}")
        return pd.DataFrame()

def buscar_dados_funcionarios_api():
    """
    Busca e transforma os dados de funcionários da API.
    Retorna um DataFrame do Pandas.
    """
    try:
        response = requests.get(API_URL_WORKERS, timeout=10)
        response.raise_for_status()
        dados_json = response.json()
        if not dados_json:
            return pd.DataFrame()

        df = pd.json_normalize(dados_json)

        mapa_colunas = {
            'registrationNumber': 'Matrícula',
            'name': 'Nome',
            'email': 'Email',
            'function': 'Cargo',
            'sector.name': 'Área'
        }

        if 'sector.name' not in df.columns:
            df['Área'] = 'Não especificada'
        
        df.rename(columns=mapa_colunas, inplace=True)
        
        colunas_finais = ['Matrícula', 'Nome', 'Email', 'Cargo', 'Área']
        colunas_existentes = [col for col in colunas_finais if col in df.columns]
        
        return df[colunas_existentes]

    except requests.exceptions.RequestException as e:
        print(f"ERRO de API (Funcionários): Não foi possível conectar a {API_URL_WORKERS}. Detalhes: {e}")
        return pd.DataFrame()
    except (ValueError, KeyError) as e:
        print(f"ERRO de Processamento (Funcionários): Detalhes: {e}")
        return pd.DataFrame()


# --- 3. Funções Auxiliares e de Layout ---

def estilizar_grafico(fig, title):
    """Aplica um estilo padrão aos gráficos Plotly."""
    fig.update_layout(
        title={'text': title, 'x': 0.5, 'font': {'color': COLORS['primary'], 'size': 18}},
        plot_bgcolor=COLORS['background_component'],
        paper_bgcolor=COLORS['background_component'],
        font=dict(color=COLORS['text'], family="'Roboto', sans-serif"),
        legend=dict(bgcolor=COLORS['background_component'], font=dict(color=COLORS['text'])),
        margin=dict(l=40, r=20, t=60, b=40),
    )
    fig.update_traces(textposition='outside', textfont=dict(color=COLORS['text']))
    return fig

# --- Layout da Barra de Navegação ---
navbar = html.Div(
    style={
        'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px',
        'padding': '15px', 'backgroundColor': COLORS['background_component'], 'marginBottom': '20px',
        'borderBottom': f'2px solid {COLORS["primary"]}'
    },
    children=[
        dcc.Link(
            'ALERTAS', href='/',
            style={'textDecoration': 'none', 'color': COLORS['text'], 'fontWeight': 'bold', 'fontSize': '16px'}
        ),
        dcc.Link(
            'VISÃO GERAL', href='/visao-geral',
            style={'textDecoration': 'none', 'color': COLORS['text'], 'fontWeight': 'bold', 'fontSize': '16px'}
        ),
        dcc.Link(
            'FUNCIONÁRIOS', href='/funcionarios',
            style={'textDecoration': 'none', 'color': COLORS['text'], 'fontWeight': 'bold', 'fontSize': '16px'}
        )
    ]
)

# --- Layout da Página de Alertas (Home) ---
def layout_alertas():
    return html.Div([
        html.H1('Dashboard de Alertas', style={'color': COLORS['primary'], 'textAlign': 'center'}),
        html.P('Análise detalhada de registros e alertas de uso de EPI.', style={'textAlign': 'center', 'marginBottom': '30px'}),
        
        # Filtros
        html.Div(
            style={'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap', 'marginBottom': '20px'},
            children=[
                dcc.Input(id='alert-input-matricula', type='text', placeholder='Pesquisar por Matrícula...', style={'padding': '8px', 'borderRadius': '5px', 'border': f'1px solid {COLORS["primary"]}', 'backgroundColor': COLORS['background_component'], 'color': COLORS['text']}),
                dcc.Dropdown(id='alert-dropdown-area', options=[], multi=True, placeholder="Filtrar por Área...", style={'width': '250px', 'color': '#333'}),
                dcc.DatePickerRange(id='alert-date-picker', display_format='DD/MM/YYYY', start_date_placeholder_text="Data Início", end_date_placeholder_text="Data Fim", clearable=True),
                html.Button(id='alert-botao-atualizar', children=[dash_iconify.DashIconify(icon="mdi:reload", width=20), " Atualizar"], style={'padding': '10px 20px', 'fontSize': '14px', 'backgroundColor': COLORS['primary'], 'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'gap': '8px'}),
            ]
        ),
        html.Div(id='alert-ultimo-update', style={'fontSize': '12px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),
        
        dcc.Graph(id='alert-grafico-alertas', style={'borderRadius': '10px', 'backgroundColor': COLORS['background_component'], 'padding': '10px', 'marginBottom': '20px'}),
        
        html.Div(
            style={'backgroundColor': COLORS['background_component'], 'padding': '20px', 'borderRadius': '10px', 'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.2)'},
            children=[
                html.H3('Registros de Alertas', style={'textAlign': 'center', 'color': COLORS['primary'], 'marginBottom': '15px'}),
                dash_table.DataTable(
                    id='alert-tabela-dados',
                    style_table={'overflowX': 'auto'},
                    style_cell={'backgroundColor': COLORS['background_component'], 'color': COLORS['text'], 'textAlign': 'left', 'padding': '10px', 'fontFamily': "'Roboto', sans-serif", 'border': f'1px solid {COLORS["border"]}'},
                    style_header={'backgroundColor': COLORS['primary'], 'fontWeight': 'bold', 'color': 'white', 'padding': '12px', 'border': f'1px solid {COLORS["border"]}'},
                    page_size=15,
                    fixed_rows={'headers': True},
                    style_as_list_view=True,
                ),
                html.Div(id='alert-contagem-dados', style={'textAlign': 'right', 'marginTop': '10px', 'color': '#ccc', 'fontWeight': 'bold'})
            ]
        )
    ])

# --- Layout da Página de Visão Geral ---
def layout_visao_geral():
    return html.Div([
        html.H1('Visão Geral dos Dados', style={'color': COLORS['primary'], 'textAlign': 'center'}),
        html.P('Dashboard analítico de registros de EPI.', style={'textAlign': 'center', 'marginBottom': '30px'}),
        
        # Filtros
        html.Div(
            style={'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap', 'marginBottom': '20px'},
            children=[
                dcc.Input(id='geral-input-matricula', type='text', placeholder='Pesquisar por Matrícula...', style={'padding': '8px', 'borderRadius': '5px', 'border': f'1px solid {COLORS["primary"]}', 'backgroundColor': COLORS['background_component'], 'color': COLORS['text']}),
                dcc.Dropdown(id='geral-dropdown-area', options=[], multi=True, placeholder="Filtrar por Área...", style={'width': '250px', 'color': '#333'}),
                dcc.DatePickerRange(id='geral-date-picker', display_format='DD/MM/YYYY', start_date_placeholder_text="Data Início", end_date_placeholder_text="Data Fim", clearable=True),
                html.Button(id='geral-botao-atualizar', children=[dash_iconify.DashIconify(icon="mdi:reload", width=20), " Atualizar"], style={'padding': '10px 20px', 'fontSize': '14px', 'backgroundColor': COLORS['primary'], 'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'gap': '8px'}),
            ]
        ),
        html.Div(id='geral-ultimo-update', style={'fontSize': '12px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),
        
        # Grid de Gráficos (Layout Original)
        html.Div(
            style={'display': 'grid', 'gridTemplateColumns': 'repeat(auto-fit, minmax(450px, 1fr))', 'gap': '20px', 'marginBottom': '20px'},
            children=[
                dcc.Graph(id='geral-grafico-area', style={'borderRadius': '10px', 'backgroundColor': COLORS['background_component'], 'padding': '10px'}),
                dcc.Graph(id='geral-grafico-epirem', style={'borderRadius': '10px', 'backgroundColor': COLORS['background_component'], 'padding': '10px'}),
                dcc.Graph(id='geral-grafico-epirem-area', style={'borderRadius': '10px', 'backgroundColor': COLORS['background_component'], 'padding': '10px'}),
            ]
        ),
    ])

# --- Layout da Página de Funcionários ---
def layout_funcionarios():
    return html.Div([
        html.H1('Dashboard de Funcionários', style={'color': COLORS['primary'], 'textAlign': 'center'}),
        html.P('Consulte as informações dos funcionários cadastrados.', style={'textAlign': 'center', 'marginBottom': '30px'}),

        # Filtros
        html.Div(
            style={'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap', 'marginBottom': '20px'},
            children=[
                dcc.Input(id='func-input-matricula', type='text', placeholder='Pesquisar por Matrícula...', style={'padding': '8px', 'borderRadius': '5px', 'border': f'1px solid {COLORS["primary"]}', 'backgroundColor': COLORS['background_component'], 'color': COLORS['text']}),
                dcc.Input(id='func-input-nome', type='text', placeholder='Pesquisar por Nome...', style={'padding': '8px', 'borderRadius': '5px', 'border': f'1px solid {COLORS["primary"]}', 'backgroundColor': COLORS['background_component'], 'color': COLORS['text']}),
                dcc.Dropdown(id='func-dropdown-area', options=[], multi=True, placeholder="Filtrar por Área...", style={'width': '250px', 'color': '#333'}),
                html.Button(id='func-botao-atualizar', children=[dash_iconify.DashIconify(icon="mdi:reload", width=20), " Atualizar"], style={'padding': '10px 20px', 'fontSize': '14px', 'backgroundColor': COLORS['primary'], 'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'gap': '8px'}),
            ]
        ),
        html.Div(id='func-ultimo-update', style={'fontSize': '12px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),
        
        # Tabela de Funcionários
        html.Div(
            style={'backgroundColor': COLORS['background_component'], 'padding': '20px', 'borderRadius': '10px', 'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.2)'},
            children=[
                html.H3('Lista de Funcionários', style={'textAlign': 'center', 'color': COLORS['primary'], 'marginBottom': '15px'}),
                dash_table.DataTable(
                    id='func-tabela-funcionarios',
                    style_table={'overflowX': 'auto'},
                    style_cell={'backgroundColor': COLORS['background_component'], 'color': COLORS['text'], 'textAlign': 'left', 'padding': '10px', 'fontFamily': "'Roboto', sans-serif", 'border': f'1px solid {COLORS["border"]}'},
                    style_header={'backgroundColor': COLORS['primary'], 'fontWeight': 'bold', 'color': 'white', 'padding': '12px', 'border': f'1px solid {COLORS["border"]}'},
                    page_size=20,
                    fixed_rows={'headers': True},
                    style_as_list_view=True,
                ),
                html.Div(id='func-contagem-funcionarios', style={'textAlign': 'right', 'marginTop': '10px', 'color': '#ccc', 'fontWeight': 'bold'})
            ]
        )
    ])

# --- Layout Principal do Aplicativo ---
app.layout = html.Div(
    style={'backgroundColor': COLORS['background'], 'color': COLORS['text'], 'minHeight': '100vh', 'fontFamily': "'Roboto', sans-serif", 'padding': '0 20px 20px 20px'},
    children=[
        dcc.Location(id='url', refresh=False),
        navbar,
        html.Div(id='page-content')
    ]
)


# --- 4. Callbacks ---

# Callback do Router: Renderiza a página correta com base na URL
@app.callback(
    Output('page-content', 'children'),
    Input('url', 'pathname')
)
def display_page(pathname):
    if pathname == '/funcionarios':
        return layout_funcionarios()
    elif pathname == '/visao-geral':
        return layout_visao_geral()
    else:
        return layout_alertas()

# Callback da Página de Alertas (Home)
@app.callback(
    Output('alert-dropdown-area', 'options'),
    Output('alert-grafico-alertas', 'figure'),
    Output('alert-tabela-dados', 'data'),
    Output('alert-tabela-dados', 'columns'),
    Output('alert-ultimo-update', 'children'),
    Output('alert-contagem-dados', 'children'),
    Input('alert-botao-atualizar', 'n_clicks'),
    State('alert-input-matricula', 'value'),
    State('alert-dropdown-area', 'value'),
    State('alert-date-picker', 'start_date'),
    State('alert-date-picker', 'end_date')
)
def update_alert_page(n_clicks, matricula, areas, start_date, end_date):
    df = buscar_dados_logs_api()
    horario_atual = datetime.now().strftime("Atualizado em: %d/%m/%Y %H:%M:%S")

    fig_vazia = estilizar_grafico(px.bar(title='Dados indisponíveis'), 'Dados Indisponíveis')
    if df.empty:
        return [], fig_vazia, [], [], horario_atual, "Nenhum registro encontrado"

    df['Data da Checagem'] = df['Horário da Checagem'].dt.date
    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].dropna().unique())]

    # Aplicar filtros
    df_filtrado = df.copy()
    if matricula:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula, case=False, na=False)]
    if areas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas)]
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date.split('T')[0], '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date.split('T')[0], '%Y-%m-%d').date()
        df_filtrado = df_filtrado[(df_filtrado['Data da Checagem'] >= start_date_obj) & (df_filtrado['Data da Checagem'] <= end_date_obj)]

    # Gráfico de Alertas por Hora
    df_alertas_filtrado = df_filtrado[df_filtrado['Alerta Gerado'] == 1].copy()
    if not df_alertas_filtrado.empty:
        df_alertas_filtrado['Hora'] = df_alertas_filtrado['Horário da Checagem'].dt.hour
        contagem_horas = df_alertas_filtrado['Hora'].value_counts().sort_index().reset_index()
        contagem_horas.columns = ['Hora', 'Quantidade de Alertas']
        grafico_alertas = estilizar_grafico(px.bar(contagem_horas, x='Hora', y='Quantidade de Alertas', text_auto=True, color_discrete_sequence=[COLORS['accent']]), 'Distribuição de Alertas por Hora')
        grafico_alertas.update_xaxes(tickvals=list(range(24)))
    else:
        grafico_alertas = estilizar_grafico(px.bar(title='Nenhum Alerta no Período'), 'Distribuição de Alertas por Hora')
    
    # Tabela de Dados (apenas com alertas)
    df_tabela = df_alertas_filtrado.copy()
    colunas_para_exibir = ['Matrícula', 'Trabalhador', 'Área', 'Horário da Checagem', 'EPI Removido', 'Hora da Remoção', 'Regras da Área']
    colunas_existentes = [col for col in colunas_para_exibir if col in df_tabela.columns]
    df_tabela = df_tabela[colunas_existentes]
    if 'Horário da Checagem' in df_tabela.columns:
        df_tabela['Horário da Checagem'] = df_tabela['Horário da Checagem'].dt.strftime('%d/%m/%Y %H:%M:%S')

    data_tabela = df_tabela.to_dict('records')
    colunas_tabela = [{'name': col, 'id': col} for col in df_tabela.columns]
    contagem_texto = f"Total de Alertas Exibidos: {len(df_tabela)}"
    
    return area_options, grafico_alertas, data_tabela, colunas_tabela, horario_atual, contagem_texto

# Callback da Página de Visão Geral
@app.callback(
    Output('geral-dropdown-area', 'options'),
    Output('geral-grafico-area', 'figure'),
    Output('geral-grafico-epirem', 'figure'),
    Output('geral-grafico-epirem-area', 'figure'),
    Output('geral-ultimo-update', 'children'),
    Input('geral-botao-atualizar', 'n_clicks'),
    State('geral-input-matricula', 'value'),
    State('geral-dropdown-area', 'value'),
    State('geral-date-picker', 'start_date'),
    State('geral-date-picker', 'end_date')
)
def update_visao_geral_page(n_clicks, matricula, areas, start_date, end_date):
    df = buscar_dados_logs_api()
    horario_atual = datetime.now().strftime("Atualizado em: %d/%m/%Y %H:%M:%S")

    fig_vazia = estilizar_grafico(px.bar(title='Dados indisponíveis'), 'Dados Indisponíveis')
    if df.empty:
        return [], fig_vazia, fig_vazia, fig_vazia, horario_atual

    df['Data da Checagem'] = df['Horário da Checagem'].dt.date
    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].dropna().unique())]

    # Aplicar filtros
    df_filtrado = df.copy()
    if matricula:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula, case=False, na=False)]
    if areas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas)]
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date.split('T')[0], '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date.split('T')[0], '%Y-%m-%d').date()
        df_filtrado = df_filtrado[(df_filtrado['Data da Checagem'] >= start_date_obj) & (df_filtrado['Data da Checagem'] <= end_date_obj)]
    
    # Gráficos
    contagem_area = df_filtrado['Área'].value_counts().reset_index()
    grafico_area = estilizar_grafico(px.bar(contagem_area, x='Área', y='count', text_auto=True, color_discrete_sequence=[COLORS['primary']]), 'Registros por Área')
    
    contagem_epi = df_filtrado['EPI Removido'].value_counts().reset_index()
    grafico_epirem = estilizar_grafico(px.bar(contagem_epi, x='EPI Removido', y='count', text_auto=True, color_discrete_sequence=[COLORS['accent']]), 'Contagem por Tipo de EPI Removido')
    
    grafico_epirem_area = estilizar_grafico(px.histogram(df_filtrado, x='Área', color='EPI Removido', barmode='group', text_auto=True, color_discrete_sequence=px.colors.qualitative.Vivid), 'EPI Removido por Área')

    return area_options, grafico_area, grafico_epirem, grafico_epirem_area, horario_atual

# Callback da Página de Funcionários
@app.callback(
    Output('func-dropdown-area', 'options'),
    Output('func-tabela-funcionarios', 'data'),
    Output('func-tabela-funcionarios', 'columns'),
    Output('func-ultimo-update', 'children'),
    Output('func-contagem-funcionarios', 'children'),
    Input('func-botao-atualizar', 'n_clicks'),
    State('func-input-matricula', 'value'),
    State('func-input-nome', 'value'),
    State('func-dropdown-area', 'value')
)
def update_funcionarios_page(n_clicks, matricula, nome, areas):
    df = buscar_dados_funcionarios_api()
    horario_atual = datetime.now().strftime("Atualizado em: %d/%m/%Y %H:%M:%S")

    if df.empty:
        return [], [], [], horario_atual, "Nenhum funcionário encontrado"

    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].dropna().unique())]
    
    # Aplicar filtros
    df_filtrado = df.copy()
    if matricula:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula, case=False, na=False)]
    if nome:
        df_filtrado = df_filtrado[df_filtrado['Nome'].str.contains(nome, case=False, na=False)]
    if areas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas)]
        
    data_funcionarios = df_filtrado.to_dict('records')
    columns_funcionarios = [{'name': col, 'id': col} for col in df_filtrado.columns]
    
    contagem_texto = f"Total de Funcionários Encontrados: {len(df_filtrado)}"

    return area_options, data_funcionarios, columns_funcionarios, horario_atual, contagem_texto


# --- 5. Execução do Servidor ---
if __name__ == '__main__':
    app.run(debug=False)