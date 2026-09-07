-- =============================================================================
-- MIGRATION 006 — Storage Bucket Setup (academic-files)
-- =============================================================================
-- Fuente: audit-integracion-supabase.md §4 (Storage)
--         app/actions/storageActions.ts (ensureStorageBucketExists)
--         app/services/storageService.ts (STORAGE_BUCKET = "academic-files")
-- =============================================================================
--
-- El bucket `academic-files` es:
--   - Público (public: true) — getPublicUrl() funciona sin autenticación
--   - Path structure: {gradeCode}/month-{monthIndex}/week-{weekIndex}/{folder}/{fileName}
--   - Folders: worksheets, slides, resources
--
-- storageActions.ts crea el bucket en runtime con SUPABASE_SERVICE_ROLE_KEY.
-- Esta migración garantiza que exista desde el DB, sin depender del código.
-- =============================================================================

-- Crear el bucket si no existe (equivalente a storageActions.ts)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, created_at, updated_at)
VALUES ('academic-files', 'academic-files', true, false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Storage RLS
-- -----------------------------------------------------------------------------
-- storage.objects necesita RLS para control de acceso por path.
-- El bucket es público, pero permitimos a authenticated usuarios listar
-- y subir dentro de su propia estructura de paths.
-- -----------------------------------------------------------------------------

-- Habilitar RLS en storage.objects (viene activado por defecto en Supabase)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Permite a usuarios autenticados subir archivos al bucket academic-files
CREATE POLICY "Authenticated users can upload to academic-files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'academic-files');

-- Permite a usuarios autenticados leer/listar objetos del bucket
CREATE POLICY "Authenticated users can read academic-files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'academic-files');

-- Permite a usuarios autenticados actualizar metadatos
CREATE POLICY "Authenticated users can update academic-files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'academic-files');

-- Permite a usuarios autenticados eliminar archivos
CREATE POLICY "Authenticated users can delete academic-files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'academic-files');

-- NOTA: Si el bucket es público, los usuarios anónimos también pueden leer.
-- Para restringir el acceso público, añade:
-- CREATE POLICY "Public read is disabled" ON storage.objects FOR SELECT USING (false);
-- y luego usa getSignedUrl() en storageService.ts para acceso controlado.
