-- =============================================
-- VERIFICAR Y CONFIGURAR ACCESO TEACHER CONTROL
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Verificar que la tabla profiles existe y tiene la estructura correcta
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Ver usuarios existentes en auth (requiere permisos de servicio)
SELECT id, email, created_at
FROM auth.users
LIMIT 10;

-- 3. Ver todos los perfiles y sus roles
SELECT id, role, created_at
FROM profiles;

-- 4. Verificar si hay algún perfil con rol 'teacher'
SELECT p.id, p.role, u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'teacher';

-- =============================================
-- SI NO EXISTE NINGÚN TEACHER, EJECUTAR ESTO:
-- =============================================

-- Opción A: Si ya creaste el usuario en Authentication > Users
-- (reemplaza 'tu-email@institucion.edu' con el email real)
-- UPDATE profiles SET role = 'teacher' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'tu-email@institucion.edu'
-- );

-- Opción B: Crear perfil teacher para un usuario existente
-- (reemplaza 'AQUI_EL_UUID_DEL_USUARIO' con el id real de auth.users)
-- INSERT INTO profiles (id, role)
-- VALUES ('AQUI_EL_UUID_DEL_USUARIO', 'teacher')
-- ON CONFLICT (id) DO UPDATE SET role = 'teacher';

-- =============================================
-- SI LA TABLA profiles NO EXISTE, CREARLA:
-- =============================================

-- CREATE TABLE IF NOT EXISTS profiles (
--   id UUID REFERENCES auth.users(id) PRIMARY KEY,
--   role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Habilitar RLS (Row Level Security)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuarios pueden leer su propio perfil
-- CREATE POLICY "Users can read own profile"
--   ON profiles FOR SELECT
--   USING (auth.uid() = id);

-- Política: usuarios pueden actualizar su propio perfil
-- CREATE POLICY "Users can update own profile"
--   ON profiles FOR UPDATE
--   USING (auth.uid() = id);
