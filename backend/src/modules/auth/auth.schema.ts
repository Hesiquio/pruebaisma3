import { z } from 'zod';

/**
 * REGLA ESTRICTA DE ARQUITECTURA:
 * El campo identificador de la cuenta es OBLIGATORIAMENTE 'user'.
 */
export const loginSchema = z.object({
  user: z
    .string({
      required_error: 'El campo user es obligatorio',
      invalid_type_error: 'El campo user debe ser una cadena de texto',
    })
    .min(3, 'El campo user debe tener al menos 3 caracteres')
    .max(60, 'El campo user no puede exceder 60 caracteres')
    .trim(),
  password: z
    .string({
      required_error: 'El campo password es obligatorio',
    })
    .min(6, 'El campo password debe tener al menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
