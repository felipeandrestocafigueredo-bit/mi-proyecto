-- =============================================================================
-- MIGRATION 004 — Fix week_index (132 registros)
-- =============================================================================
-- Fuente: alignment-sql-preview.sql — PASO 2
--         audit-integracion-supabase.md §2.1 (week_index CHECK >= 0)
--
-- Corrige week_index donde:
--   1. lesson_id coincide exactamente entre local y Supabase
--   2. topic IGUAL + fecha IGUAL + games IGUAL + resources IGUAL
--   3. La diferencia es exactamente -1
--
-- NO se incluyen:
-- - g67-sep-s9, g67-sep-s10 (diferencia -9)
-- - g8-sep-p4-s1, g8-sep-p4-s2, g8-oct-s1..g8-oct-s6 (lesson_id resecuenciado)
-- - g9-oct-s1, g9-oct-s2 (diferencia +1)
-- - g1011-sep-p4-s1, g1011-sep-p4-s2, g1011-oct-s2, g1011-oct-s3, g1011-oct-s4 (mes divergente)
-- =============================================================================

-- --------------------------------------------------------------------------
-- 2.1 Bloque g67 — Enero (month_index 0)
-- Local: g67-jan-s1 week=1 → Supabase week=0 (diferencia -1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = 1
WHERE lesson_id = 'g67-jan-s1'
  AND grade_code = 'g67'
  AND month_index = 0
  AND week_index = 0;

-- --------------------------------------------------------------------------
-- 2.2 Bloque g67 — Febrero (month_index 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 1
  AND lesson_id IN ('g67-feb-s2', 'g67-feb-s3', 'g67-feb-s4', 'g67-feb-s5');

-- --------------------------------------------------------------------------
-- 2.3 Bloque g67 — Marzo (month_index 2)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 2
  AND lesson_id IN ('g67-mar-s6', 'g67-mar-s7', 'g67-mar-s8', 'g67-mar-s9');

-- --------------------------------------------------------------------------
-- 2.4 Bloque g67 — Abril (month_index 3)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 3
  AND lesson_id IN ('g67-apr-s1', 'g67-apr-s2', 'g67-apr-s3', 'g67-apr-s4');

-- --------------------------------------------------------------------------
-- 2.5 Bloque g67 — Mayo (month_index 4)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 4
  AND lesson_id IN ('g67-may-s5', 'g67-may-s6', 'g67-may-s7', 'g67-may-s8');

-- --------------------------------------------------------------------------
-- 2.6 Bloque g67 — Junio (month_index 5)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 5
  AND lesson_id IN ('g67-jun-s1', 'g67-jun-s2');

-- --------------------------------------------------------------------------
-- 2.7 Bloque g67 — Julio (month_index 6)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 6
  AND lesson_id IN ('g67-jul-s1', 'g67-jul-s2', 'g67-jul-s3', 'g67-jul-s4');

-- --------------------------------------------------------------------------
-- 2.8 Bloque g67 — Agosto (month_index 7)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 7
  AND lesson_id IN ('g67-aug-s1', 'g67-aug-s2', 'g67-aug-s3', 'g67-aug-s4');

-- --------------------------------------------------------------------------
-- 2.9 Bloque g67 — Octubre (month_index 9)
-- Solo g67-oct-s2 (g67-oct-s3 y g67-oct-s4 se insertan en PASO 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 9
  AND lesson_id = 'g67-oct-s2';

-- --------------------------------------------------------------------------
-- 2.10 Bloque g67 — Noviembre (month_index 10)
-- Solo g67-nov-s1 (g67-nov-s2 y g67-nov-s3 se insertan en PASO 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g67'
  AND month_index = 10
  AND lesson_id = 'g67-nov-s1';

-- --------------------------------------------------------------------------
-- 2.11 Bloque g8 — Enero (month_index 0)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 0
  AND lesson_id = 'g8-ene-s1';

-- --------------------------------------------------------------------------
-- 2.12 Bloque g8 — Febrero (month_index 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 1
  AND lesson_id IN ('g8-feb-s1', 'g8-feb-s2', 'g8-feb-s3', 'g8-feb-s4');

-- --------------------------------------------------------------------------
-- 2.13 Bloque g8 — Marzo (month_index 2)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 2
  AND lesson_id IN ('g8-mar-s1', 'g8-mar-s2', 'g8-mar-s3', 'g8-mar-s4');

-- --------------------------------------------------------------------------
-- 2.14 Bloque g8 — Abril (month_index 3)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 3
  AND lesson_id IN ('g8-abr-s1', 'g8-abr-s2', 'g8-abr-s3', 'g8-abr-s4');

-- --------------------------------------------------------------------------
-- 2.15 Bloque g8 — Mayo (month_index 4)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 4
  AND lesson_id IN ('g8-may-s1', 'g8-may-s2', 'g8-may-s3', 'g8-may-s4');

-- --------------------------------------------------------------------------
-- 2.16 Bloque g8 — Julio (month_index 6)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 6
  AND lesson_id IN ('g8-jul-s1', 'g8-jul-s2', 'g8-jul-s3', 'g8-jul-s4');

-- --------------------------------------------------------------------------
-- 2.17 Bloque g8 — Agosto (month_index 7)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 7
  AND lesson_id IN ('g8-ago-s1', 'g8-ago-s2', 'g8-ago-s3', 'g8-ago-s4');

-- --------------------------------------------------------------------------
-- 2.18 Bloque g8 — Septiembre (month_index 8)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g8'
  AND month_index = 8
  AND lesson_id IN ('g8-sep-s1', 'g8-sep-s2');

-- --------------------------------------------------------------------------
-- 2.19 Bloque g9 — Febrero (month_index 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 1
  AND lesson_id IN ('g9-feb-s1', 'g9-feb-s2', 'g9-feb-s3', 'g9-feb-s4');

-- --------------------------------------------------------------------------
-- 2.20 Bloque g9 — Marzo (month_index 2)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 2
  AND lesson_id IN ('g9-mar-s1', 'g9-mar-s2', 'g9-mar-s3', 'g9-mar-s4');

-- --------------------------------------------------------------------------
-- 2.21 Bloque g9 — Abril (month_index 3)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 3
  AND lesson_id IN ('g9-abr-s1', 'g9-abr-s2', 'g9-abr-s3', 'g9-abr-s4');

-- --------------------------------------------------------------------------
-- 2.22 Bloque g9 — Mayo (month_index 4)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 4
  AND lesson_id IN ('g9-may-s1', 'g9-may-s2', 'g9-may-s3', 'g9-may-s4');

-- --------------------------------------------------------------------------
-- 2.23 Bloque g9 — Junio (month_index 5)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 5
  AND lesson_id IN ('g9-jun-s1', 'g9-jun-s2');

-- --------------------------------------------------------------------------
-- 2.24 Bloque g9 — Julio (month_index 6)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 6
  AND lesson_id IN ('g9-jul-s1', 'g9-jul-s2', 'g9-jul-s3', 'g9-jul-s4');

-- --------------------------------------------------------------------------
-- 2.25 Bloque g9 — Agosto (month_index 7)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 7
  AND lesson_id IN ('g9-ago-s1', 'g9-ago-s2', 'g9-ago-s3', 'g9-ago-s4');

-- --------------------------------------------------------------------------
-- 2.26 Bloque g9 — Septiembre (month_index 8)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 8
  AND lesson_id IN ('g9-sep-s1', 'g9-sep-s2');

-- --------------------------------------------------------------------------
-- 2.27 Bloque g9 — Noviembre (month_index 10)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g9'
  AND month_index = 10
  AND lesson_id IN ('g9-nov-s1', 'g9-nov-s2', 'g9-nov-s3', 'g9-nov-s4', 'g9-nov-s5');

-- --------------------------------------------------------------------------
-- 2.28 Bloque g1011 — Enero (month_index 0)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 0
  AND lesson_id = 'g1011-ene-s1';

-- --------------------------------------------------------------------------
-- 2.29 Bloque g1011 — Febrero (month_index 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 1
  AND lesson_id IN ('g1011-feb-s1', 'g1011-feb-s2', 'g1011-feb-s3', 'g1011-feb-s4');

-- --------------------------------------------------------------------------
-- 2.30 Bloque g1011 — Marzo (month_index 2)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 2
  AND lesson_id IN ('g1011-mar-s1', 'g1011-mar-s2', 'g1011-mar-s3', 'g1011-mar-s4');

-- --------------------------------------------------------------------------
-- 2.31 Bloque g1011 — Abril (month_index 3)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 3
  AND lesson_id IN ('g1011-abr-s1', 'g1011-abr-s2', 'g1011-abr-s3', 'g1011-abr-s4');

-- --------------------------------------------------------------------------
-- 2.32 Bloque g1011 — Mayo (month_index 4)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 4
  AND lesson_id IN ('g1011-may-s1', 'g1011-may-s2', 'g1011-may-s3');

-- --------------------------------------------------------------------------
-- 2.33 Bloque g1011 — Junio (month_index 5)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 5
  AND lesson_id IN ('g1011-jun-s1', 'g1011-jun-s2');

-- --------------------------------------------------------------------------
-- 2.34 Bloque g1011 — Julio (month_index 6)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 6
  AND lesson_id IN ('g1011-jul-s1', 'g1011-jul-s2', 'g1011-jul-s3', 'g1011-jul-s4');

-- --------------------------------------------------------------------------
-- 2.35 Bloque g1011 — Agosto (month_index 7)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 7
  AND lesson_id IN ('g1011-ago-s1', 'g1011-ago-s2', 'g1011-ago-s3', 'g1011-ago-s4');

-- --------------------------------------------------------------------------
-- 2.36 Bloque g1011 — Septiembre (month_index 8)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 8
  AND lesson_id IN ('g1011-sep-s1', 'g1011-sep-s2');

-- --------------------------------------------------------------------------
-- 2.37 Bloque g1011 — Noviembre (month_index 10)
-- Solo g1011-nov-s1 (insertada en PASO 1)
-- --------------------------------------------------------------------------
UPDATE public.lessons
SET week_index = week_index + 1
WHERE grade_code = 'g1011'
  AND month_index = 10
  AND lesson_id = 'g1011-nov-s1';

-- =============================================================================
-- VALIDACIÓN POST-CORRECCIÓN (PASO 4 del alignment SQL)
-- =============================================================================
-- 4.1 Verificar total de registros: 153 (148 + 5 inserts)
-- 4.2 Verificar unicidad de (grade_code, month_index, week_index): 0 filas duplicadas
-- 4.3 Verificar unicidad de lesson_id: 0 filas duplicadas
-- 4.4 Verificar que los lesson_id bloqueados no fueron modificados
-- 4.5 Verificar que no hay week_index = 0 restante
-- 4.6 Verificar inserción de las 5 lecciones faltantes
--
-- NOTA: Las validaciones se incluyen como comentarios.
-- Ejecutar manualmente en SQL Editor tras aplicar la migración.
-- =============================================================================
