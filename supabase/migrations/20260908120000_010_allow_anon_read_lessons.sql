-- =============================================================================
-- MIGRATION: Allow anonymous read access to public.lessons
-- =============================================================================
-- Problema:
--   La app tiene un flujo de acceso local (visitor/teacher) sin autenticación
--   en Supabase. loadGradeFromSupabase() usa el cliente anon, pero la policy
--   actual de SELECT requiere TO authenticated. Esto causa que la consulta
--   falle y la app caiga al respaldo local (g67.ts, g8.ts, etc.).
--   Cuando un teacher agrega un link/server action guarda en Supabase, la UI
--   sigue mostrando el respaldo local y no refleja el cambio.
--
-- Solución:
--   Crear una policy adicional que permita SELECT a TO anon.
-- =============================================================================

CREATE POLICY "Anonymous users can read lessons"
    ON public.lessons FOR SELECT
    TO anon
    USING (true);
