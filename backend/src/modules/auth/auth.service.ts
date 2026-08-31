import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/db.js';
import { ENV } from '../../config/env.js';
import { LoginInput } from './auth.schema.js';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    user: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export class AuthService {
  /**
   * Autenticación estricta con el campo 'user'
   */
  static async login(input: LoginInput): Promise<AuthResponse> {
    const { user, password } = input;

    // Consulta con JOIN a roles buscando por la columna 'user'
    const sql = `
      SELECT 
        u.id, 
        u."user", 
        u.email, 
        u.password_hash, 
        u.first_name, 
        u.last_name, 
        u.is_active,
        r.name AS role
      FROM public.users u
      INNER JOIN public.roles r ON u.role_id = r.id
      WHERE u."user" = $1
      LIMIT 1;
    `;

    const result = await query(sql, [user]);

    if (result.rows.length === 0) {
      throw new Error('Credenciales inválidas');
    }

    const userData = result.rows[0];

    if (!userData.is_active) {
      throw new Error('La cuenta de usuario se encuentra inactiva');
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar JWT
    const tokenPayload = {
      id: userData.id,
      user: userData.user,
      email: userData.email,
      role: userData.role,
    };

    const token = jwt.sign(tokenPayload, ENV.JWT_SECRET, {
      expiresIn: '8h',
    });

    return {
      token,
      user: {
        id: userData.id,
        user: userData.user,
        email: userData.email,
        role: userData.role,
        firstName: userData.first_name,
        lastName: userData.last_name,
      },
    };
  }
}
