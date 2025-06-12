# Importando as bibliotecas necessárias
from datetime import datetime, date, time
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import numpy as np # Importado para gerar dados de exemplo
import plotly.express as px
import dash_iconify

# Inicializando o aplicativo Dash
app = Dash(__name__)

# Função para gerar dados de exemplo, substituindo a leitura do Excel
def gerar_dados_exemplo(n_registros=200):
    """Gera um DataFrame de exemplo para a aplicação."""
    matriculas = [f'M{np.random.randint(1000, 2000)}' for _ in range(n_registros)]
    areas = np.random.choice(['Montagem', 'Solda', 'Pintura', 'Logística', 'Qualidade'], size=n_registros)
    epis = np.random.choice(['Capacete', 'Óculos', 'Luvas', 'Protetor Auricular'], size=n_registros)
    datas = pd.to_datetime(pd.to_datetime('2024-01-01') + pd.to_timedelta(np.random.randint(0, 365, size=n_registros), unit='d'))
    alertas = np.random.choice([0, 1], size=n_registros, p=[0.7, 0.3])
    
    df = pd.DataFrame({
        'Matrícula': matriculas,
        'Área': areas,
        'EPI Removido': epis,
        'Horário da Checagem': datas,
        'Alerta Gerado': alertas
    })
    return df

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
    df = gerar_dados_exemplo()
    df['Data da Checagem'] = df['Horário da Checagem'].dt.date
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
    df_alertas_filtrado['Hora'] = df_alertas_filtrado['Horário da Checagem'].dt.hour
    contagem_horas = df_alertas_filtrado['Hora'].value_counts().sort_index().reset_index()
    contagem_horas.columns = ['Hora', 'Quantidade de Alertas']
    grafico_alertas = estilizar_grafico(px.bar(contagem_horas, x='Hora', y='Quantidade de Alertas', title='Distribuição de Alertas por Hora', text_auto=True))
    grafico_alertas.update_xaxes(tickvals=list(range(24)))

    # --- Tabela de Dados Completos ---
    data_tabela = df_filtrado.to_dict('records')
    colunas_tabela = [{'name': col, 'id': col} for col in df_filtrado.columns]

    contagem_dados_texto = f"Total de Registros: {len(df_filtrado)}"
    horario_atual = datetime.now().strftime("Atualizado em: %d/%m/%Y %H:%M:%S")

    return (area_options, grafico_area, grafico_epirem, grafico_epirem_area, 
            grafico_alertas, data_tabela, colunas_tabela, horario_atual, contagem_dados_texto)

# --- Execução do Servidor ---
if __name__ == '__main__':
    app.run(debug=True)
