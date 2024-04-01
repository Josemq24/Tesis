import pandas as pd
import sys

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import MinMaxScaler

# Cargar los datos desde el archivo CSV
data = pd.read_csv('datos1.csv')

# Separar los datos en características (X) y etiquetas (y)
X = data.iloc[:, :-1]
y = data.iloc[:, -1]

# Normalizar las características utilizando MinMaxScaler
scaler = MinMaxScaler()
X = scaler.fit_transform(X)

# Dividir los datos en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Inicializar y entrenar el modelo de regresión lineal
model = LogisticRegression()
model.fit(X_train, y_train)

# Realizar predicciones en el conjunto de prueba
y_pred = model.predict(X_test)

sintomas = ["Fiebre","Dolordecabeza","Tos","Fatiga","Dificultadpararespirar",
            "Perdidadelgustoolfato", "Dolormuscular","Contactocercano",
            "NauseasVomitos","Diarrea"]

respuestasSintomas = [1,1,0,1,0,0,1,0,0,1]

# Crear un DataFrame con los datos de entrada
nuevoPaciente = pd.DataFrame([respuestasSintomas], columns=sintomas)

#Escalado del nuevo paciente
nuevoPaciente = scaler.transform(nuevoPaciente)

# Realizar una predicción para el nuevo paciente
resultado = model.predict(nuevoPaciente)
print(int(resultado[0]))

# Calcular la precisión del modelo
accuracy = accuracy_score(y_test, y_pred)

print(f'Precisión del modelo: {accuracy}')