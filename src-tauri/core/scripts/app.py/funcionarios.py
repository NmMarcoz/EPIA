# Importando as bibliotecas necessárias
from datetime import datetime, date, time
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import numpy as np # Importado para gerar dados de exemplo
import dash_iconify

# Inicializando o aplicativo Dash
app = Dash(__name__)

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
        html.H1('Dashboard de Funcionários', style={'color': '#3399ff', 'textAlign': 'center'}),
        html.P('Utilize os filtros para consultar as informações dos funcionários.', style={'textAlign': 'center', 'marginBottom': '30px'}),

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
                        style={'padding': '8px', 'borderRadius': '5px', 'border': '1px solid #3399ff', 'backgroundColor': '#3a3a3a', 'color': 'white'}
                    ),
                ], style={'display': 'flex', 'alignItems': 'center'}),

                # Filtro por Nome
                html.Div([
                    html.Label("Pesquisar por Nome:", style={'marginRight': '10px'}),
                    dcc.Input(
                        id='input-nome', type='text', placeholder='Digite o nome',
                        debounce=True,
                        style={'padding': '8px', 'borderRadius': '5px', 'border': '1px solid #3399ff', 'backgroundColor': '#3a3a3a', 'color': 'white'}
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

                # Botão de Atualizar
                html.Button(
                    id='botao-atualizar', n_clicks=0,
                    children=[
                        dash_iconify.DashIconify(icon="mdi:reload", width=20, height=20),
                        " Atualizar dados"
                    ],
                    style={'padding': '10px 20px', 'fontSize': '16px', 'backgroundColor': '#3399ff', 'color': 'white', 'border': 'none', 'borderRadius': '5px', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'gap': '8px'}
                ),
            ]
        ),
        
        # Div para exibir a última atualização
        html.Div(id='ultimo-update', style={'fontSize': '14px', 'color': '#ccc', 'textAlign': 'center', 'marginBottom': '20px'}),

        # --- Seção da Tabela de Funcionários ---
        html.Div(
            style={
                'backgroundColor': '#3a3a3a',
                'padding': '20px',
                'borderRadius': '10px',
                'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.2)',
                'maxWidth': '1200px',
                'margin': '0 auto' # Centraliza a tabela
            },
            children=[
                html.H3('Lista de Funcionários', style={'textAlign': 'center', 'color': '#3399ff', 'marginBottom': '15px'}),
                dash_table.DataTable(
                    id='tabela-funcionarios',
                    style_table={'overflowX': 'auto'},
                    style_cell={
                        'backgroundColor': '#3a3a3a',
                        'color': 'white',
                        'textAlign': 'left',
                        'padding': '10px',
                        'fontFamily': "'Roboto', sans-serif",
                        'border': '1px solid #555'
                    },
                    style_header={
                        'backgroundColor': '#3399ff',
                        'fontWeight': 'bold',
                        'color': 'white',
                        'fontSize': '14px',
                        'padding': '12px',
                        'border': '1px solid #555'
                    },
                    page_size=20,
                    fixed_rows={'headers': True},
                    style_as_list_view=True,
                ),
                html.Div(id='contagem-funcionarios', style={'textAlign': 'right', 'marginTop': '10px', 'color': '#ccc', 'fontWeight': 'bold'})
            ]
        )
    ]
)

def gerar_dados_funcionarios(n_registros=50):
    """Gera um DataFrame de exemplo com dados de funcionários."""
    nomes = ['Alice', 'Bruno', 'Carla', 'Daniel', 'Eduarda', 'Fábio', 'Gabriela', 'Hugo', 'Isabela', 'João']
    sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Ferreira', 'Costa', 'Rodrigues', 'Almeida']
    cargos = {
        'Montagem': ['Montador(a)', 'Líder de Montagem'],
        'Solda': ['Soldador(a)', 'Inspetor(a) de Solda'],
        'Pintura': ['Pintor(a)', 'Preparador(a)'],
        'Logística': ['Operador(a) de Empilhadeira', 'Almoxarife'],
        'Qualidade': ['Inspetor(a) de Qualidade', 'Analista de Qualidade']
    }
    
    data = []
    matriculas_usadas = set()
    while len(data) < n_registros:
        matricula = f'M{np.random.randint(1000, 2000)}'
        if matricula not in matriculas_usadas:
            matriculas_usadas.add(matricula)
            nome = np.random.choice(nomes)
            sobrenome = np.random.choice(sobrenomes)
            nome_completo = f'{nome} {sobrenome}'
            email = f'{nome.lower()}.{sobrenome.lower()}@empresa.com'.replace(' ', '')
            area = np.random.choice(list(cargos.keys()))
            cargo = np.random.choice(cargos[area])
            data.append({'Matrícula': matricula, 'Nome': nome_completo, 'Email': email, 'Cargo': cargo, 'Área': area})
            
    return pd.DataFrame(data)

# --- Callback para Atualizar os Dados ---
@app.callback(
    Output('dropdown-area', 'options'),
    Output('tabela-funcionarios', 'data'),
    Output('tabela-funcionarios', 'columns'),
    Output('ultimo-update', 'children'),
    Output('contagem-funcionarios', 'children'),
    Input('botao-atualizar', 'n_clicks'),
    State('input-matricula', 'value'),
    State('input-nome', 'value'),
    State('dropdown-area', 'value')
)
def atualizar_tabela_funcionarios(n_clicks, matricula, nome, areas):
    """
    Esta função gera dados de funcionários, aplica filtros e atualiza a tabela.
    """
    df = gerar_dados_funcionarios()
    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].unique())]
    
    df_filtrado = df.copy()
    if matricula:
        df_filtrado = df_filtrado[df_filtrado['Matrícula'].str.contains(matricula, case=False, na=False)]
    if nome:
        df_filtrado = df_filtrado[df_filtrado['Nome'].str.contains(nome, case=False, na=False)]
    if areas:
        df_filtrado = df_filtrado[df_filtrado['Área'].isin(areas)]
        
    data_funcionarios = df_filtrado.to_dict('records')
    columns_funcionarios = [{'name': col, 'id': col} for col in df_filtrado.columns]
    
    contagem_texto = f"Total de Funcionários Encontrados: {len(df_filtrado)}"
    horario_atual = datetime.now().strftime("Última atualização: %d/%m/%Y %H:%M:%S")

    return area_options, data_funcionarios, columns_funcionarios, horario_atual, contagem_texto

# --- Execução do Servidor ---
if __name__ == '__main__':
    app.run(debug=True)
