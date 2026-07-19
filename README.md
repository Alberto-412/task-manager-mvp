# Task Manager App (MVP)

Aplicación de gestión de tareas full-stack. Proyecto de aprendizaje construido tras un bootcamp fullstack, con el objetivo de practicar el ciclo completo: frontend, backend, base de datos, autenticación y despliegue.

🔗 **Demo en vivo:** https://task-manager-mvp-three.vercel.app
💻 **Repositorio:** https://github.com/Alberto-412/task-manager-mvp

## Stack

- **Frontend:** Angular 19 (standalone components) — desplegado en [Vercel](https://vercel.com)
- **Backend:** Node.js + Express — desplegado en [Render](https://render.com)
- **Base de datos:** MySQL — alojada en [Clever Cloud](https://www.clever-cloud.com)
- **Autenticación:** JWT

> Nota: el backend está en el plan gratuito de Render, que "duerme" tras 15 minutos de inactividad — la primera petición tras un rato sin uso puede tardar unos segundos en responder mientras arranca de nuevo.

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

✅ MVP desplegado y funcional.
