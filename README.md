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
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── index.html
    ├── src/
    │   ├── ts/                # Lógica en TypeScript para el cliente
    │   └── css/               # Estilos responsive
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Cómo correr este proyecto en una PC nueva (desde cero)

Sigue estos pasos **en orden**. Están escritos para Linux (Fedora/Ubuntu),
con notas para macOS y Windows donde aplica.

### Paso 1 — Instalar Git (si no lo tienes)

```bash
# Fedora
sudo dnf install git -y

# Ubuntu/Debian
sudo apt install git -y
```

Windows: descarga e instala [Git for Windows](https://git-scm.com/download/win).
macOS: `brew install git` (con [Homebrew](https://brew.sh)).

### Paso 2 — Instalar Node.js (versión 18 o superior)

Recomendado usar `nvm` (Node Version Manager), funciona igual en Linux/macOS:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v   # confirma que sea v18+ o v20+
npm -v
```

Windows: descarga el instalador `.msi` desde [nodejs.org](https://nodejs.org)
(elige la versión LTS).

### Paso 3 — Instalar y arrancar MongoDB

**Opción A (recomendada si no quieres instalar nada localmente):** crea una
base de datos gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas) y
copia la cadena de conexión que te den (algo como
`mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/taskflow`). Sáltate el
resto de este paso y úsala en el `.env` más abajo.

**Opción B (MongoDB local en Fedora):**
```bash
sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo <<'EOF'
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

sudo dnf install mongodb-org -y
sudo systemctl enable --now mongod
systemctl status mongod   # debe decir "active (running)"
```

**MongoDB local en Ubuntu/Debian:** sigue la [guía oficial](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/).

**MongoDB local en macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**MongoDB local en Windows:** descarga el instalador desde
[mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
y sigue el asistente (incluye la opción de instalarlo como servicio).

### Paso 4 — Clonar el repositorio

```bash
git clone https://github.com/migueliin18888-png/taskflow.git
cd taskflow
```

### Paso 5 — Configurar y levantar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Abre el archivo `.env` con un editor de texto y revisa las variables:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=cambia_este_valor_por_un_secreto_seguro
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

- Si usas **MongoDB local**, deja `MONGODB_URI` tal cual.
- Si usas **MongoDB Atlas**, reemplaza `MONGODB_URI` con la cadena de conexión
  que te dio Atlas.
- Cambia `JWT_SECRET` por cualquier texto largo y aleatorio (es la clave que
  firma las sesiones).

Levanta el servidor:

```bash
npm run dev
```

Debe mostrar:
```
✅ Conectado a MongoDB correctamente.
🚀 Servidor TaskFlow corriendo en http://localhost:4000
```

**Deja esta terminal abierta** — el backend debe seguir corriendo mientras usas la app.

### Paso 6 — Configurar y levantar el frontend

Abre **una terminal nueva** (no cierres la del backend) y ejecuta:

```bash
cd taskflow/frontend
npm install
npm run dev
```

Debe mostrar algo como:
```
VITE v5.x.x  ready in ... ms
➜  Local:   http://localhost:5173/
```

### Paso 7 — Usar la aplicación

Abre tu navegador en:

```
http://localhost:5173
```

Regístrate desde la pestaña "Crear cuenta", inicia sesión y empieza a crear
tareas en el tablero Kanban (puedes arrastrarlas entre columnas).

---

## 🔎 Verificación rápida (troubleshooting)

| Comprobación | Comando | Resultado esperado |
|---|---|---|
| ¿Mongo está corriendo? | `systemctl status mongod` | `active (running)` |
| ¿El backend responde? | Abrir `http://localhost:4000/api/health` en el navegador | `{"status":"ok",...}` |
| ¿Hay datos guardados? | `mongosh --eval "use taskflow; db.users.find()"` | Lista de usuarios registrados |

Si al registrarte ves un error de tipo `NetworkError`, confirma que **ambas
terminales** (backend y frontend) sigan abiertas y corriendo sin haber
presionado `Ctrl+C`.

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

## ⚠️ Importante sobre seguridad

- **Nunca subas tu archivo `.env`** a GitHub (ya está excluido en
  `.gitignore`). Contiene secretos como `JWT_SECRET` y, si usas Atlas, tu
  cadena de conexión con usuario/clave.
- Si usas MongoDB Atlas, no compartas tu cadena de conexión completa en
  capturas de pantalla ni en el código.

## 🧪 Próximos pasos sugeridos

- Agregar pruebas automatizadas (Jest / Supertest) para los endpoints.
- Añadir paginación e infinite scroll si el número de tareas crece mucho.
- Soporte para múltiples tableros/proyectos por usuario y colaboración en
  tiempo real (WebSockets) si se quiere ampliar el alcance.
