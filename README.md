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
│   │   └── events.service.js
│   ├── repositories/            # Desacoplan el Service del DAO concreto.
│   │   └── events.repository.js
│   ├── dao/                     # Acceso a datos (habla directo con Mongoose).
│   │   └── events.dao.js
│   ├── models/                  
│   │   ├── event.model.js
│   │   ├── user.model.js
│   │   └── ticket.model.js
│   ├── middlewares/            
│   │   └── errorHandler.js
│   └── utils/                   
│       ├── hash.js                # bcrypt (hash/compare de contraseñas)
│       └── paths.js               # helper de __dirname para ESM
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
