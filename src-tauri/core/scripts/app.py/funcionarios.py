# Importando as bibliotecas necessárias
from datetime import datetime
from dash import Dash, html, dcc, Output, Input, dash_table, State
import pandas as pd
import requests # Importado para fazer requisições à API
import dash_iconify

# Inicializando o aplicativo Dash
app = Dash(__name__)

# --- FUNÇÃO MODIFICADA PARA BUSCAR DADOS DE FUNCIONÁRIOS DA API ---
def buscar_dados_funcionarios_api():
    """
    Busca dados de funcionários da API, trata erros e retorna um DataFrame.
    """
    # !!! ATENÇÃO: Ajuste esta URL para o endpoint correto da sua API de funcionários !!!
    url = "http://localhost:3000/workers" 
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        dados_json = response.json()
        if not dados_json:
            print("Aviso: A API de funcionários retornou uma lista vazia.")
            return pd.DataFrame()
            
        df = pd.json_normalize(dados_json)
        
        print(f"Sucesso! {len(df)} registros de funcionários recebidos da API.")
        
        # Mapeia os nomes das colunas da API para nomes mais amigáveis no dashboard.
        mapa_colunas = {
            'registrationNumber': 'Matrícula',
            'name': 'Nome',
            'email': 'Email',
            'function': 'Cargo',
            'sector.name': 'Área'
        }
        
        # --- CORREÇÃO DO ERRO ---
        # Antes de renomear, verifica se a coluna 'sector.name' existe.
        # Se não existir, cria a coluna 'Área' com um valor padrão para evitar o erro.
        if 'sector.name' not in df.columns:
            print("Aviso: A coluna 'sector.name' não foi encontrada. A coluna 'Área' será preenchida com 'Não especificada'.")
            df['Área'] = 'Não especificada'

        df.rename(columns=mapa_colunas, inplace=True)
        
        # Garante que as colunas essenciais para o dashboard existam
        colunas_essenciais = ['Matrícula', 'Nome', 'Email', 'Cargo', 'Área']
        for col in colunas_essenciais:
            if col not in df.columns:
                # Se uma coluna essencial não for encontrada, retorna um DataFrame vazio para não quebrar o app
                print(f"ERRO: A coluna esperada '{col}' não foi encontrada nos dados da API após a transformação.")
                return pd.DataFrame()
        
        # Retorna apenas as colunas que serão usadas, na ordem desejada
        return df[colunas_essenciais]

    except requests.exceptions.RequestException as e:
        print(f"ERRO: Não foi possível conectar à API de funcionários em {url}. Detalhes: {e}")
        return pd.DataFrame()
    except (ValueError, KeyError) as e:
        print(f"ERRO: Problema ao processar os dados de funcionários. Detalhes: {e}")
        return pd.DataFrame()


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
    Esta função busca dados de funcionários da API, aplica filtros e atualiza a tabela.
    """
    # MODIFICAÇÃO: Busca dados da API em vez de gerar dados de exemplo
    df = buscar_dados_funcionarios_api()
    
    # Se a API falhar ou não retornar dados, exibe uma mensagem de erro e componentes vazios
    if df.empty:
        horario_falha = datetime.now().strftime("Falha ao carregar dados da API em %d/%m/%Y %H:%M:%S")
        return [], [], [], horario_falha, "Nenhum funcionário encontrado"
        
    area_options = [{'label': area, 'value': area} for area in sorted(df['Área'].dropna().unique())]
    
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
    horario_atual = datetime.now().strftime("Última atualização: %d/%m/%Y %H:%M:%S")

    return area_options, data_funcionarios, columns_funcionarios, horario_atual, contagem_texto

# --- Execução do Servidor ---
if __name__ == '__main__':
    app.run(debug=True)
