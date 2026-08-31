import { Context } from 'hono';
import { AuthService } from './auth.service.js';
import { LoginInput } from './auth.schema.js';

export class AuthController {
  static async login(c: Context) {
    try {
      const body = await c.req.json<LoginInput>();
      const authData = await AuthService.login(body);

      return c.json(
        {
          success: true,
          message: 'Autenticación exitosa',
          data: authData,
        },
        200
      );
    } catch (error: any) {
      const isAuthError =
        error.message === 'Credenciales inválidas' ||
        error.message === 'La cuenta de usuario se encuentra inactiva';

      return c.json(
        {
          success: false,
          message: error.message || 'Error interno del servidor al procesar el login',
        },
        isAuthError ? 401 : 500
      );
    }
  }

  static async me(c: Context) {
    const authUser = c.get('authUser');
    return c.json({
      success: true,
      data: authUser,
    });
  }
}
