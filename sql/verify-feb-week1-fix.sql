-- =============================================================================
-- DIAGNÓSTICO + VERIFICACIÓN: append atómico en g67 feb semana 1
-- =============================================================================
-- Reemplaza 'g67-feb-s1' si tu lesson_id es distinto (usa bloque A para
-- confirmar el nombre exacto).
-- =============================================================================

-- (A) Identifica la lección de febrero semana 1 de grado 67
SELECT lesson_id, grade_code, month_index, week_index,
       jsonb_array_length(COALESCE(content->'resources', '[]'::jsonb)) AS resources_n,
       jsonb_array_length(COALESCE(content->'worksheets', '[]'::jsonb)) AS worksheets_n,
       jsonb_array_length(COALESCE(content->'slides', '[]'::jsonb)) AS slides_n
FROM public.lessons
WHERE grade_code = 'g67'
  AND month_index = 1
  AND week_index = 1;

-- (B) Lista todos los archivos en storage bajo feb/semana-1
SELECT split_part(name, '/', 4) AS folder,
       name,
       created_at,
       metadata->>'size' AS size,
       metadata->>'mimetype' AS mimetype
FROM storage.objects
WHERE bucket_id = 'academic-files'
  AND name LIKE 'g67/month-1/week-1/%'
ORDER BY folder, created_at DESC;

-- (C) Verifica que la función RPC existe
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE proname = 'append_lesson_content_item';

-- (D) Verifica los permisos de la función
SELECT grantee, privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'append_lesson_content_item';

-- (E) PRUEBA EL FIX directamente: añade un item de prueba al folder resources
-- (NO toques esto hasta haber confirmado que (C) y (D) están OK)
SELECT * FROM public.append_lesson_content_item(
  'g67-feb-s1',
  'resources',
  '{"title":"__test_item__","url":"https://example.com/test","path":"g67/month-1/week-1/resources/__test__","type":"application/pdf","description":"item de prueba"}'::jsonb
);

-- (F) Verifica que el item de prueba se añadió (resources_n debe haber subido +1)
SELECT jsonb_array_length(content->'resources') AS resources_n,
       content->'resources' AS resources
FROM public.lessons
WHERE lesson_id = 'g67-feb-s1';

-- (G) Limpia el item de prueba (ejecuta solo después de confirmar que funciona)
DELETE FROM public.lessons
WHERE lesson_id = 'g67-feb-s1';
-- WARNING: el DELETE de arriba borra la lección entera, no solo el item.
-- Si quieres borrar SOLO el item de prueba, ejecuta en su lugar:
-- UPDATE public.lessons
-- SET content = jsonb_set(
--   content,
--   '{resources}',
--   (content->'resources') - (jsonb_array_length(content->'resources') - 1)
-- )
-- WHERE lesson_id = 'g67-feb-s1';