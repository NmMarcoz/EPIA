from ultralytics import YOLO
import cv2
import cvzone
from datetime import datetime, timedelta
import requests
import json


print("Iniciando o script...")
# Abre a webcam (0 = webcam padrão)
cap = cv2.VideoCapture(0)
print("Webcam iniciada.")
# Carrega o modelo treinado
model = YOLO("core/IA/runs/detect/train2/weights/best.pt")
print("Modelo carregado.")
# Classes usadas no seu modelo
classNames = ['helmet', 'vest']

sector = "683b9484eba56adc64b60a28" #TODO -> mock. Esse funciona em release
worker = "683b947ceba56adc64b60a25"

myColor = (0, 0, 255)

logs = []

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
        print("Nenhum log capturado")
        return
    
    url = "http://localhost:3000/logs/lot" 
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, json=logs, headers=headers)
        if response.status_code == 200 or response.status_code == 201:
            print("Logs enviados com sucesso!")
            #logs.clear() 
        else:
            print(f"Erro ao enviar logs. Status code: {response.status_code}")
            print(f"Resposta: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição: {e}")

def mountLogs(sector,worker,removedEpi, remotionHour, allEpicorrects, detectedEpi):
    if(len(logs) > 0 and tooEarly(logs[-1]["remotionHour"],remotionHour)):
        print("muito cedo, log nao salvo")
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
    print("log salvo");
    
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
    if diff >= timedelta(seconds=14):
       print("mais de 5 segundos entre eles")
       return False
    print("menos de 5 segundos")
    return True
    

while True:
    success, img = cap.read()
    if not success:
        break
    
    results = model(img, stream=True)
    detections_found = False 
    
    # for r in results:
    #     for box in r.boxes:
    #         x1, y1, x2, y2 = map(int, box.xyxy[0])
    #         conf = round(float(box.conf[0]), 2)
    #         cls = int(box.cls[0])
    #         currentClass = classNames[cls] if cls < len(classNames) else "N/A"
    #         if conf > 0.5:
    #             detections_found = True  # Marca que houve detecção
    #             if currentClass in classNames:
    #                 myColor = (0, 255, 0)
    #                 date = datetime.now().timestamp()                    
    #                 mountLogs(sector, worker, next(filter(lambda x: x != currentClass, classNames), None), date, len(currentClass) == len(classNames), currentClass)
    #             else:
    #                 date = datetime.now().timestamp()
    #                 mountLogs(sector, worker, classNames, date, False, None)
    #                 myColor = (255, 0, 0)

    #             cvzone.putTextRect(img, f'{currentClass} {conf}', (max(0, x1), max(35, y1)),
    #                                scale=1, thickness=1, colorB=myColor, colorT=(255, 255, 255),
    #                                colorR=myColor, offset=10)
    #             cv2.rectangle(img, (x1, y1), (x2, y2), myColor, 3)
      
    frame_detections = get_detections_in_frame(results)

    missing_epis = [epi for epi in classNames if epi not in frame_detections]
    if missing_epis:
        detections_found = True
        date = datetime.now().timestamp()
        mountLogs(sector, worker, missing_epis, date, False, None)
        myColor = (255, 0, 0)  # Cor para EPI ausente
    else:
        myColor = (0, 255, 0)  # Cor para EPI presente
    if not detections_found:
        date = datetime.now().timestamp()
        mountLogs(sector, worker, classNames, date, False, None)
   
    
    cv2.imshow("Webcam - PPE Detection", img)
    
    # Pressione 'q' para sair
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("Enviando logs para a API...")
sendToApi()
print("logs \n")
print(logs)

