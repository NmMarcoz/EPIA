from ultralytics import YOLO
import cv2
import cvzone


print("Iniciando o script...")
# Abre a webcam (0 = webcam padrão)
cap = cv2.VideoCapture(0)
print("Webcam iniciada.")
# Carrega o modelo treinado
model = YOLO("core/IA/runs/detect/train2/weights/best.pt")
print("Modelo carregado.")
# Classes usadas no seu modelo
classNames = ['helmet', 'vest']

myColor = (0, 0, 255)

while True:
    success, img = cap.read()
    if not success:
        break

    results = model(img, stream=True)
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = round(float(box.conf[0]), 2)
            cls = int(box.cls[0])
            currentClass = classNames[cls] if cls < len(classNames) else "N/A"

            if conf > 0.5:
                if currentClass in ['helmet', 'vest']:
                    myColor = (0, 255, 0)
                else:
                    myColor = (255, 0, 0)

                cvzone.putTextRect(img, f'{currentClass} {conf}', (max(0, x1), max(35, y1)),
                                   scale=1, thickness=1, colorB=myColor, colorT=(255, 255, 255),
                                   colorR=myColor, offset=10)
                cv2.rectangle(img, (x1, y1), (x2, y2), myColor, 3)

    cv2.imshow("Webcam - PPE Detection", img)

    # Pressione 'q' para sair
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
