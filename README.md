# Plataforma de Eventos e Inscripciones — Backend

Proyecto de **Programación Backend II: Diseño y Arquitectura Backend**.

## Temática elegida

Plataforma de gestión de **eventos, tickets/inscripciones y usuarios**. 

## Tecnologías

- Node.js
- Express
- Mongoose (MongoDB)
- bcrypt 
- dotenv (variables de entorno)
- Módulos ES (ESM: `import` / `export`)


## Estructura de carpetas

```
proyecto-backend-ii/
├── src/
│   ├── app.js                 # Configura Express (middlewares, rutas). No levanta el server.
│   ├── server.js              # Conecta a MongoDB y levanta el servidor HTTP.
│   ├── config/
│   │   ├── env.js               # Lectura centralizada de variables de entorno.
│   │   └── database.js          # Conexión a MongoDB con Mongoose.
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
│   │   └── events.repository.js
|   |   |__ users.repository.js
│   ├── dao/                    
│   │   └── events.dao.js
|   |   |__ events.dao.js
│   ├── models/                  
│   │   ├── event.model.js
│   │   ├── user.model.js
│   │   └── ticket.model.js
│   ├── middlewares/            
│   │   └── errorHandler.js
│   └── utils/                   
│       ├── hash.js                
│       └── paths.js
|       └── errors.js
|       |__ validators.js       
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

| Método | Endpoint                  | Descripción                                             |
|--------|----------------------------|-------------------------------------------------------------|
| GET    | `/api/health`                 | Verifica que el servidor está activo |
| GET    | `/api/events`                 | Lista los eventos |
| POST   | `/api/sessions/register`      | Registro de usuarios|
| GET    | `/api/users`                  | Lista los usuarios |
| GET    | `/api/tickets`                | Lista los tickets/inscripciones|

## Registro de usuarios — `POST /api/sessions/register`

### Campos que espera el body (JSON)

| Campo        | Tipo  

| `first_name` | string 
| `last_name`  | string 
| `email`      | string 
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
