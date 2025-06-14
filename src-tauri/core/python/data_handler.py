climport requests

# URL da API para a qual você quer fazer a requisição
url = "http://localhost:3000"

try:
    # Fazendo a requisição GET
    response = requests.get(url)

    # Verificando se a requisição foi bem-sucedida (código de status 200)
    if response.status_code == 200:
        # Extraindo os dados da resposta em formato JSON
        dados = response.json()
        print("Dados recebidos:")
        print(dados)
    else:
        print(f"Erro na requisição. Código de status: {response.status_code}")

except requests.exceptions.RequestException as e:
    print(f"Ocorreu um erro ao fazer a requisição: {e}")