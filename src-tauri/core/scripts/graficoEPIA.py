from datetime import datetime, date, time # Importe date para o DatePickerRange
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import plotly.express as px
import dash_iconify

app = Dash()

def estilizar_grafico(fig):
    fig.update_layout(
        plot_bgcolor='#2e2e2e',
        paper_bgcolor='#2e2e2e',
        font=dict(color='white', family="'Roboto', sans-serif"),
        title_font=dict(color='#3399ff'),
        legend=dict(bgcolor='#2e2e2e', font=dict(color='white')),
        margin=dict(l=40, r=40, t=60, b=40),
        xaxis_tickformat='%H:%M' # Formata os ticks do eixo X para mostrar apenas a hora
    )
    fig.update_traces(textposition='outside', textfont=dict(color='white'))
    return fig

app.layout = html.Div(
    style={
        'width': '100%',
        'height': 'auto',
        'minHeight': '100%',
        'margin': '0 auto',
        'padding': '0px',
        'boxSizing': 'border-box',
        'backgroundColor': '#2e2e2e',
        'fontFamily': "'Roboto', sans-serif",
        'color': 'white',
        'display': 'flex',
        'flexDirection': 'column',
        'overflow': 'hidden',
    },
    children=[
        html.H1('Olá Usuário', style={'color': '#3399ff', 'margin': '0 0 10px 0', 'textAlign': 'center'}),
        html.Div('Visão geral dos dados EP-IA', style={'marginBottom': '20px', 'textAlign': 'center'}),
        html.Div(
            style={'display': 'flex', 'justifyContent': 'flex-end', 'marginBottom': '5px', 'alignItems': 'center', 'gap': '20px', 'flexWrap': 'wrap'},
            children=[
                # --- Campo de pesquisa por Matrícula ---
                html.Div(
                    style={'display': 'flex', 'alignItems': 'center', 'gap': '10px'},
                    children=[
                        html.Label("Pesquisar por Matrícula:", style={'color': 'white', 'fontSize': '16px'}),
                        dcc.Input(
                            id='input-matricula',
                            type='text',
                            placeholder='Digite a matrícula',
                            debounce=True,
                            style={
                                'padding': '8px',
                                'borderRadius': '5px',
                                'border': '1px solid #3399ff',
                                'backgroundColor': '#3a3a3a',
                                'color': 'white',
                                'fontSize': '16px',
                                'width': '150px'
                            }
                        ),
                    ]
                ),
                # --- NOVO: Filtro por Área ---
                html.Div(
                    style={'display': 'flex', 'alignItems': 'center', 'gap': '10px'},
                    children=[
                        html.Label("Filtrar por Área:", style={'color': 'white', 'fontSize': '16px'}),
                        dcc.Dropdown(
                            id='dropdown-area',
                            options=[], # Será preenchido via callback
                            multi=True,
                            placeholder="Selecione a(s) área(s)",
                            style={
                                'width': '200px',
                                'color': '#333',
                                'backgroundColor': '#3a3a3a',
                                'border': '1px solid #3399ff',
                                'borderRadius': '5px',
                            },
                            className='dash-bootstrap' # Para estilização padrão do Dash
                        ),
                    ]
                ),
                # --- NOVO: Filtro por Data ---
                html.Div(
                    style={'display': 'flex', 'alignItems': 'center', 'gap': '10px'},
                    children=[
                        html.Label("Filtrar por Data:", style={'color': 'white', 'fontSize': '16px'}),
                        dcc.DatePickerRange(
                            id='date-picker-range',
                            display_format='DD/MM/YYYY',
                            start_date_placeholder_text="Data Início",
                            end_date_placeholder_text="Data Fim",
                            style={
                                'border': '1px solid #3399ff',
                                'borderRadius': '5px',
                                'color': 'white',
                                'backgroundColor': '#3a3a3a',
                            },
                            day_size=39,
                            month_format='MMMM Y',
                            number_of_months_shown=2,
                            clearable=True,
                            persistence=True,
                            persisted_props=['start_date', 'end_date'],
                            persistence_type='session',
                        ),
                    ]
                ),
                html.Button(
                    id='botao-atualizar',
                    n_clicks=0,
                    children=[
                        dash_iconify.DashIconify(icon="mdi:reload", width=20, height=20),
                        "Atualizar dados"
                    ],
                    style={
                        'padding': '10px 20px',
                        'fontSize': '16px',
                        'backgroundColor': '#3399ff',
                        'color': 'white',
                        'border': 'none',
                        'borderRadius': '5px',
                        'cursor': 'pointer',
                        'display': 'flex',
                        'alignItems': 'center',
                        'gap': '8px'
                    }
                ),
                html.Div(id='ultimo-update', style={'fontSize': '14px', 'color': '#ccc'})
            ]
        ),
        html.Div(
            className='grid-container',
            style={
                'display': 'grid',
                'gridTemplateColumns': 'repeat(auto-fit, minmax(400px, 1fr))',
                'gridAutoRows': 'auto',
                'gap': '20px',
                'flexGrow': 1,
                'overflowY': 'auto',
                'paddingBottom': '20px',
            },
            children=[
                dcc.Graph(id='grafico-area', style={'width': '100%', 'height': '100%', 'borderRadius': '10px'}),
                dcc.Graph(id='grafico-epirem', style={'width': '100%', 'height': '100%', 'borderRadius': '10px'}),
                dcc.Graph(id='grafico-epirem-area', style={'width': '100%', 'height': '100%', 'borderRadius': '10px'}),
                dcc.Graph(id='grafico-alertas', style={'width': '100%', 'height': '100%', 'borderRadius': '10px'}),
                html.Div(
                    style={
                        'gridColumn': '1 / -1',
                        'display': 'flex',
                        'flexWrap': 'wrap',
                        'gap': '20px',
                        'justifyContent': 'space-around',
                    },
                    children=[
                        html.Div(
                            children=[
                                html.H3('Alertas Gerados', style={'textAlign': 'center', 'color': '#ff4d4d', 'marginBottom': '10px'}),
                                dash_table.DataTable(
                                    id='tabela-alertas',
                                    style_table={
                                        'overflowX': 'auto',
                                        'maxHeight': '400px',
                                        'overflowY': 'auto',
                                        'minWidth': '100%',
                                    },
                                    style_cell={
                                        'backgroundColor': '#5a1f1f',
                                        'color': 'white',
                                        'textAlign': 'left',
                                        'padding': '6px 8px',
                                        'fontFamily': "'Roboto', sans-serif",
                                        'minWidth': '100px', 'width': '150px', 'maxWidth': '300px',
                                    },
                                    style_header={
                                        'backgroundColor': '#ff4d4d',
                                        'fontWeight': 'bold',
                                        'color': 'white',
                                        'fontSize': '13px',
                                        'padding': '6px 8px',
                                    },
                                    page_size=10,
                                    fixed_rows={'headers': True},
                                    style_as_list_view=True,
                                ),
                                html.Div(id='contagem-alertas', style={'textAlign': 'right', 'marginTop': '5px', 'color': '#ccc'})
                            ],
                            style={
                                'flex': '1 1 45%',
                                'borderRadius': '10px',
                                'maxHeight': '400px',
                                'overflowY': 'auto',
                            }
                        ),
                        html.Div(
                            children=[
                                html.H3('Dados Completos', style={'textAlign': 'center', 'color': '#3399ff', 'marginBottom': '10px'}),
                                dash_table.DataTable(
                                    id='tabela-dados',
                                    style_table={
                                        'overflowX': 'auto',
                                        'maxHeight': '400px',
                                        'overflowY': 'auto',
                                        'minWidth': '100%',
                                    },
                                    style_cell={
                                        'backgroundColor': '#3a3a3a',
                                        'color': 'white',
                                        'textAlign': 'left',
                                        'padding': '6px 8px',
                                        'fontFamily': "'Roboto', sans-serif",
                                        'minWidth': '100px', 'width': '150px', 'maxWidth': '300px',
                                    },
                                    style_header={
                                        'backgroundColor': '#3399ff',
                                        'fontWeight': 'bold',
                                        'color': 'white',
                                        'fontSize': '13px',
                                        'padding': '6px 8px',
                                    },
                                    page_size=10,
                                    fixed_rows={'headers': True},
                                    style_as_list_view=True,
                                ),
                                html.Div(id='contagem-dados', style={'textAlign': 'right', 'marginTop': '5px', 'color': '#ccc'})
                            ],
                            style={
                                'flex': '1 1 45%',
                                'borderRadius': '10px',
                                'maxHeight': '400px',
                                'overflowY': 'auto',
                            }
                        )
                    ]
                )
            ]
        )
    ]
)

@app.callback(
    Output('dropdown-area', 'options'), # NOVO: Output para preencher as opções do dropdown
    Output('grafico-area', 'figure'),
    Output('grafico-epirem', 'figure'),
    Output('grafico-epirem-area', 'figure'),
    Output('grafico-alertas', 'figure'),
    Output('tabela-alertas', 'data'),
    Output('tabela-alertas', 'columns'),
    Output('tabela-dados', 'data'),
    Output('tabela-dados', 'columns'),
    Output('botao-atualizar', 'disabled'),
    Output('ultimo-update', 'children'),
    Output('contagem-alertas', 'children'),
    Output('contagem-dados', 'children'),
    Input('botao-atualizar', 'n_clicks'),
    Input('input-matricula', 'value'),
    Input('dropdown-area', 'value'), # NOVO: Input para o filtro de área
    Input('date-picker-range', 'start_date'), # NOVO: Input para a data de início
    Input('date-picker-range', 'end_date') # NOVO: Input para a data de fim
)
def atualizar_tudo(n_clicks, matricula_digitada, areas_selecionadas, start_date, end_date):
    disabled = True

    df = pd.read_excel(
        "../database/dados_epi.xlsx",
        engine="openpyxl"
    )

    df['Horário da Checagem'] = pd.to_datetime(df['Horário da Checagem'])
    df['Data da Checagem'] = df['Horário da Checagem'].dt.date # Nova coluna para a data (apenas data)

    # Preencher opções do dropdown de área (antes de filtrar o df principal para que todas as áreas estejam disponíveis)
    area_options = [{'label': area, 'value': area} for area in df['Área'].unique()]

    df_filtrado = df.copy()

    # --- Aplicar filtro de matrícula ---
    if matricula_digitada:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].astype(str).str.contains(matricula_digitada, case=False, na=False)].copy()

    # --- Aplicar filtro de área ---
    if areas_selecionadas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas_selecionadas)].copy()

    # --- Aplicar filtro de data ---
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        df_filtrado = df_filtrado[
            (df_filtrado['Data da Checagem'] >= start_date_obj) &
            (df_filtrado['Data da Checagem'] <= end_date_obj)
        ].copy()


    df_alertas = df_filtrado[df_filtrado['Alerta Gerado'] == 1].copy()

    hora_inicio = time(7, 0, 0)
    hora_fim = time(16, 0, 0)

    df_alertas_filtrado_horario = df_alertas[
        (df_alertas['Horário da Checagem'].dt.time >= hora_inicio) &
        (df_alertas['Horário da Checagem'].dt.time <= hora_fim)
    ].copy()

    # --- Gráfico de Área ---
    contagem_area = df_filtrado['Área'].value_counts().reset_index()
    contagem_area.columns = ['Área', 'Quantidade']
    grafico_area = px.bar(
        contagem_area,
        x='Área',
        y='Quantidade',
        title='Quantidade de registros por Área',
        text_auto=True
    )
    grafico_area = estilizar_grafico(grafico_area)

    # --- Gráfico EPI Removido ---
    contagem_epi = df_filtrado['EPI Removido'].value_counts().reset_index()
    contagem_epi.columns = ['EPI Removido', 'Quantidade']
    grafico_epirem = px.bar(
        contagem_epi,
        x='EPI Removido',
        y='Quantidade',
        title='Quantidade por EPI Removido',
        text_auto=True
    )
    grafico_epirem = estilizar_grafico(grafico_epirem)

    # --- Gráfico EPI Removido por Área ---
    grafico_epirem_area = px.histogram(
        df_filtrado,
        x='Área',
        color='EPI Removido',
        barmode='group',
        title='EPI Removido por Área',
        text_auto=True
    )
    grafico_epirem_area = estilizar_grafico(grafico_epirem_area)

    # --- Gráfico Alertas por Horário da Checagem ---
    df_alertas_filtrado_horario['Hora do Dia'] = df_alertas_filtrado_horario['Horário da Checagem'].dt.hour.astype(str) + ':00'
    # Converte para datetime.time para garantir a ordenação correta no gráfico
    df_alertas_filtrado_horario['Hora do Dia'] = pd.to_datetime(df_alertas_filtrado_horario['Hora do Dia'], format='%H:%M').dt.time

    grafico_alertas = px.histogram(
        df_alertas_filtrado_horario,
        x='Hora do Dia',
        title='Distribuição de Alertas por Horário da Checagem (07:00h - 16:00h)',
        text_auto=True,
        category_orders={"Hora do Dia": [f"{h:02d}:00" for h in range(7, 17)]}
    )
    grafico_alertas = estilizar_grafico(grafico_alertas)
    grafico_alertas.update_xaxes(tickformat="%H:%M")


    data_alertas = df_alertas.to_dict('records')
    columns_alertas = [{'name': col, 'id': col} for col in df_alertas.columns]

    data = df_filtrado.to_dict('records')
    columns = [{'name': col, 'id': col} for col in df_filtrado.columns]

    contagem_alertas_texto = f"Total de Alertas: {len(df_alertas)}"
    contagem_dados_texto = f"Total de Registros: {len(df_filtrado)}"

    horario_atual = datetime.now().strftime("Última atualização: %d/%m/%Y %H:%M:%S")

    disabled = False

    return (
        area_options, # Retorna as opções do dropdown de área
        grafico_area,
        grafico_epirem,
        grafico_epirem_area,
        grafico_alertas,
        data_alertas,
        columns_alertas,
        data,
        columns,
        disabled,
        horario_atual,
        contagem_alertas_texto,
        contagem_dados_texto
    )

if __name__ == '__main__':
    app.run(debug=True)