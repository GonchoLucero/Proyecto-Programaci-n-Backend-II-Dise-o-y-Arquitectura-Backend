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
- Nodemailer (email de confirmación de inscripciones)
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
│   ├── server.js                        # Conecta a MongoDB y levanta el servidor HTTP.
│   ├── config/
│   │   ├── env.js                       # Lectura centralizada de variables de entorno.
│   │   ├── database.js                  # Conexión a MongoDB con Mongoose.
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
│   │   ├── sessions.service.js
│   │   └── tickets.service.js         
│   ├── repositories/
│   │   ├── events.repository.js
│   │   ├── users.repository.js
│   │   └── tickets.repository.js
│   ├── dao/                         
│   │   ├── events.dao.js
│   │   ├── users.dao.js
│   │   └── tickets.dao.js           
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
│       ├── mailer.js                 
│       ├── validators.js
│       ├── errors.js
│       └── paths.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

| Método | Endpoint                    | Descripción                                                          |
|--------|-----------------------------|----------------------------------------------------------------------|
| GET    | `/api/health`               | Verifica que el servidor está activo                                 |
| POST   | `/api/events`               | Crea un evento                                                       |
| GET    | `/api/events`               | Lista los eventos                                                    |
| GET    | `/api/events/:id`           | Detalle de un evento                                                 |
| PUT    | `/api/events/:id`           | Modifica un evento                                                   |
| PATCH  | `/api/events/:id/status`    | Cambia el estado del evento                                          |
| POST   | `/api/events/:eid/tickets`  | Inscribirse a un evento                                              |
| GET    | `/api/events/:eid/tickets`  | Lista las inscripciones de ese evento                                |
| GET    | `/api/tickets/my-tickets`   | Lista mis inscripciones                                              |
| PATCH  | `/api/tickets/:tid/cancel`  | Cancela una inscripción                                              |
| POST   | `/api/sessions/register`    | Registro de usuario (estrategia `register`)                          |
| POST   | `/api/sessions/login`       | Login de usuario (estrategia `login`, setea la cookie `currentUser`) |
| GET    | `/api/sessions/current`     | Devuelve el usuario autenticado (estrategia `current`)               |
| POST   | `/api/sessions/logout`      | Cierra la sesión (elimina la cookie, no pasa por Passport)           |
| GET    | `/api/users`                | Lista los usuarios (sin exponer `password`)                          |
| GET    | `/api/tickets`              | Lista los tickets/inscripciones                                      |

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

| Acción                                | `user` | `organizer` | `admin` |
|-----------------------------------------|:------:|:------------:|:-------:|
| Consultar eventos publicados             | ✅     | ✅           | ✅      |
| Crear eventos                            | ❌     | ✅           | ✅      |
| Modificar/cancelar eventos propios       | ❌     | ✅           | ✅      |
| Modificar cualquier evento               | ❌     | ❌           | ✅      |
| Inscribirse a un evento                  | ✅     | ✅           | ✅      |
| Ver inscripciones de un evento propio    |  —     | ✅           | ✅      |
| Ver inscripciones de cualquier evento    | ❌     | ❌           | ✅      |
| Cancelar la propia inscripción           | ✅     | ✅           | ✅      |
| Cancelar la inscripción de otro usuario  | ❌     | ❌           | ✅      |
| Ver todos los usuarios                   | ❌     | ❌           | ✅      |

### 401 vs 403 — la diferencia

- **401 (No autenticado)**: no sabemos quién sos. Falta la cookie, o el JWT es inválido/expiró.
- **403 (No autorizado)**: sabemos quién sos (la sesión es válida), pero tu rol no te permite hacer esa acción puntual.

### Reglas de negocio events

- **Fecha pasada**: no se puede crear un evento con `date` anterior a ahora.
- **Capacidad/precio**: `capacity` debe ser `> 0`; `price` no puede ser negativo (se valida tanto al crear como al modificar).
- **Propiedad del recurso**: un `organizer` solo puede modificar (`PUT`) o cambiar el estado (`PATCH .../status`) de sus propios eventos. Un `admin` puede modificar cualquiera.
- **Eventos cancelados**: una vez que un evento pasa a `status: cancelled`, no se puede modificar (ni `PUT` ni `PATCH .../status`).
- **Publicar eventos finalizados o cancelados**: `PATCH .../status` con `status: published` se rechaza si el evento ya está `finished` o `cancelled`.
- **El `organizer` nunca sale del body**: tanto al crear como al modificar, se ignora cualquier `organizer` que venga en el body — siempre se usa `req.user.id`.
- **Borrado físico**: no existe un endpoint de `DELETE`. "Cancelar" un evento es cambiarle el `status` a `cancelled` vía `PATCH`.

## Entidad `Ticket`

### Flujo de inscripción — `POST /api/events/:eid/tickets`

Validaciones en `tickets.service.js`:

1. El evento existe (si no, `404`).
2. El evento está `published` (si está en `draft`, `cancelled` o `finished`, `400`).
3. `quantity` es un entero `> 0` (`400` si no).
4. El usuario **no** tiene ya un ticket activo para ese evento — una inscripción por usuario por evento (`409` si ya tiene).
5. Cupos disponibles: `capacity del evento − suma de quantity de tickets ACTIVOS` (los `cancelled` **no** ocupan cupo, por diseño de la query). Si `quantity` pedida supera lo disponible → `400` con el número de cupos que quedan.
6. Se crea el ticket (`status: confirmed`) y se dispara el email de confirmación.

### Cancelación — `PATCH /api/tickets/:tid/cancel`

- Valida que el ticket exista (`404` si no).
- Valida que sea el dueño del ticket, o `admin` (`403` si no).
- Valida que no esté ya cancelado (`400` si ya lo está).
- Cambia `status` a `cancelled` y completa `cancelledAt`. **Nunca borra el documento.**

### Mis inscripciones — `GET /api/tickets/my-tickets`

Devuelve los tickets del usuario autenticado, con el evento poblado (`title`, `date`, `location` — nunca el objeto completo). No expone tickets ni datos de otros usuarios.

### Inscripciones de un evento — `GET /api/events/:eid/tickets`

Acceso a nivel de ruta: `organizer` o `admin` (middleware `authorize`). Pero un `organizer` que no sea el dueño de **ese** evento puntual igual recibe `403` — esa validación de propiedad vive en `tickets.service.js`, igual que en `events.service.js`. Los tickets vienen con el usuario poblado, pero solo con `first_name`, `last_name`, `email` — nunca `password`.