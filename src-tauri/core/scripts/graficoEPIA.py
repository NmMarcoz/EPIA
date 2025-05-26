# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.


from dash import Dash, html, dcc
import plotly.express as px
import pandas as pd

app = Dash()

# MOCK DOS DADOS -  base de dados local (dentro do codigo)
dados_alertas = pd.DataFrame({
    "Alerta": ["Capacete removido", "Óculos ausente", "Colete não identificado"],
    "Área": ["Cais", "Armazém", "Guindaste"],
    "Horário": ["08:00", "09:15", "10:30"]
})

dados_uso_mensal = pd.DataFrame({
    "Mês": ["Jan", "Fev", "Mar", "Abr"],
    "Conformidade (%)": [88, 91, 85, 93],
    "Área": ["Cais", "Cais", "Cais", "Cais"]
})

dados_uso_diario = pd.DataFrame({
    "Dia": ["Seg", "Ter", "Qua", "Qui", "Sex"],
    "Uso (%)": [92, 87, 90, 85, 93],
})

dados_remocao = pd.DataFrame({
    "Área": ["Cais", "Armazém", "Guindaste"],
    "Capacete": [12, 18, 2],
    "Óculos": [9, 10, 4],
    "Colete": [3, 12, 0]
})

# contando quantos alertas foram gerados 
contagem_alertas = dados_alertas['Área'].value_counts().reset_index()
contagem_alertas.columns = ['Área', 'Quantidade']

# criando um grafico para a base de alertas gerados 
fig = px.bar(contagem_alertas, x='Área', y='Quantidade',
             title='Quantidade de alertas por área',
             labels={'Área': 'Área', 'Quantidade': 'Número de alertas'})

app.layout = html.Div(children=[
    html.H1(children='Olá Usuário'),

    html.Div(children='''
        Visão geral dos dados EP-IA
    '''),

    dcc.Graph(
        id='example-graph',
        figure=fig
    )
])

if __name__ == '__main__':
    app.run(debug=True)
