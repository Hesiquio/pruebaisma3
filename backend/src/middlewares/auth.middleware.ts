import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface AuthUserPayload {
  id: string;
  user: string;
  email: string;
  role: 'PROFESOR' | 'ALUMNO';
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        message: 'Acceso no autorizado. Token Bearer requerido.',
      },
      401
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
    c.set('authUser', decoded);
    await next();
  } catch (error) {
    return c.json(
      {
        success: false,
        message: 'Token inválido o expirado.',
      },
      401
    );
  }
}
