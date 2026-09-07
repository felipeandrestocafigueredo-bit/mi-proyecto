-- =============================================================================
-- MIGRATION 007 — Create Profile on Signup (trigger + function)
-- =============================================================================
-- Fuente: audit-integracion-supabase.md §2.2, §3 (Autenticación)
--         verify-teacher-access.sql (comentarios sobre auto-creación)
-- -----------------------------------------------------------------------
-- La auditoría señala:
--   "Confirmar que `profiles` se crea automáticamente al registrarse
--    un usuario (o hay trigger/Edge Function para ello)."
--
-- Este trigger crea automáticamente una fila en `profiles`
-- (con role='student') cuando un usuario se registra en auth.users.
-- El SessionProvider.tsx ya no retornará 'student' por defecto si el
-- perfil no existe — porque siempre existirá.
-- =============================================================================

-- Función que se ejecuta en INSERT sobre auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'student');
    RETURN NEW;
END;
$$;

-- Trigger: ejecuta la función en cada nuevo usuario
-- `auth.users` es gestionado por Supabase; este trigger dispara en INSERT.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
