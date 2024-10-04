# Tesis: Diagnóstico Preliminar con Regresión Logística

Este proyecto utiliza regresión logística para proporcionar un diagnóstico preliminar del padecimiento de un paciente, basado en preguntas realizadas al usuario. El sistema luego refiere al paciente a un médico especialista según el diagnóstico preliminar.

## Descripción

El objetivo principal de este proyecto es implementar un sistema de diagnóstico automatizado que, a través de una serie de preguntas, pueda identificar posibles padecimientos y recomendar la visita a un especialista adecuado. Además, tiene un CRUD para las citas médicas e incluye los roles de **Administrador**, **Médico** y **Paciente**. Las sesiones se manejan mediante el uso de JWT.

## Características

- **Regresión Logística**: Utilizada para el análisis predictivo y clasificación de las respuestas.
- **Interfaz de Preguntas**: Realiza una serie de preguntas al usuario para recolectar datos relevantes.
- **Diagnóstico Preliminar**: Proporciona un diagnóstico basado en las respuestas del usuario.
- **Recomendación de Especialista**: Sugiere al paciente qué tipo de especialista visitar.

## Requisitos

- Python 3.x
- Bibliotecas: scikit-learn y pandas.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Josemq24/Tesis.git
