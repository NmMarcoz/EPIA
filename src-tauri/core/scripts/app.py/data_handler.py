# Importações necessárias
from datetime import datetime, timedelta
import pandas as pd
from pymongo import MongoClient
from typing import List, Dict, Optional

# ==================== CONFIGURAÇÃO DO BANCO DE DADOS ====================
# (Cole aqui suas classes DatabaseConfig e MongoDBConnection)
# Exemplo simplificado:
class MongoDBConnection:
    # ... (seu código de conexão aqui) ...
    # Garanta que a instância da conexão seja criada.
    def __init__(self):
        # Substitua com sua lógica de conexão real
        try:
            self.client = MongoClient("mongodb+srv://epiaserver:flamengo@main.rvdosyd.mongodb.net/?retryWrites=true&w=majority&appName=main", serverSelectionTimeoutMS=5000)
            self.db = self.client['epia']
            self.client.admin.command('ping')
            print("✅ Conexão com MongoDB estabelecida com sucesso!")
        except Exception as e:
            self.client = None
            self.db = None
            print(f"❌ Erro ao conectar com MongoDB: {e}")
    
    def is_connected(self):
        return self.client is not None

    def get_collection(self, name):
        if self.is_connected():
            return self.db[name]
        return None

mongo_conn = MongoDBConnection()

# ==================== FUNÇÕES DE ACESSO AOS DADOS ====================

# CORREÇÃO: A função 'buscar_alertas' é definida ANTES de ser usada.
def buscar_alertas(matricula: Optional[str] = None,
                   areas: Optional[List[str]] = None,
                   start_date: Optional[str] = None,
                   end_date: Optional[str] = None) -> List[Dict]:
    """Busca alertas do sistema no banco de dados."""
    if not mongo_conn.is_connected():
        return []
    
    collection = mongo_conn.get_collection('alertas')
    if not collection:
        return []

    query = {}
    if matricula:
        query['matricula'] = {'$regex': matricula, '$options': 'i'}
    if areas:
        query['area'] = {'$in': areas}
    
    # Lógica de data aprimorada para aceitar início e/ou fim
    date_query = {}
    if start_date:
        try:
            date_query['$gte'] = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        except (ValueError, TypeError):
            pass  # Ignora datas inválidas ou nulas
    if end_date:
        try:
            date_query['$lte'] = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except (ValueError, TypeError):
            pass  # Ignora datas inválidas ou nulas
            
    if date_query:
        query['data'] = date_query
    
    try:
        # Busca sem limite para garantir que os cálculos de KPI sejam corretos
        alertas = list(collection.find(query).sort('data', -1))
        return alertas
    except Exception as e:
        print(f"Erro ao buscar alertas no banco de dados: {e}")
        return []

#
# As funções abaixo agora podem chamar 'buscar_alertas' sem erro.
#
def calcular_kpis_alertas() -> dict:
    """Calcula os KPIs de alertas para hoje e para a semana atual."""
    # Busca alertas dos últimos 7 dias para otimizar
    start_date = (datetime.now() - timedelta(days=7)).isoformat()
    # Esta chamada agora funciona
    alertas = buscar_alertas(start_date=start_date)
    
    if not alertas:
        return {'hoje': 0, 'semana': 0}
    
    # Garante que 'data' é um campo obrigatório
    alertas_validos = [alerta for alerta in alertas if 'data' in alerta and isinstance(alerta['data'], datetime)]
    if not alertas_validos:
        return {'hoje': 0, 'semana': 0}

    df = pd.DataFrame(alertas_validos)
    df['data'] = pd.to_datetime(df['data'])
    
    hoje = datetime.now().date()
    # O início da semana é segunda-feira (weekday=0)
    inicio_semana = hoje - timedelta(days=hoje.weekday())
    
    # Contagem de hoje
    alertas_hoje = df[df['data'].dt.date == hoje].shape[0]
    
    # Contagem da semana
    alertas_semana = df[df['data'].dt.date >= inicio_semana].shape[0]
    
    return {'hoje': alertas_hoje, 'semana': alertas_semana}


def dados_grafico_mensal_alertas() -> dict:
    """Prepara os dados para o gráfico de alertas por dia no mês atual."""
    hoje = datetime.now()
    inicio_mes = hoje.replace(day=1, hour=0, minute=0, second=0)
    
    # Esta chamada agora funciona
    alertas = buscar_alertas(start_date=inicio_mes.isoformat())
    
    if not alertas:
        return {'dias': [], 'valores': []}
        
    alertas_validos = [alerta for alerta in alertas if 'data' in alerta and isinstance(alerta['data'], datetime)]
    if not alertas_validos:
        return {'dias': [], 'valores': []}

    df = pd.DataFrame(alertas_validos)
    df['data'] = pd.to_datetime(df['data'])
    
    # Agrupa por dia e conta os alertas
    alertas_por_dia = df.groupby(df['data'].dt.date).size()
    
    # Garante que todos os dias do mês até hoje estejam no gráfico
    dias_no_mes = pd.date_range(start=inicio_mes.date(), end=hoje.date())
    alertas_por_dia = alertas_por_dia.reindex(dias_no_mes, fill_value=0)
    
    return {
        'dias': alertas_por_dia.index.strftime('%Y-%m-%d'),
        'valores': alertas_por_dia.values
    }

