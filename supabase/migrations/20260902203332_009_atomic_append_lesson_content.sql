-- =============================================================================
-- MIGRATION: Atomic append to public.lessons.content JSONB
-- =============================================================================
-- Problema:
--   El server action uploadAndPersistFile hace read-modify-write del JSONB
--   content en public.lessons. Si dos subidas concurrentes al mismo folder
--   leen antes de que la otra escriba, una sobrescribe a la otra y se
--   pierden items. Resultado: solo se conservan los primeros 3 items en
--   resources/worksheets.
--
-- Solución:
--   Crear una función SECURITY DEFINER (service_role la invoca) que usa
--   jsonb_set + coalesce para hacer append atómico al final del array
--   correspondiente sin perder items previos.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.append_lesson_content_item(
  p_lesson_id TEXT,
  p_folder    TEXT,
  p_item      JSONB
)
RETURNS SETOF public.lessons
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo se permiten los 3 folders canónicos; cualquier otra key se ignora.
  IF p_folder NOT IN ('worksheets', 'slides', 'resources') THEN
    RAISE EXCEPTION 'Folder no permitido: %', p_folder;
  END IF;

  -- Si la fila no existe, no hacer nada y devolver vacío.
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE lesson_id = p_lesson_id) THEN
    RETURN;
  END IF;

  RETURN QUERY
  UPDATE public.lessons
  SET content = jsonb_set(
    COALESCE(content, '{}'::jsonb),
    ARRAY[p_folder],
    COALESCE(content -> p_folder, '[]'::jsonb) || jsonb_build_array(p_item),
    true
  )
  WHERE lesson_id = p_lesson_id
  RETURNING *;
END;
$$;

-- Permitir que service_role y authenticated ejecuten la función
REVOKE ALL ON FUNCTION public.append_lesson_content_item(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.append_lesson_content_item(TEXT, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.append_lesson_content_item(TEXT, TEXT, JSONB) TO authenticated;