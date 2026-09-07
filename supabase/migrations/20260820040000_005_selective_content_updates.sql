-- =============================================================================
-- MIGRATION 005 — Selective Content Updates
-- =============================================================================
-- Fuente: alignment-sql-preview.sql — PASO 3
--         audit-integracion-supabase.md §2.1 (content JSONB)
--
-- Solo se actualizan campos específicos cuando:
--   1. La identidad académica está confirmada (lesson_id match)
--   2. El campo Supabase está vacío o es claramente inferior
--   3. Se usa jsonb_set para no reemplazar content completo
--
-- Valores verificados contra:
--   - app/academic/grades/g67.ts (fuente local)
--   - app/academic/grades/g8.ts  (fuente local)
--   - SELECT de Supabase (scripts/query-lessons.mjs)
-- =============================================================================

-- --------------------------------------------------------------------------
-- 3.1 Actualizar topic cuando diffiere (g67-apr-s2)
--     Supabase ya tiene: "Interrogative and negative present simple tense"
--     Local  tiene: " Interrogative..." (leading-space typo)
--     Valor de migración = Supabase (sin typo) → NO-OP confirmado.
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET content = jsonb_set(content, '{topic}', '"Interrogative and negative present simple tense"')
WHERE lesson_id = 'g67-apr-s2'
  AND grade_code = 'g67'
  AND content->>'topic' IS DISTINCT FROM 'Interrogative and negative present simple tense';

-- --------------------------------------------------------------------------
-- 3.2 Actualizar badge cuando falta en Supabase (g8-jun-s1)
--     Supabase: content no tiene key 'badge'
--     Local  : badge = "Evaluación" (con acento)
--     jsonb_set necesita el 4to arg TRUE para insertar key faltante.
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET content = jsonb_set(content, '{badge}', '"Evaluación"', true)
WHERE lesson_id = 'g8-jun-s1'
  AND grade_code = 'g8'
  AND (content->>'badge' IS NULL OR content->>'badge' = '');

-- --------------------------------------------------------------------------
-- 3.3 Actualizar resources[2] cuando diffiere (g67-jul-s3)
--     Supabase: resources[2].desc = "Present continuous activities" (EN)
--     Local  : resources[2] = {title:"Wordwall — Present Continuous",
--                               desc:"Actividades del presente continuo" (ES),
--                               url:"https://wordwall.net/resource/present-continuous"}
--     Solo se reemplaza el elemento [2], no el array completo.
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET content = jsonb_set(content, '{resources,2}',
    '{"title":"Wordwall — Present Continuous","desc":"Actividades del presente continuo","url":"https://wordwall.net/resource/present-continuous"}'::jsonb
)
WHERE lesson_id = 'g67-jul-s3'
  AND grade_code = 'g67'
  AND content->'resources' IS NOT NULL
  AND jsonb_array_length(content->'resources') > 2
  AND (content->'resources'->2->>'desc') IS DISTINCT FROM 'Actividades del presente continuo';

-- --------------------------------------------------------------------------
-- 3.4 Validacion: verificar que los updates no crearon duplicados ni
--     inconsistencias. (Ver migracion 004 para queries de validacion)
-- --------------------------------------------------------------------------