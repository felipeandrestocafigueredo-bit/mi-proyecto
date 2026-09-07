-- =============================================================================
-- DIAGNÓSTICO: ¿Por qué no se ven las PPTs subidas por el docente?
-- =============================================================================
-- Ejecutar en Supabase SQL Editor. Reemplaza 'g67' por el grado que uses.
-- =============================================================================

-- 1) ¿La lección existe en public.lessons con la combinación correcta?
SELECT lesson_id,
       grade_code,
       month_index,
       week_index,
       title,
       content IS NOT NULL AS has_content,
       jsonb_typeof(content) AS content_type,
       jsonb_array_length(COALESCE(content->'slides', '[]'::jsonb)) AS slides_count,
       jsonb_array_length(COALESCE(content->'resources', '[]'::jsonb)) AS resources_count,
       jsonb_array_length(COALESCE(content->'worksheets', '[]'::jsonb)) AS worksheets_count
FROM public.lessons
WHERE grade_code = 'g67'
ORDER BY month_index, week_index
LIMIT 40;

-- 2) Inspección profunda del content.slides (cambia month_index/week_index por los reales)
SELECT lesson_id,
       content->'slides' AS slides_array,
       content->'presentation' AS presentation_array
FROM public.lessons
WHERE grade_code = 'g67'
  AND month_index = 0
  AND week_index = 1;

-- 3) ¿Hay archivos en storage bajo el path correcto?
SELECT name,
       bucket_id,
       created_at,
       metadata->>'size' AS size,
       metadata->>'mimetype' AS mimetype
FROM storage.objects
WHERE bucket_id = 'academic-files'
  AND name LIKE 'g67/month-0/week-1/slides/%'
ORDER BY created_at DESC
LIMIT 20;

-- 4) ¿Las policies de storage.objects permiten SELECT a anon y authenticated?
SELECT polname, polroles::regrole[]::text[] AS roles, polcmd, polqual::text AS using_clause
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'objects'
  AND cls.relnamespace = 'storage'::regnamespace;

-- 5) Verificar que el bucket existe y es público
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE name = 'academic-files';

-- 6) Listar TODOS los archivos en el bucket agrupados por carpeta (sirve para
-- detectar si el docente subió a una ruta con month_index o week_index distinto)
SELECT split_part(name, '/', 1) AS grade,
       split_part(name, '/', 2) AS month_folder,
       split_part(name, '/', 3) AS week_folder,
       split_part(name, '/', 4) AS folder,
       count(*) AS files
FROM storage.objects
WHERE bucket_id = 'academic-files'
GROUP BY 1, 2, 3, 4
ORDER BY 1, 2, 3, 4;