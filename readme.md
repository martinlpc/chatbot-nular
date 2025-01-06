# Sushi Chatbot

Un chatbot simple que utiliza **Socket.IO** para comunicación en tiempo real.

Ejemplos de frases que entiende el bot:

-   "Hola!"
-   "**Quiero** **pedir**/**ordenar** XXXXX"
-   "Cual es su **domicilio**/**direccion**/**ubicacion**?"
-   "**Horario** de atencion?"
-   "Quiero ver el **menu**"

El server guarda temporalmente las sesiones de los clientes conectados.
Cuando un cliente hace un pedido, el bot pregunta por el nombre del mismo y guarda la orden final en la DB.

Por el momento, al ser una versión de prueba, no se hace control de productos al momento de crear los pedidos.

Se dispone de un API REST para ver las órdenes creadas y manejar los productos en la base de datos.
Endpoints:

```
GET     /api/orders
GET     /api/orders/:clientname

GET     /api/products
GET     /api/products/:code
POST    /api/products
PUT     /api/products/:code
```

```mermaid
graph TB
    User((User))

    subgraph "Frontend Container"
        FrontendApp["Frontend Application<br>(React + Vite)"]

        subgraph "Frontend Components"
            ChatInterface["Chat Interface<br>(React Components)"]
            WebSocket["WebSocket Client<br>(Socket.io-client)"]
        end
    end

    subgraph "Backend Container"
        APIServer["API Server<br>(Express.js)"]
        SocketServer["WebSocket Server<br>(Socket.io)"]

        subgraph "API Components"
            Router["Router<br>(Express Router)"]
            ErrorHandler["Error Handler<br>(Express Middleware)"]
            ChatbotController["Chatbot Controller<br>(Node.js)"]
            OrderController["Order Controller<br>(Node.js)"]
            ProductController["Product Controller<br>(Node.js)"]
        end

        subgraph "Service Layer"
            OrderService["Order Service<br>(Node.js)"]
            ProductService["Product Service<br>(Node.js)"]
        end

        subgraph "Data Models"
            ProductModel["Product Model<br>(Mongoose)"]
            OrderModel["Order Model<br>(Mongoose)"]
        end
    end

    subgraph "Database Container"
        MongoDB[("MongoDB Atlas<br>(MongoDB)")]
    end

    %% Frontend connections
    User -->|"Interacts with"| FrontendApp
    FrontendApp -->|"Contains"| ChatInterface
    FrontendApp -->|"Uses"| WebSocket

    %% WebSocket connections
    WebSocket -->|"Connects to"| SocketServer
    SocketServer -->|"Handles messages"| ChatbotController

    %% API connections
    FrontendApp -->|"HTTP Requests"| APIServer
    APIServer -->|"Routes requests"| Router
    Router -->|"Routes to"| OrderController
    Router -->|"Routes to"| ProductController
    APIServer -->|"Uses"| ErrorHandler

    %% Controller to Service connections
    OrderController -->|"Uses"| OrderService
    ProductController -->|"Uses"| ProductService

    %% Service to Model connections
    OrderService -->|"Uses"| OrderModel
    ProductService -->|"Uses"| ProductModel

    %% Database connections
    OrderModel -->|"Persists data"| MongoDB
    ProductModel -->|"Persists data"| MongoDB
```

## Requisitos

Antes de empezar, asegurarse de tener instalado:

-   **Node.js** (v14 o superior)

-   **Yarn** (Para lanzar el cliente, ya que es mas rápido y eficiente con Vite)

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
    MONGO_URI= <TuMongoURI>
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
    El frontend estará disponible en http://localhost:3000

## Uso

1. Ingresar al frontend en http://localhost:3000
2. Introducir un mensaje para enviar al chatbot
3. Los mensajes se procesan en tiempo real

## Tecnologías utilizadas

-   Frontend: Vite, React.js, Socket.IO-client
-   Backend: Node.js, Express, Socket.IO, Morgan - Testing: mocha, chai
-   Database: MongoDB Atlas (cloud storage)
