-- =============================================================================
-- MIGRATION 001 — Init Schema (lessons + profiles)
-- =============================================================================
-- Fuente: audit-integracion-supabase.md §2.1, §2.2
--         sql/verify-teacher-access.sql (DDL uncommented)
--         alignment-sql-preview.sql (estructura de columnas)
--
-- NOTA: Supabase crea automáticamente los esquemas `auth`, `storage`,
--       `realtime` y la extensión `pgcrypto` (UUIDs). Esta migración
--       define únicamente las tablas de la aplicación en `public`.
-- =============================================================================

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLA: public.lessons
-- =============================================================================
-- Identidad académica: (lesson_id) es el identificador de negocio.
-- month_index: 0=Jan .. 11=Dec (CHECK 0..11)
-- week_index:  1,2,3,4 por mes (CHECK >= 1)
-- content: JSONB con vocab, games, resources, presentation, slides, worksheets
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id   TEXT    NOT NULL UNIQUE,
    grade_code  TEXT    NOT NULL DEFAULT '',
    month_index SMALLINT NOT NULL DEFAULT 0,
    week_index  SMALLINT NOT NULL DEFAULT 1,
    title       TEXT,
    content     JSONB   NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Constraints de integridad referida en la auditoría
-- month_index entre 0 y 11 (meses del año)
ALTER TABLE public.lessons
    ADD CONSTRAINT lessons_month_index_check
    CHECK (month_index >= 0 AND month_index <= 11);

-- week_index >= 0 (permite inserts iniciales 0-based; la migración 004
-- corrige todos los valores a 1-based tras la carga de datos)
ALTER TABLE public.lessons
    ADD CONSTRAINT lessons_week_index_check
    CHECK (week_index >= 0);

-- Índices para consultas frecuentes
-- findLessonByWeek en storageService.ts usa (grade_code, month_index, week_index)
CREATE INDEX IF NOT EXISTS idx_lessons_lookup
    ON public.lessons (grade_code, month_index, week_index);

-- supabaseService.ts ordena por (month_index, week_index)
CREATE INDEX IF NOT EXISTS idx_lessons_order
    ON public.lessons (month_index ASC, week_index ASC);

-- =============================================================================
-- TABLA: public.profiles
-- =============================================================================
-- FK → auth.users.id (uno-a-uno)
-- role CHECK ('student' | 'teacher')

CREATE TABLE IF NOT EXISTS public.profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role       TEXT NOT NULL DEFAULT 'student'
                        CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- RLS se habilita en la migración 002 para poder crear policies después.
-- Pero la tabla debe existir con RLS OFF inicialmente para permitir
-- la creación del trigger en 007.

-- Comentario de documentación
COMMENT ON TABLE public.lessons IS 'Lecciones académicas con contenido JSONB estructurado';
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con rol (student/teacher), FK a auth.users';
