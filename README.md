# Task Manager App (MVP)

Aplicación de gestión de tareas full-stack. Proyecto de aprendizaje construido tras un bootcamp fullstack, con el objetivo de practicar el ciclo completo: frontend, backend, base de datos, autenticación y despliegue.

## Stack

- **Frontend:** Angular 19 (standalone components)
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** JWT

## Funcionalidades

- Registro e inicio de sesión de usuarios
- CRUD de tareas (crear, listar, editar, borrar)
- Cambio de estado de tareas (pendiente / en progreso / completada)
- Filtrado por estado
- Rutas protegidas (frontend y backend)

## Estructura del proyecto

```
.
├── backend/     API REST (Node + Express + MySQL)
├── frontend/    Aplicación Angular
└── database/    Esquema SQL
```

## Cómo correrlo en local

### 1. Base de datos

Crea la base de datos ejecutando el script `database/schema.sql` en MySQL Workbench (o el cliente que uses).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # rellena tus credenciales de MySQL y un JWT_SECRET
npm run dev
```

El servidor arranca en el puerto definido en `.env` (por defecto `3000`).

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

La app queda disponible en `http://localhost:4200`. Las peticiones a `/api/*` se redirigen automáticamente al backend mediante `proxy.conf.json`.

## Estado del proyecto

🚧 En desarrollo — MVP en construcción.
