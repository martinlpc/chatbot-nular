# Sushi Chatbot

Un chatbot simple que utiliza **Socket.IO** para comunicación en tiempo real y una API REST para cargar mensajes previos.

## Requisitos

Antes de empezar, asegurarse de tener instalado:

-   **Node.js** (v14 o superior)

-   **Yarn** (opcional, si se prefiere usarlo en lugar de npm)

---

## Instalación

1. Clonar este repositorio:

    ```bash
    git clone https://github.com/martinlpc/chatbot-nular
    cd chatbot-nular
    ```

2. Instalar las dependencias para el backend y el frontend

### Backend

1. Ir al directorio del backend:

    ```bash
    cd backend
    ```

2. Instalar las dependencias:

    ```bash
    npm i
    ```

3. Configurar las variables de entorno:

    Crear un archivo `.env.example` en el directorio `backend` con el siguiente contenido:

    ```
    PORT=4000
    MONGO_URL= <TuMongoURL>
    ```

    O cargar el archivo recibido por el desarrollador

4. Iniciar el servidor:

    ```bash
    npm start
    ```

    El servidor estará disponible en http://localhost:4000

### Frontend

1. Ir al directorio del frontend:
    ```bash
    cd frontend
    ```
2. Instalar dependencias:
    ```bash
    yarn install
    ```
3. En caso de ser necesario, configurar el archivo `vite.config.js` para que el front use el puerto 3000

4. Iniciar el servidor de desarrollo:
    ```bash
    yarn dev
    ```
    El frontend estará disponible en http://localhost.3000

## Uso

1. Ingresar al frontend en http://localhost.3000
2. Completar nombre e introducir un mensaje para enviar al chatbot
3. Los mensajes se procesan en tiempo real

## Tecnologías utilizadas

-   Frontend: Vite, React.js, Socket.IO-client
-   Backend: Node.js, Express, Socket.IO
-   Database: MongoDB Atlas (cloud storage)
