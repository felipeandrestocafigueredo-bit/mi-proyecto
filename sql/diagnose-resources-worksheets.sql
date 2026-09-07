-- =============================================================================
-- DIAGNÓSTICO: Por qué Resources/Worksheet subidos no aparecen a los estudiantes
-- =============================================================================
-- Ejecuta cada bloque por separado en Supabase SQL Editor.
-- =============================================================================

-- (A) Ver TODOS los archivos en storage agrupados por carpeta real
SELECT
  split_part(name, '/', 1) AS grade,
  split_part(name, '/', 2) AS month_folder,
  split_part(name, '/', 3) AS week_folder,
  split_part(name, '/', 4) AS folder_kind,
  COUNT(*) AS total_files
FROM storage.objects
WHERE bucket_id = 'academic-files'
GROUP BY 1, 2, 3, 4
ORDER BY 1, 2, 3, 4;

-- (B) Confirmar combinación (grade_code, month_index, week_index) de TODAS las lecciones
SELECT lesson_id, grade_code, month_index, week_index,
       jsonb_typeof(content) AS content_type,
       jsonb_array_length(COALESCE(content->'resources', '[]'::jsonb)) AS resources_n,
       jsonb_array_length(COALESCE(content->'worksheets', '[]'::jsonb)) AS worksheets_n
FROM public.lessons
ORDER BY grade_code, month_index, week_index;

-- (C) Ver las policies activas sobre storage.objects
SELECT polname,
       polroles::regrole[]::text[] AS roles,
       polcmd,
       polqual::text AS using_clause
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'objects'
  AND cls.relnamespace = 'storage'::regnamespace
ORDER BY polname;

-- (D) Verificar el bucket
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name = 'academic-files';

-- (E) Listar archivos reales con sus nombres completos (cambia el LIKE al folder que esperas)
SELECT name, created_at, metadata->>'size' AS size, metadata->>'mimetype' AS mimetype
FROM storage.objects
WHERE bucket_id = 'academic-files'
  AND name LIKE '%resources%'
ORDER BY created_at DESC
LIMIT 30;