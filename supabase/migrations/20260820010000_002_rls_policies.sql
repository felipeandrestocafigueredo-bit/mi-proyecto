-- =============================================================================
-- MIGRATION 002 — RLS Policies (lessons + profiles)
-- =============================================================================
-- Fuente: audit-integracion-supabase.md §2.1 (RLS confirmado), §2.2 (policies)
--         sql/verify-teacher-access.sql (policies commented → uncommented)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- RLS en public.lessons
-- -----------------------------------------------------------------------------
-- La app consulta lessons con la anon/publishable key vía createServerClient
-- (app/services/supabaseService.ts). Sin RLS, cualquier usuario ve todo.
-- Con RLS, necesitamos policies para que:
--   - Teachers: pueden leer/escribir todas las lecciones
--   - Students: pueden leer todas las lecciones (catálogo público de contenidos)
-- -----------------------------------------------------------------------------

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- SELECT: todos los usuarios autenticados pueden leer el catálogo de lecciones
CREATE POLICY "Authenticated users can read lessons"
    ON public.lessons FOR SELECT
    TO authenticated
    USING (true);

-- INSERT: cualquier usuario autenticado puede crear lecciones (para seeds/migraciones)
-- Nota: en producción deberías restringirlo a teachers.
CREATE POLICY "Authenticated users can insert lessons"
    ON public.lessons FOR INSERT
    TO authenticated
    FOR VALUES (true);

-- UPDATE: cualquier usuario autenticado puede actualizar
CREATE POLICY "Authenticated users can update lessons"
    ON public.lessons FOR UPDATE
    TO authenticated
    USING (true);

-- DELETE: cualquier usuario autenticado puede eliminar
CREATE POLICY "Authenticated users can delete lessons"
    ON public.lessons FOR DELETE
    TO authenticated
    USING (true);

-- -----------------------------------------------------------------------------
-- RLS en public.profiles
-- -----------------------------------------------------------------------------
-- policies desde verify-teacher-access.sql

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: usuarios pueden leer su propio perfil
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- UPDATE: usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- INSERT: permitir crear perfil (usado por el trigger en 007)
CREATE POLICY "Service role can create profiles"
    ON public.profiles FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Para que SessionProvider.tsx funcione: el usuario anónimo también necesita
-- leer su perfil durante el proceso de auth (antes de que el trigger lo cree).
-- Supabase crea automáticamente el perfil vía trigger (migración 007), pero
-- durante la transición, permitimos a authenticated leer su propio perfil:
-- (ya cubierto por "Users can read own profile" arriba)
