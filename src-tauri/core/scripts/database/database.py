import os
import pymongo
from pymongo import MongoClient
from datetime import datetime, timedelta
import pandas as pd
from typing import List, Dict, Optional
import logging

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.setup_connection()
    
    def setup_connection(self):
        """Configura a conexão com MongoDB"""
        try:
            # Tentar conectar com MongoDB Atlas primeiro
            atlas_uri = "mongodb+srv://epiaserver:flamengo@main.rvdosyd.mongodb.net/?retryWrites=true&w=majority&appName=main"
            
            try:
                self.client = MongoClient(atlas_uri, serverSelectionTimeoutMS=5000)
                # Testar conexão
                self.client.admin.command('ping')
                self.db = self.client['epia']  # Nome do banco de dados
                print("✅ Conectado ao MongoDB Atlas")
                return
            except Exception as e:
                print(f"❌ Erro ao conectar com Atlas: {e}")
            
            # Se Atlas falhar, tentar conexão local
            local_uri = "mongodb://localhost:27017/epia"
            try:
                self.client = MongoClient(local_uri, serverSelectionTimeoutMS=5000)
                self.client.admin.command('ping')
                self.db = self.client['epia']
                print("✅ Conectado ao MongoDB Local")
                return
            except Exception as e:
                print(f"❌ Erro ao conectar localmente: {e}")
                
            raise Exception("Não foi possível conectar a nenhuma instância do MongoDB")
            
        except Exception as e:
            logging.error(f"Erro na conexão com MongoDB: {e}")
            self.client = None
            self.db = None
    
    def get_connection_status(self):
        """Verifica status da conexão"""
        if self.client is None or self.db is None:
            return {"status": "disconnected", "message": "MongoDB não conectado"}
        
        try:
            self.client.admin.command('ping')
            return {"status": "connected", "message": "MongoDB conectado"}
        except Exception as e:
            return {"status": "error", "message": f"Erro na conexão: {e}"}
    
    def get_areas(self) -> List[str]:
        """Busca todas as áreas disponíveis"""
        try:
            if not self.db:
                return []
            
            # Assumindo que você tem uma collection 'funcionarios' ou 'dados'
            # Adjust o nome da collection conforme sua estrutura
            collection = self.db['funcionarios']  # ou 'dados', 'registros', etc.
            areas = collection.distinct('area')
            return sorted(areas)
            
        except Exception as e:
            logging.error(f"Erro ao buscar áreas: {e}")
            return []
    
    def get_dados_por_area(self, areas: Optional[List[str]] = None, 
                          start_date: Optional[str] = None, 
                          end_date: Optional[str] = None) -> Dict:
        """Busca dados agrupados por área"""
        try:
            if not self.db:
                return {}
            
            collection = self.db['funcionarios']
            
            # Construir filtro
            filtro = {}
            if areas:
                filtro['area'] = {'$in': areas}
            
            if start_date and end_date:
                filtro['data'] = {
                    '$gte': datetime.fromisoformat(start_date),
                    '$lte': datetime.fromisoformat(end_date)
                }
            
            # Agregação para contar por área
            pipeline = [
                {'$match': filtro},
                {'$group': {'_id': '$area', 'count': {'$sum': 1}}},
                {'$sort': {'_id': 1}}
            ]
            
            resultado = list(collection.aggregate(pipeline))
            
            # Converter para formato do gráfico
            areas_nomes = [item['_id'] for item in resultado]
            valores = [item['count'] for item in resultado]
            
            return {'areas': areas_nomes, 'valores': valores}
            
        except Exception as e:
            logging.error(f"Erro ao buscar dados por área: {e}")
            return {'areas': [], 'valores': []}
    
    def get_epirem_geral(self, areas: Optional[List[str]] = None,
                        start_date: Optional[str] = None,
                        end_date: Optional[str] = None) -> Dict:
        """Busca dados de EPIREM geral ao longo do tempo"""
        try:
            if not self.db:
                return {}
            
            collection = self.db['epirem']  # ou onde estão os dados de EPIREM
            
            # Construir filtro
            filtro = {}
            if areas:
                filtro['area'] = {'$in': areas}
            
            if start_date and end_date:
                filtro['data'] = {
                    '$gte': datetime.fromisoformat(start_date),
                    '$lte': datetime.fromisoformat(end_date)
                }
            
            # Agregação para média por mês
            pipeline = [
                {'$match': filtro},
                {'$group': {
                    '_id': {
                        'year': {'$year': '$data'},
                        'month': {'$month': '$data'}
                    },
                    'epirem_medio': {'$avg': '$valor_epirem'}
                }},
                {'$sort': {'_id.year': 1, '_id.month': 1}}
            ]
            
            resultado = list(collection.aggregate(pipeline))
            
            # Converter para formato do gráfico
            meses = []
            valores = []
            
            for item in resultado:
                mes_nome = f"{item['_id']['month']:02d}/{item['_id']['year']}"
                meses.append(mes_nome)
                valores.append(round(item['epirem_medio'], 2))
            
            return {'meses': meses, 'valores': valores}
            
        except Exception as e:
            logging.error(f"Erro ao buscar EPIREM geral: {e}")
            return {'meses': [], 'valores': []}
    
    def get_epirem_por_area(self, areas: Optional[List[str]] = None,
                           start_date: Optional[str] = None,
                           end_date: Optional[str] = None) -> Dict:
        """Busca dados de EPIREM por área"""
        try:
            if not self.db:
                return {}
            
            collection = self.db['epirem']
            
            # Construir filtro
            filtro = {}
            if areas:
                filtro['area'] = {'$in': areas}
            
            if start_date and end_date:
                filtro['data'] = {
                    '$gte': datetime.fromisoformat(start_date),
                    '$lte': datetime.fromisoformat(end_date)
                }
            
            # Agregação para média por área e mês
            pipeline = [
                {'$match': filtro},
                {'$group': {
                    '_id': {
                        'area': '$area',
                        'year': {'$year': '$data'},
                        'month': {'$month': '$data'}
                    },
                    'epirem_medio': {'$avg': '$valor_epirem'}
                }},
                {'$sort': {'_id.area': 1, '_id.year': 1, '_id.month': 1}}
            ]
            
            resultado = list(collection.aggregate(pipeline))
            
            # Organizar dados por área
            dados_por_area = {}
            for item in resultado:
                area = item['_id']['area']
                mes = f"{item['_id']['month']:02d}/{item['_id']['year']}"
                valor = round(item['epirem_medio'], 2)
                
                if area not in dados_por_area:
                    dados_por_area[area] = {'meses': [], 'valores': []}
                
                dados_por_area[area]['meses'].append(mes)
                dados_por_area[area]['valores'].append(valor)
            
            return dados_por_area
            
        except Exception as e:
            logging.error(f"Erro ao buscar EPIREM por área: {e}")
            return {}
    
    def get_alertas(self, areas: Optional[List[str]] = None,
                   start_date: Optional[str] = None,
                   end_date: Optional[str] = None) -> Dict:
        """Busca dados de alertas"""
        try:
            if not self.db:
                return {}
            
            collection = self.db['alertas']
            
            # Construir filtro
            filtro = {}
            if areas:
                filtro['area'] = {'$in': areas}
            
            if start_date and end_date:
                filtro['data'] = {
                    '$gte': datetime.fromisoformat(start_date),
                    '$lte': datetime.fromisoformat(end_date)
                }
            
            # Contar alertas por tipo
            pipeline = [
                {'$match': filtro},
                {'$group': {'_id': '$tipo', 'count': {'$sum': 1}}},
                {'$sort': {'count': -1}}
            ]
            
            resultado = list(collection.aggregate(pipeline))
            
            tipos = [item['_id'] for item in resultado]
            valores = [item['count'] for item in resultado]
            
            return {'tipos': tipos, 'valores': valores}
            
        except Exception as e:
            logging.error(f"Erro ao buscar alertas: {e}")
            return {'tipos': [], 'valores': []}
    
    def get_tabela_alertas(self, matricula: Optional[str] = None,
                          areas: Optional[List[str]] = None,
                          start_date: Optional[str] = None,
                          end_date: Optional[str] = None) -> List[Dict]:
        """Busca dados para tabela de alertas"""
        try:
            if not self.db:
                return []
            
            collection = self.db['alertas']
            
            # Construir filtro
            filtro = {}
            if matricula:
                filtro['matricula'] = {'$regex': matricula, '$options': 'i'}
            if areas:
                filtro['area'] = {'$in': areas}
            if start_date and end_date:
                filtro['data'] = {
                    '$gte': datetime.fromisoformat(start_date),
                    '$lte': datetime.fromisoformat(end_date)
                }
            
            # Buscar dados
            cursor = collection.find(filtro).sort('data', -1).limit(100)
            
            dados = []
            for doc in cursor:
                dados.append({
                    'Matrícula': doc.get('matricula', ''),
                    'Área': doc.get('area', ''),
                    'Tipo': doc.get('tipo', ''),
                    'Data': doc.get('data', '').strftime('%d/%m/%Y') if isinstance(doc.get('data'), datetime) else str(doc.get('data', ''))
                })
            
            return dados
            
        except Exception as e:
            logging.error(f"Erro ao buscar tabela de alertas: {e}")
            return []
    
    def get_tabela_dados(self, matricula: Optional[str] = None,
                        areas: Optional[List[str]] = None,
                        start_date: Optional[str] = None,
                        end_date: Optional[str] = None) -> List[Dict]:
        """Busca dados para tabela completa"""
        try:
            if not self.db:
                return []
            
            collection = self.db['funcionarios']
            
            # Construir filtro
            filtro = {}
            if matricula:
                filtro['matricula'] = {'$regex': matricula, '$options': 'i'}
            if areas:
                filtro['area'] = {'$in': areas}
            if start_date and end_date:
                filtro['data'] = {
                    '$gte': datetime.fromisoformat(start_date),
                    '$lte': datetime.fromisoformat(end_date)
                }
            
            # Buscar dados
            cursor = collection.find(filtro).sort('data', -1).limit(500)
            
            dados = []
            for doc in cursor:
                dados.append({
                    'Matrícula': doc.get('matricula', ''),
                    'Nome': doc.get('nome', ''),
                    'Área': doc.get('area', ''),
                    'EPIREM': doc.get('epirem', 0),
                    'Status': doc.get('status', 'Ativo')
                })
            
            return dados
            
        except Exception as e:
            logging.error(f"Erro ao buscar tabela de dados: {e}")
            return []
    
    def close_connection(self):
        """Fecha a conexão com MongoDB"""
        if self.client:
            self.client.close()
            print("🔌 Conexão MongoDB fechada")

# Instância global do gerenciador de banco
db_manager = DatabaseManager()