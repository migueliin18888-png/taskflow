# TaskFlow — Sistema de Gestión de Tareas Colaborativas

Aplicación web tipo SPA para gestionar tareas/proyectos en tiempo real, con un
**backend en Node.js + TypeScript + Express** y un **frontend en TypeScript
(Vite)** con un tablero Kanban interactivo (drag & drop).

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express, TypeScript |
| Autenticación | JWT + bcrypt |
| Persistencia | MongoDB + Mongoose (ODM) |
| Frontend | TypeScript (ES6+), Vite, manipulación del DOM |
| Estilos | CSS3 puro, diseño responsive |
| Comunicación | Fetch API con `async/await` |

## 📁 Estructura del proyecto

```
taskflow-project/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexión a MongoDB
│   │   ├── controllers/     # Lógica de las rutas (auth, tasks)
│   │   ├── middleware/       # Middleware de autenticación JWT
│   │   ├── models/          # Modelos de Mongoose (User, Task)
│   │   ├── routes/           # Definición de endpoints de la API
│   │   ├── types/            # Tipos e interfaces compartidas
│   │   └── server.ts         # Punto de entrada de Node.js
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── index.html
    ├── src/
    │   ├── ts/                # Lógica en TypeScript para el cliente
    │   │   ├── api.ts         # Cliente fetch centralizado
    │   │   ├── auth.ts        # Login / registro
    │   │   ├── kanban.ts      # Renderizado y drag & drop del tablero
    │   │   ├── tasks.ts       # Llamadas CRUD a la API
    │   │   ├── ui.ts          # Validaciones y notificaciones
    │   │   ├── types.ts       # Tipos compartidos
    │   │   └── main.ts        # Punto de entrada
    │   └── css/
    │       └── styles.css     # Estilos responsive
    └── package.json
```

> Nota: `index.html` se ubica en la raíz de `frontend/` (convención estándar
> de Vite) en lugar de `frontend/public/`, para que Vite pueda resolver los
> módulos de `src/` correctamente. La carpeta `public/` queda disponible para
> assets estáticos (favicon, imágenes, etc.).

## 🚀 Puesta en marcha

### 1. Requisitos previos
- Node.js 18+
- Una instancia de MongoDB corriendo localmente (`mongodb://127.0.0.1:27017`)
  o una cadena de conexión de [MongoDB Atlas](https://www.mongodb.com/atlas).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # y edita las variables si es necesario
npm run dev                # levanta el servidor en http://localhost:4000
```

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev                # levanta la app en http://localhost:5173
```

Abre `http://localhost:5173` en el navegador. Regístrate, inicia sesión y
empieza a crear tareas en el tablero Kanban.

## 🔐 Endpoints de la API

| Método | Ruta | Descripción | Protegida |
|--------|------|-------------|-----------|
| POST | `/api/auth/register` | Registra un usuario nuevo | No |
| POST | `/api/auth/login` | Inicia sesión y retorna un JWT | No |
| GET | `/api/auth/me` | Perfil del usuario autenticado | Sí |
| GET | `/api/tasks?status=&priority=` | Lista tareas (con filtros opcionales) | Sí |
| GET | `/api/tasks/:id` | Obtiene una tarea por id | Sí |
| POST | `/api/tasks` | Crea una tarea | Sí |
| PUT | `/api/tasks/:id` | Actualiza una tarea (incl. cambio de estado por drag & drop) | Sí |
| DELETE | `/api/tasks/:id` | Elimina una tarea | Sí |

## ✅ Funcionalidades implementadas

- **Autenticación y autorización**: registro, login, contraseñas encriptadas
  con `bcrypt`, sesiones vía JWT y rutas del backend protegidas con
  middleware (`protect`).
- **CRUD completo de tareas**: título, descripción, fecha de vencimiento,
  estado (Pendiente / En Progreso / Completada) y prioridad (Baja / Media /
  Alta), con filtrado por estado y prioridad.
- **Tablero Kanban interactivo**: arrastrar y soltar tarjetas entre columnas
  actualiza el estado de la tarea en tiempo real mediante la API.
- **Validación de formularios**: en el cliente (HTML5 + TypeScript) y en el
  servidor (Mongoose + validaciones explícitas en los controladores).
- **Diseño responsive**: el tablero pasa de 3 columnas a 1 columna en
  pantallas pequeñas.

## 🧪 Próximos pasos sugeridos

- Agregar pruebas automatizadas (Jest / Supertest) para los endpoints.
- Añadir paginación e infinite scroll si el número de tareas crece mucho.
- Soporte para múltiples tableros/proyectos por usuario y colaboración en
  tiempo real (WebSockets) si se quiere ampliar el alcance.
