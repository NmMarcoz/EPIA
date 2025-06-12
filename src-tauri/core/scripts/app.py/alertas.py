# Importando as bibliotecas necessárias
from datetime import datetime, date, time
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import numpy as np # Importado para gerar dados de exemplo
import plotly.express as px
import dash_iconify

# Inicializando o aplicativo Dash
app = Dash(__name__)

# Função auxiliar para estilizar os gráficos
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

# --- Layout do Aplicativo ---
# O layout define a estrutura e a aparência da página.
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
        html.H1('Visualização de Alertas', style={'color': '#3399ff', 'textAlign': 'center'}),
        html.P('Utilize os filtros abaixo para refinar os alertas exibidos na tabela.', style={'textAlign': 'center', 'marginBottom': '30px'}),

        # --- Seção de Filtros ---
        html.Div(
            style={'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap', 'marginBottom': '20px'},
            children=[
                # Filtro por Matrícula
                html.Div([
                    html.Label("Pesquisar por Matrícula:", style={'marginRight': '10px'}),
                    dcc.Input(
                        id='input-matricula', type='text', placeholder='Digite a matrícula',
                        debounce=True,
                        style={
                            'padding': '8px', 'borderRadius': '5px', 'border': '1px solid #3399ff',
                            'backgroundColor': '#3a3a3a', 'color': 'white', 'fontSize': '14px'
                        }
                    ),
                ], style={'display': 'flex', 'alignItems': 'center'}),

                # Filtro por Área
                html.Div([
                    html.Label("Filtrar por Área:", style={'marginRight': '10px'}),
                    dcc.Dropdown(
                        id='dropdown-area', options=[], multi=True, placeholder="Selecione a(s) área(s)",
                        style={'width': '250px', 'color': '#333'},
                        className='dash-bootstrap'
                    ),
                ], style={'display': 'flex', 'alignItems': 'center'}),

                # Filtro por Data
                html.Div([
                    html.Label("Filtrar por Data:", style={'marginRight': '10px'}),
                    dcc.DatePickerRange(
                        id='date-picker-range', display_format='DD/MM/YYYY',
                        start_date_placeholder_text="Data Início", end_date_placeholder_text="Data Fim",
                        clearable=True, persistence=True, persisted_props=['start_date', 'end_date'],
                        persistence_type='session',
                    ),
                ], style={'display': 'flex', 'alignItems': 'center'}),

                # Botão de Atualizar
                html.Button(
                    id='botao-atualizar', n_clicks=0,
                    children=[
                        dash_iconify.DashIconify(icon="mdi:reload", width=20, height=20),
                        " Atualizar dados"
                    ],
                    style={
                        'padding': '10px 20px', 'fontSize': '16px', 'backgroundColor': '#3399ff',
                        'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer',
                        'display': 'flex', 'alignItems': 'center', 'gap': '8px'
                    }
                ),
            ]
        ),
        
        # Div para exibir a última atualização
        html.Div(id='ultimo-update', style={'fontSize': '14px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),

        # --- Seção de Conteúdo Principal (Tabela e Gráficos) ---
        html.Div(
            style={'display': 'flex', 'flexWrap': 'wrap', 'gap': '20px'},
            children=[
                # Coluna Esquerda: Tabela de Alertas
                html.Div(
                    style={
                        'backgroundColor': '#3a3a3a',
                        'padding': '20px',
                        'borderRadius': '10px',
                        'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.2)',
                        'flex': '3', # Ocupa mais espaço
                        'minWidth': '600px'
                    },
                    children=[
                        dash_table.DataTable(
                            id='tabela-alertas',
                            style_table={'overflowX': 'auto', 'maxHeight': '600px', 'overflowY': 'auto'},
                            style_cell={
                                'backgroundColor': '#5a1f1f', 'color': 'white', 'textAlign': 'left',
                                'padding': '10px', 'fontFamily': "'Roboto', sans-serif",
                                'minWidth': '120px', 'width': '150px', 'maxWidth': '300px',
                                'border': '1px solid #444'
                            },
                            style_header={
                                'backgroundColor': '#ff4d4d', 'fontWeight': 'bold', 'color': 'white',
                                'fontSize': '14px', 'padding': '12px', 'border': '1px solid #444'
                            },
                            page_size=15,
                            fixed_rows={'headers': True},
                            style_as_list_view=True,
                        ),
                        html.Div(id='contagem-alertas', style={'textAlign': 'right', 'marginTop': '10px', 'color': '#ccc', 'fontWeight': 'bold'})
                    ]
                ),
                # Coluna Direita: Cards e Gráfico Mensal
                html.Div(
                    style={'flex': '2', 'display': 'flex', 'flexDirection': 'column', 'gap': '20px', 'minWidth': '300px'},
                    children=[
                        # Cards de Contagem
                        html.Div(
                            style={'display': 'flex', 'gap': '20px', 'justifyContent': 'space-between'},
                            children=[
                                html.Div(id='card-alertas-dia', style={'flex': 1, 'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center'}),
                                html.Div(id='card-alertas-semana', style={'flex': 1, 'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center'}),
                            ]
                        ),
                        # Gráfico Mensal
                        html.Div(
                            style={'flex': 1, 'backgroundColor': '#3a3a3a', 'padding': '20px', 'borderRadius': '10px'},
                            children=[
                                dcc.Graph(id='grafico-alertas-mes', style={'height': '450px'})
                            ]
                        )
                    ]
                )
            ]
        )
    ]
)

#dados mockados
def gerar_dados_exemplo(n_registros=200):
    """Gera um DataFrame de exemplo para a aplicação."""
    matriculas = [f'M{np.random.randint(1000, 2000)}' for _ in range(n_registros)]
    areas = np.random.choice(['Montagem', 'Solda', 'Pintura', 'Logística', 'Qualidade'], size=n_registros)
    epis = np.random.choice(['Capacete', 'Óculos', 'Luvas', 'Protetor Auricular'], size=n_registros)
    # Gerar datas nos últimos 60 dias para ter dados relevantes
    datas = pd.to_datetime(datetime.now() - pd.to_timedelta(np.random.randint(0, 60, size=n_registros), unit='d'))
    alertas = np.random.choice([0, 1], size=n_registros, p=[0.7, 0.3]) # 30% de chance de ser um alerta
    
    df = pd.DataFrame({
        'Matrícula': matriculas,
        'Área': areas,
        'EPI Removido': epis,
        'Horário da Checagem': datas,
        'Alerta Gerado': alertas
    })
    return df

# --- Callback para Atualizar os Dados ---
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
    Esta função gera dados de exemplo, aplica filtros e atualiza todos os componentes da interface.
    """
    df = gerar_dados_exemplo()
    df['Data da Checagem'] = pd.to_datetime(df['Horário da Checagem']).dt.date
    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].unique())]

    df_filtrado = df.copy()
    if matricula_digitada:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula_digitada, case=False, na=False)]
    if areas_selecionadas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas_selecionadas)]
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date.split('T')[0], '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date.split('T')[0], '%Y-%m-%d').date()
        df_filtrado = df_filtrado[(df_filtrado['Data da Checagem'] >= start_date_obj) & (df_filtrado['Data da Checagem'] <= end_date_obj)]
    
    df_alertas = df_filtrado[df_filtrado['Alerta Gerado'] == 1].copy()
    
    # --- Cálculos para os Cards ---
    today = datetime.now().date()
    start_of_week = today - pd.to_timedelta(today.weekday(), unit='d')
    
    alertas_hoje = df_alertas[df_alertas['Data da Checagem'] == today].shape[0]
    alertas_semana = df_alertas[df_alertas['Data da Checagem'] >= start_of_week].shape[0]

    card_dia_children = [html.H4("Alertas Hoje", style={'color': '#ccc'}), html.H2(f"{alertas_hoje}", style={'color': '#ff4d4d', 'marginTop': '10px'})]
    card_semana_children = [html.H4("Alertas na Semana", style={'color': '#ccc'}), html.H2(f"{alertas_semana}", style={'color': '#ff4d4d', 'marginTop': '10px'})]

    # --- Cálculo para o Gráfico Mensal ---
    df_alertas_mes = df_alertas[pd.to_datetime(df_alertas['Data da Checagem']).dt.month == today.month].copy()
    df_alertas_mes['Dia'] = pd.to_datetime(df_alertas_mes['Data da Checagem']).dt.day
    contagem_diaria = df_alertas_mes.groupby('Dia').size().reset_index(name='Contagem')
    
    fig_mensal = px.bar(contagem_diaria, x='Dia', y='Contagem', title=f'Alertas por Dia em {today.strftime("%B")}', text_auto=True)
    fig_mensal = estilizar_grafico(fig_mensal)
    
    # --- Preparação para a Tabela ---
    df_alertas_tabela = df_alertas.copy()
    if not df_alertas_tabela.empty:
        df_alertas_tabela['Horário da Checagem'] = df_alertas_tabela['Horário da Checagem'].dt.strftime('%d/%m/%Y %H:%M:%S')

    data_alertas = df_alertas_tabela.to_dict('records')
    columns_alertas = [{'name': col, 'id': col} for col in df_alertas_tabela.columns if col != 'Data da Checagem']

    contagem_alertas_texto = f"Total de Alertas Encontrados: {len(df_alertas)}"
    horario_atual = datetime.now().strftime("Última atualização: %d/%m/%Y %H:%M:%S")

    return area_options, data_alertas, columns_alertas, horario_atual, contagem_alertas_texto, card_dia_children, card_semana_children, fig_mensal

# --- Execução do Servidor ---
if __name__ == '__main__':
    app.run(debug=True)
