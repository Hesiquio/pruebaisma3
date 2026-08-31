import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from './auth.schema.js';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

export const authRoutes = new Hono();

/**
 * @route POST /api/auth/login
 * @desc Autenticación de usuarios (Profesores y Alumnos)
 * @body { user: string, password: string }
 */
authRoutes.post(
  '/login',
  zValidator('json', loginSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: 'Error de validación en la solicitud',
          errors: result.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        400
      );
    }
  }),
  AuthController.login
);

/**
 * @route GET /api/auth/me
 * @desc Obtener datos de la sesión actual (Ruta protegida)
 */
authRoutes.get('/me', authMiddleware, AuthController.me);
