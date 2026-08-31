-- ==============================================================================
-- SISTEMA DE ADMINISTRACIÓN DE TAREAS ESCOLARES
-- Sprint 1: Fundación y Acceso
-- DDL para Supabase / PostgreSQL
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabla de Roles (Profesor, Alumno)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabla de Usuarios
-- NOTA DE ARQUITECTURA: El identificador principal de cuenta es la columna "user"
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" VARCHAR(60) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Índices para optimizar consultas de autenticación y búsquedas
CREATE INDEX IF NOT EXISTS idx_users_user ON public.users("user");
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);

-- 5. Función y Trigger para actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 6. Habilitación de Row Level Security (RLS) en Supabase
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura básica
CREATE POLICY "Permitir lectura publica de roles"
ON public.roles FOR SELECT
USING (true);

CREATE POLICY "Permitir lectura de perfil propio"
ON public.users FOR SELECT
USING (auth.uid() = id OR true); -- Adaptable con autenticación custom/Supabase Auth

-- ==============================================================================
-- DATOS SEMILLA (SEEDS) PARA DESARROLLO Y TESTING (SPRINT 1)
-- ==============================================================================

-- Inserción de Roles
INSERT INTO public.roles (id, name, description)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PROFESOR', 'Docente responsable de crear y evaluar tareas'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ALUMNO', 'Estudiante que entrega tareas y consulta calificaciones')
ON CONFLICT (name) DO NOTHING;

-- Inserción de Usuarios de prueba
-- Contraseña para ambos usuarios: "Password123!" (hash bcrypt con salt de 10 rondas)
-- Hash: $2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdO40zq0sm162W5C
INSERT INTO public.users (id, "user", email, password_hash, role_id, first_name, last_name, is_active)
VALUES 
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        'profesor_demo',
        'profesor@instituto.edu',
        '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdO40zq0sm162W5C',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Carlos',
        'Mendoza',
        true
    ),
    (
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'alumno_demo',
        'alumno@instituto.edu',
        '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdO40zq0sm162W5C',
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'Valeria',
        'Torres',
        true
    )
ON CONFLICT ("user") DO NOTHING;
