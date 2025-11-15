# 💬 Chat UMG - Examen Final de Desarrollo Web

## Sistema Completo de Chat con Autenticación y SQL Server

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![SQL Server](https://img.shields.io/badge/Microsoft%20SQL%20Server-CC2927?style=for-the-badge&logo=microsoft%20sql%20server&logoColor=white)](https://www.microsoft.com/sql-server)

---

## 📋 Descripción del Proyecto

Sistema de chat web completo que implementa las **tres series** del examen final:

1. **SERIE I**: Autenticación de usuarios con API externa
2. **SERIE II**: Envío de mensajes protegido con Token Bearer
3. **SERIE III**: Visualización de mensajes desde SQL Server Azure

---

## 🎨 Características Premium

### Diseño Moderno
- ✨ Gradientes de colores profesionales
- 🎭 Animaciones suaves y transiciones CSS3
- 📱 Diseño 100% responsive (mobile-first)
- 🎨 Iconos de Bootstrap Icons
- 🔤 Fuentes Google Fonts (Poppins)

### Experiencia de Usuario
- 🔐 Sistema de autenticación seguro
- 💬 Contador de caracteres en tiempo real
- 👁️ Mostrar/ocultar contraseña
- ⚡ Indicadores de estado de conexión
- 🔄 Actualización de mensajes con un click
- 📊 Tiempo relativo de mensajes (hace X minutos)

### Seguridad
- 🛡️ Tokens Bearer para autenticación
- 🔒 Validación de sesión
- 🚫 Prevención de XSS (Cross-Site Scripting)
- ✅ Validación de formularios

---

## 📁 Estructura del Proyecto

```
EFDW-main/
│
├── 📄 index.html              # SERIE I: Página de Login
├── 📄 chat.html               # SERIE II: Envío de Mensajes
├── 📄 view.html               # SERIE III: Visualización de Mensajes
├── 📄 README.md               # Documentación del proyecto
├── 📄 .gitignore              # Archivos ignorados por Git
│
├── 📁 css/
│   └── styles.css            # Estilos personalizados premium
│
├── 📁 js/
│   ├── auth.js               # Lógica de autenticación
│   ├── mensajes.js           # Lógica de envío de mensajes
│   └── view.js               # Lógica de visualización
│
└── 📁 backend/
    ├── server.js             # Servidor Express
    ├── db.js                 # Conexión a SQL Server
    └── package.json          # Dependencias de Node.js
```

---

## 🎯 SERIE I: Autenticación (Login)

### 📝 Descripción
Interfaz de inicio de sesión que se conecta a una API externa para autenticar usuarios.

### 🔧 Implementación

**Archivo**: `index.html` + `js/auth.js`

#### API de Autenticación
- **Endpoint**: `https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate`
- **Método**: `POST`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "Username": "ctezop",
  "Password": "123456a"
}
```

#### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ✅ Funcionamiento

1. Usuario ingresa credenciales (usuario sin @miumg.edu.gt)
2. Se realiza petición POST a la API
3. Si es exitosa, se recibe un Token Bearer
4. El token se guarda en `sessionStorage`
5. Redirección automática a `chat.html`

### 🎨 Características Visuales

- Fondo con gradiente animado
- Círculos flotantes decorativos
- Validación en tiempo real
- Animación de shake para errores
- Botón toggle para mostrar/ocultar contraseña
- Spinner de carga durante autenticación

---

## 💬 SERIE II: Envío de Mensajes

### 📝 Descripción
Formulario protegido que permite enviar mensajes usando el Token Bearer obtenido en la Serie I.

### 🔧 Implementación

**Archivo**: `chat.html` + `js/mensajes.js`

#### API de Mensajes
- **Endpoint**: `https://backcvbgtmdesa.azurewebsites.net/api/Mensajes`
- **Método**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {TOKEN}` ← **CRÍTICO**

#### Request Body
```json
{
  "Cod_Sala": 0,
  "Login_Emisor": "ctezop",
  "Contenido": "Mi mensaje de prueba"
}
```

### ✅ Funcionamiento

1. Verifica autenticación (token en sessionStorage)
2. Muestra formulario para escribir mensaje
3. Al enviar, realiza POST con Token Bearer en el header
4. Si no hay token o es inválido, redirige al login

### 🎨 Características Visuales

- Contador de caracteres dinámico (límite 1000)
- Cambio de color del contador según límite
- Navbar con menú desplegable
- Diseño de tarjeta con header degradado
- Indicador de carga en botón de envío
- Confirmación de envío exitoso

---

## 👁️ SERIE III: Visualización de Mensajes

### 📝 Descripción
Vista cronológica de mensajes consultados directamente desde SQL Server Azure.

### 🔧 Implementación

**Archivos**: `view.html` + `js/view.js` + `backend/server.js` + `backend/db.js`

#### Arquitectura

```
Frontend (view.html)
    ↓
HTTP GET Request
    ↓
Backend Local (Node.js + Express)
    ↓
SQL Server Azure
    ↓
Tabla: [dbo].[Chat_Mensaje]
```

#### Configuración SQL Server

```javascript
Server: svr-sql-ctezo.southcentralus.cloudapp.azure.com
Usuario: usr_DesaWebDevUMG
Password: !ngGuast@360
Database: db_DesaWebDevUMG
Tabla: [dbo].[Chat_Mensaje]
```

#### Endpoint Backend Local

- **URL**: `http://localhost:3000/api/mensajes`
- **Método**: `GET`
- **Query Params**: `?sort=desc` (desc | asc)

### ✅ Funcionamiento

1. Frontend realiza petición GET a backend local
2. Backend se conecta a SQL Server con mssql
3. Ejecuta query: `SELECT * FROM [dbo].[Chat_Mensaje] ORDER BY Fec_Mensaje DESC`
4. Backend retorna JSON con los mensajes
5. Frontend renderiza los mensajes de forma cronológica

### 🎨 Características Visuales

- Avatar circular con gradiente para cada usuario
- Tiempo relativo (Hace X minutos/horas)
- Colores alternados para mejor lectura
- Indicador de estado de conexión
- Filtro de ordenamiento (ASC/DESC)
- Contador de mensajes total
- Animaciones de aparición escalonadas

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- ✅ Node.js (v14 o superior)
- ✅ npm (incluido con Node.js)
- ✅ Navegador web moderno (Chrome, Firefox, Edge)

### Pasos de Instalación

#### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

Esto instalará:
- `express` - Framework web
- `cors` - Manejo de CORS
- `mssql` - Driver de SQL Server
- `dotenv` - Variables de entorno

#### 2. Iniciar el servidor backend

```bash
npm start
```

Verás en consola:
```
============================================================
Servidor backend iniciado en puerto 3000
URL: http://localhost:3000
============================================================

Endpoints disponibles:
  - GET  http://localhost:3000/
  - GET  http://localhost:3000/health
  - GET  http://localhost:3000/api/mensajes
============================================================

Conexión a SQL Server establecida exitosamente
```

#### 3. Abrir la aplicación frontend

**Opción A: Directamente en el navegador**
```
Abre index.html en tu navegador
```

**Opción B: Con servidor local (recomendado)**

```bash
# Con Python
python -m http.server 8080

# Con Node.js (http-server)
npx http-server -p 8080

# Con Live Server de VS Code
Haz clic derecho en index.html → "Open with Live Server"
```

Luego visita: `http://localhost:8080`

---

## 📖 Flujo de Uso

### 1️⃣ Login (index.html)

1. Ingresa tu usuario (sin @miumg.edu.gt)
   - Ejemplo: `ctezop`
2. Ingresa la contraseña: `123456a`
3. Click en "Iniciar Sesión"
4. Espera la autenticación
5. Serás redirigido a `chat.html`

### 2️⃣ Enviar Mensaje (chat.html)

1. Verifica que tu usuario aparece en el navbar
2. Escribe tu mensaje (máximo 1000 caracteres)
3. Observa el contador de caracteres
4. Click en "Enviar Mensaje"
5. Espera la confirmación
6. Opcionalmente, ve a ver los mensajes

### 3️⃣ Ver Mensajes (view.html)

1. Asegúrate de que el backend esté corriendo
2. Los mensajes se cargan automáticamente
3. Usa el filtro para ordenar (ASC/DESC)
4. Click en "Actualizar" para recargar
5. Observa el indicador de conexión

---

## 🔧 Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | - | Estructura de las páginas |
| CSS3 | - | Estilos y animaciones |
| JavaScript | ES6+ | Lógica de negocio |
| Bootstrap | 5.3.2 | Framework CSS responsivo |
| Bootstrap Icons | 1.11.1 | Iconografía |
| Google Fonts | - | Tipografía Poppins |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 14+ | Entorno de ejecución |
| Express | 4.18.2 | Framework web |
| mssql | 10.0.1 | Driver de SQL Server |
| CORS | 2.8.5 | Manejo de CORS |
| dotenv | 16.3.1 | Variables de entorno |

### Base de Datos

| Tecnología | Ubicación | Uso |
|------------|-----------|-----|
| Microsoft SQL Server | Azure | Almacenamiento de mensajes |

---

## 🌐 APIs Utilizadas

### API de Autenticación (Externa)
- **Proveedor**: backcvbgtmdesa.azurewebsites.net
- **Endpoint**: `/api/login/authenticate`
- **Función**: Autenticar usuarios y generar tokens

### API de Mensajes (Externa)
- **Proveedor**: backcvbgtmdesa.azurewebsites.net
- **Endpoint**: `/api/Mensajes`
- **Función**: Recibir y almacenar mensajes

### API Backend Local
- **Servidor**: http://localhost:3000
- **Endpoint**: `/api/mensajes`
- **Función**: Consultar mensajes desde SQL Server

---

## 🛡️ Seguridad

### Implementaciones de Seguridad

- ✅ **Autenticación con Token Bearer**
- ✅ **Almacenamiento seguro en sessionStorage**
- ✅ **Validación de formularios**
- ✅ **Sanitización de HTML (prevención XSS)**
- ✅ **Verificación de sesión en cada página**
- ✅ **CORS configurado correctamente**
- ✅ **Conexión encriptada a SQL Server**

---

## 🐛 Solución de Problemas

### Problema: No se puede iniciar el backend

**Solución**:
```bash
# 1. Asegúrate de tener Node.js instalado
node --version

# 2. Navega a la carpeta backend
cd backend

# 3. Reinstala las dependencias
rm -rf node_modules
npm install

# 4. Inicia el servidor
npm start
```

### Problema: Error de conexión a SQL Server

**Solución**:
- Verifica que el servidor backend esté ejecutándose
- Revisa la configuración en `backend/db.js`
- Verifica la conectividad a internet
- Revisa el firewall

### Problema: Token expirado

**Solución**:
- Vuelve a iniciar sesión en `index.html`
- El token se renovará automáticamente

### Problema: CORS error

**Solución**:
- Asegúrate de usar un servidor local (no file://)
- Verifica que CORS esté habilitado en el backend

---

## 📊 Estructura de la Base de Datos

### Tabla: [dbo].[Chat_Mensaje]

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id_Mensaje | int | ID único del mensaje (PK) |
| Cod_Sala | int | Código de la sala de chat |
| Login_Emisor | varchar(50) | Usuario que envió el mensaje |
| Contenido | text | Contenido del mensaje |
| Fec_Mensaje | datetime | Fecha y hora del mensaje |

---

## 📝 Notas Importantes

- 🔴 El backend **DEBE** estar ejecutándose para la Serie III
- 🟢 Las Series I y II funcionan sin el backend
- 🔵 El token expira al cerrar el navegador (sessionStorage)
- 🟡 Los mensajes se almacenan en SQL Server Azure
- 🟣 La aplicación es totalmente responsive

---

## 👨‍💻 Autor

**Proyecto desarrollado para el Examen Final de Desarrollo Web**

- Universidad Mariano Gálvez de Guatemala
- Curso: Desarrollo Web
- Año: 2025

---

## 📄 Licencia

Este proyecto es para fines educativos.

---

## 🎓 Créditos

- Bootstrap 5.3.2
- Bootstrap Icons 1.11.1
- Google Fonts - Poppins
- Express.js
- Node.js
- Microsoft SQL Server

---

## 📞 Soporte

Si tienes problemas con el proyecto:

1. Revisa la sección de "Solución de Problemas"
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que el backend esté ejecutándose
4. Revisa la consola del navegador para errores

---

**¡Gracias por usar Chat UMG! 💬✨**
