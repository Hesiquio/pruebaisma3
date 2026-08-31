import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { ENV } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';

const app = new Hono();

// Middlewares globales
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Ruta de comprobación de salud del sistema
app.get('/health', (c) => {
  return c.json({
    status: 'online',
    system: 'Sistema de Administracion de Tareas Escolares',
    sprint: 'Sprint 1 - Fundacion y Acceso',
    timestamp: new Date().toISOString(),
  });
});

// Montaje de rutas modulares (preparado para Sprint 2: /api/tasks y Sprint 3: /api/evaluations)
app.route('/api/auth', authRoutes);

// Manejador de rutas no encontradas (404)
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: 'Recurso no encontrado en el servidor',
    },
    404
  );
});

// Manejador global de errores
app.onError((err, c) => {
  console.error('[Unhandled Error]:', err);
  return c.json(
    {
      success: false,
      message: 'Error no controlado en el servidor',
      error: ENV.NODE_ENV === 'development' ? err.message : undefined,
    },
    500
  );
});

// Inicio del servidor
console.log(`🚀 Servidor Hono ejecutándose en el puerto ${ENV.PORT}`);

serve({
  fetch: app.fetch,
  port: ENV.PORT,
});

export default app;
