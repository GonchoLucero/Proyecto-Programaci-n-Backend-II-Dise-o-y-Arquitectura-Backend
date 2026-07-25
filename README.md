# Plataforma de Eventos e Inscripciones — Backend

Proyecto de **Programación Backend II: Diseño y Arquitectura Backend**.

## Temática elegida

Plataforma de gestión de **eventos, tickets/inscripciones y usuarios**. 

## Tecnologías

- Node.js
- Express
- Mongoose (MongoDB)
- bcrypt (hashing de contraseñas)
- jsonwebtoken (JWT)
- Passport.js + passport-local + passport-jwt (estrategias de autenticación)
- cookie-parser (lectura de cookies HttpOnly)
- dotenv (variables de entorno)
- Prettier (formato de código estandarizado)
- Módulos ES (ESM: `import` / `export`)

## Instalación

```bash
git clone <https://github.com/GonchoLucero/Proyecto-Programaci-n-Backend-II-Dise-o-y-Arquitectura-Backend.git>
cd proyecto-backend-ii
npm install
```


## Estructura de carpetas

```
proyecto-backend-ii/
├── src/
│   ├── app.js                     
│   ├── server.js                  # Conecta a MongoDB y levanta el servidor HTTP.
│   ├── config/
│   │   ├── env.js                   # Lectura centralizada de variables de entorno.
│   │   ├── database.js              # Conexión a MongoDB con Mongoose.
│   │   └── passport.config.js       
│   ├── routes/
│   │   ├── event.routes.js          
│   │   ├── sessions.routes.js
│   │   ├── user.routes.js         
│   │   └── ticket.routes.js
│   ├── controllers/
│   │   ├── event.controller.js
│   │   ├── sessions.controller.js
│   │   ├── user.controller.js
│   │   └── ticket.controller.js
│   ├── services/                    
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   ├── repositories/               
│   │   ├── events.repository.js
│   │   └── users.repository.js
│   ├── dao/                         
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── models/
│   │   ├── event.model.js           
│   │   ├── user.model.js           
│   │   └── ticket.model.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── auth.middleware.js      
│   │   └── authorize.middleware.js  
│   └── utils/
│       ├── hash.js                  
│       ├── jwt.js                   
│       ├── validators.js           
│       ├── errors.js                
│       └── paths.js                 
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

| Método | Endpoint                  | Descripción                                             |
|--------|----------------------------|-------------------------------------------------------------|
| GET    | `/api/health`                | Verifica que el servidor está activo                          |
| GET    | `/api/events`                | Lista los eventos                                              |
| POST   | `/api/sessions/register`    | Registro de usuario (estrategia `register`)                    |
| POST   | `/api/sessions/login`       | Login de usuario (estrategia `login`, setea la cookie `currentUser`) |
| GET    | `/api/sessions/current`     | Devuelve el usuario autenticado (estrategia `current`)          |
| POST   | `/api/sessions/logout`      | Cierra la sesión (elimina la cookie, no pasa por Passport)      |
| GET    | `/api/users`                  | Lista los usuarios (sin exponer `password`)                    |
| GET    | `/api/tickets`                | Lista los tickets/inscripciones                                |

---
## Registro de usuarios — `POST /api/sessions/register`

### Campos que espera el body (JSON)

| Campo        | Tipo  

| `first_name` | string |
| `last_name`  | string |
| `email`      | string |
| `password`   | string |


### Ejemplo de request

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "Ana@Mail.com ",
    "password": "Secreta123"
  }'
```

### Respuestas posibles

**201 - Registro exitoso** (email ya normalizado, sin `password`):

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**400 - Campos faltantes:**
```json
{ "status": "error", "message": "Faltan campos obligatorios" }
```

**400 - Email con formato inválido:**
```json
{ "status": "error", "message": "Formato de email inválido" }
```

**400 - Contraseña muy corta:**
```json
{ "status": "error", "message": "La contraseña debe tener al menos 6 caracteres" }
```

**409 - Email ya registrado:**
```json
{ "status": "error", "message": "El email ya está registrado" }
```

### Ejemplo

```bash
curl -i -c cookies.txt -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"Secreta123"}'
```

**200 - Login correcto** (además setea la cookie `currentUser`):
```json
{ "status": "success", "message": "Login correcto" }
```

**401 - Credenciales inválidas** (mismo mensaje sin importar qué falló):
```json
{ "status": "error", "message": "Credenciales inválidas" }
```

---

## `GET /api/sessions/current`

### Ejemplo

```bash
curl -b cookies.txt http://localhost:8080/api/sessions/current
```

**200 - Autenticado:**
```json
{ "status": "success", "payload": { "id": "665f2a...", "email": "ana@mail.com", "role": "user" } }
```

**401 - Sin cookie o token inválido/expirado:**
```json
{ "status": "error", "message": "No autenticado" }
```

---

## `POST /api/sessions/logout`

### Ejemplo

```bash
curl -b cookies.txt -c cookies.txt -X POST http://localhost:8080/api/sessions/logout
```

**200:**
```json
{ "status": "success", "message": "Sesión cerrada" }
```

Después del logout, un `GET /api/sessions/current` con la misma cookie vuelve a dar `401`.

---

## Roles y autorización

### Roles disponibles

El modelo `User` tiene un campo `role` con default `'user'` y tres valores posibles: `user`, `organizer`, `admin`.

### Matriz de permisos

| Acción                              | `user` | `organizer` | `admin` |
|--------------------------------------|:------:|:------------:|:-------:|
| Consultar eventos publicados          | ✅     | ✅           | ✅      |
| Crear eventos                         | ❌     | ✅           | ✅      |
| Modificar/cancelar eventos propios    | ❌     | ✅           | ✅      |
| Modificar cualquier evento            | ❌     | ❌           | ✅      |
| Ver todos los usuarios                | ❌     | ❌           | ✅      |

### 401 vs 403 — la diferencia

- **401 (No autenticado)**: no sabemos quién sos. Falta la cookie, o el JWT es inválido/expiró.
- **403 (No autorizado)**: sabemos quién sos (la sesión es válida), pero tu rol no te permite hacer esa acción puntual.