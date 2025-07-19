from ultralytics import YOLO
import cv2
import cvzone
from datetime import datetime, timedelta
import requests
import json
import threading
from queue import Queue
import argparse
from logger import Logger

logger = Logger()

url = "http://172.20.10.10:4747/video"

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=str, help='Caminho da webcam', default='0')
parser.add_argument('--interval', type=int, help='Intervalo (em segundos) de distância entre o envio de logs', default=3)
parser.add_argument('--processed_fps', type = int, help='Quantidade de frames por segundo que deseja processar', default = 5)
parser.add_argument('--debug', type=bool, help="Ativa os logs de debug", default=False)
args = parser.parse_args()

# Iniciando o log
logger.setup_debug(args.debug)
log = logger.get_logger()

# VARIAVEIS GLOBAIS
global cap
global LOG_INTERVAL
global WEBCAM_SOURCE
global CAM_FPS
global PROCESSED_FPS

CAM_FPS = 0

LOG_INTERVAL = args.interval
WEBCAM_SOURCE = args.source
PROCESSED_FPS = args.processed_fps


def initCap(url):
    source = 0
    if(url !='0'):
        source = url
    log.debug(f"source: {source}")
    global cap
    global CAM_FPS
    cap = cv2.VideoCapture(source)
    CAM_FPS = cap.get(cv2.CAP_PROP_FPS)
    cap.set(cv2.CAP_PROP_FPS, PROCESSED_FPS)
    log.debug(f"novo fps configurado para ser recebido: {cap.get(cv2.CAP_PROP_FPS)}")
    if not cap.isOpened():
        log.error("falha ao iniciar a camera")
        url = 0
        initCap(0)

log.info("Iniciando o script...")
log.debug("------------------------")
log.debug("Configurações selecionadas: ")
log.debug(f"INTERVALO DE LOGS: {LOG_INTERVAL}")
log.debug(f"CAMINHO DA WEBCAM: {WEBCAM_SOURCE}")
log.debug(f"FPS DA CAMERA: {CAM_FPS}")
log.debug(f"FPS A SEREM PROCESSADOS: {PROCESSED_FPS}")
log.debug("------------------------")

initCap(WEBCAM_SOURCE)

log.info("Webcam iniciada.")
# Carrega o modelo treinado
model = YOLO("core/IA/runs/detect/train2/weights/best.pt")
log.info("Modelo carregado.")
# Classes usadas no seu modelo
classNames = ['helmet', 'vest']

sector = "68435c0c486216841ad0e1df" #TODO -> mock. Esse funciona em release
worker = "68436688e0d3f051ba5e258f"
timestampz = datetime.now().timestamp() #isso aqui vai ser usado pra ver se o log ta mto cedo.
myColor = (0, 0, 255)

logs = []
log_queue = Queue()

def get_detections_in_frame(results):
    detections = []
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            if float(box.conf[0]) > 0.5:
                cls = int(box.cls[0])
                currentClass = classNames[cls] if cls < len(classNames) else "N/A"
                if currentClass in classNames:
                    detections.append(currentClass)
                cvzone.putTextRect(img, f'{currentClass} {box.conf}', (max(0, x1), max(35, y1)),
                scale=1, thickness=1, colorB=myColor, colorT=(255, 255, 255),
                colorR=myColor, offset=10)
                cv2.rectangle(img, (x1, y1), (x2, y2), myColor, 3)
    return detections

def sendToApi():
    if not logs:
        log.debug("Nenhum log capturado")
        return

    url = "http://localhost:3000/logs/lot"
    headers = {
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(url, json=logs, headers=headers)
        if response.status_code == 200 or response.status_code == 201:
            log.info("Logs enviados com sucesso!")
            #logs.clear()
        else:
            log.error(f"Erro ao enviar logs. Status code: {response.status_code}")
            log.error(f"Resposta: {response.text}")
    except requests.exceptions.RequestException as e:
        log.error(f"Erro na requisição: {e}")

def mountLogs(sector,worker,removedEpi, remotionHour, allEpicorrects, detectedEpi):
    if(len(logs) > 0 and tooEarly(logs[-1]["remotionHour"],remotionHour)):
        log.debug("muito cedo, log nao salvo")
        return
    removedEpiArray = []
    detectedEpiArray = []
    if not isinstance(removedEpi, list) and not removedEpi is None:
        removedEpiArray.append(removedEpi)
    else:
        removedEpiArray = removedEpi

    if not isinstance(detectedEpi, list) and not detectedEpi is None:
        detectedEpiArray.append(detectedEpi)
    else:
        detectedEpiArray = detectedEpi
    logs.append({
        "sector": sector,
        "worker": worker,
        "removedEpi": removedEpiArray,
        "remotionHour": str(remotionHour),
        "allEpiCorrects": allEpicorrects,
        "detectedEpi": detectedEpiArray
    })
    log.debug("log salvo")

def log_sender_worker():
    url = "http://localhost:3000/logs"
    headers = {'Content-Type': 'application/json'}
    while True:
        unitaryLog = log_queue.get()
        if unitaryLog is None:
            break  # Permite encerrar a thread se necessário
        try:
            response = requests.post(url, json=unitaryLog, headers=headers)
            if response.status_code in (200, 201):
                log.info("Log enviado com sucesso!")
            else:
                log.error(f"Erro ao enviar log. Status code: {response.status_code}")
                log.error(f"Resposta: {response.text}")
        except requests.exceptions.RequestException as e:
            log.error(f"Erro na requisição: {e}")
        log_queue.task_done()

# Thread que envia os logs.
sender_thread = threading.Thread(target=log_sender_worker, daemon=True)
sender_thread.start()

def mountAndSendToEpi(sector,worker,removedEpi, remotionHour, allEpicorrects, detectedEpi):
    global timestampz
    if(tooEarly(timestampz, remotionHour)):
        log.debug("muito cedo, log nao salvo")
        return
    timestampz = remotionHour
    removedEpiArray = []
    detectedEpiArray = []
    if not isinstance(removedEpi, list) and not removedEpi is None:
        removedEpiArray.append(removedEpi)
    else:
        removedEpiArray = removedEpi

    if not isinstance(detectedEpi, list) and not detectedEpi is None:
        detectedEpiArray.append(detectedEpi)
    else:
        detectedEpiArray = detectedEpi
    unitaryLog = {
        "sector": sector,
        "worker": worker,
        "removedEpi": removedEpiArray,
        "remotionHour": str(remotionHour),
        "allEpiCorrects": allEpicorrects,
        "notify": True
    }
    log.debug(f"unitary log: {unitaryLog}")
    log_queue.put(unitaryLog)
    log.debug("log enfileirado")

#aqui eu defini um intervalo pra não sobrecarregar o banco de dados.
# As remoções tem que estar há 5s de diferença
def tooEarly(date1, date2):
    date1 = float(date1)
    date2 = float(date2)
    if isinstance(date1, float):  # se for timestamp
        date1 = datetime.fromtimestamp(date1)
    if isinstance(date2, float):  # se for timestamp
        date2 = datetime.fromtimestamp(date2)

    diff = date2 - date1
    if diff >= timedelta(LOG_INTERVAL):
       log.debug(f"mais de {LOG_INTERVAL} segundos entre eles")
       return False
    return True


while True:
    success, img = cap.read()
    if not success:
        break

    results = model(img, stream=True)
    detections_found = False

    frame_detections = get_detections_in_frame(results)

    missing_epis = [epi for epi in classNames if epi not in frame_detections]
    if missing_epis:
        detections_found = True
        date = datetime.now().timestamp()
        thread = threading.Thread(target=mountAndSendToEpi, args=(sector, worker, missing_epis, date, False, None))
        thread.start()

        myColor = (255, 0, 0)  # Cor para EPI ausente
    else:
        #se detectou as epis corretas, reseto o timestamp.
        timestampz = datetime.now().timestamp()
        myColor = (0, 255, 0)  # Cor para EPI presente
    if not detections_found:
        date = datetime.now().timestamp()
        thread = threading.Thread(target=mountAndSendToEpi, args=(sector, worker, missing_epis, date, False, None))
        thread.start()


    cv2.imshow("Webcam - PPE Detection", img)

    # Pressione 'q' para sair
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
log.info("Enviando logs para a API...")
##sendToApi()
log.debug("logs:")
log.debug(logs)
