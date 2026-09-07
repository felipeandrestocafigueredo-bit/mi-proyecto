/* ===========================================================================
 * migrate-g67.ts — Script de migración de lecciones g67 a Supabase
 * ===========================================================================
 * ⚠️  CORRECCIÓN: Este script usa SUPABASE_SERVICE_ROLE_KEY (no la anon key)
 *     porque los inserts/upserts deben bypassar RLS. La auditoría
 *     (audit-integracion-supabase.md:129-132) documenta que la
 *     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY carece de privilegios para
 *     escribir con RLS activado.
 *
 * Uso:  npx tsx scripts/migrate-g67.ts
 * ========================================================================== */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnv(): Record<string, string> {
  const envPath = join(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  const result: Record<string, string> = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key) result[key] = value;
  }
  return result;
}

const env = loadEnv();

import g67 from "../app/academic/grades/g67";

/* ---------------------------------------------------------------------------
 * Service Role Client — bypassa RLS para migraciones y seeds.
 * NUNCA usar en el cliente (browser).
 * ------------------------------------------------------------------------- */
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.includes("your_service_role_key_here")) {
  console.error("🔴 SUPABASE_SERVICE_ROLE_KEY es placeholder. Edita .env.local.");
  console.error("   Debes pegar la service_role key JWT (empieza con 'eyJ')");
  process.exit(1);
}

if (!SERVICE_ROLE_KEY.startsWith("eyJ") && !SERVICE_ROLE_KEY.startsWith("sb_secret_")) {
  console.error("🔴 SUPABASE_SERVICE_ROLE_KEY no tiene formato válido.");
  console.error("   Debe ser JWT (eyJ...) o service key (sb_secret_...)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!);

const GRADE_CODE = "g67";

type RawLesson = {
  id: string;
  topic: string;
  fecha?: string;
  vocab?: unknown[];
  games?: string[];
  presentation?: unknown[];
  resources?: unknown[];
  badge?: string;
};

type LessonInsert = {
  lesson_id: string;
  grade_code: string;
  month_index: number;
  week_index: number;
  title: string;
  content: Record<string, unknown>;
};

function buildInsert(lesson: RawLesson, month_index: number, week_index: number): LessonInsert {
  return {
    lesson_id: lesson.id,
    grade_code: GRADE_CODE,
    month_index,
    week_index,
    title: lesson.topic,
    content: {
      vocab: lesson.vocab ?? [],
      games: lesson.games ?? [],
      presentation: lesson.presentation ?? [],
      resources: lesson.resources ?? [],
      badge: lesson.badge ?? "",
      fecha: lesson.fecha ?? ""
    }
  };
}

async function main() {
  const inserts: LessonInsert[] = [];

  for (const [monthKey, weeks] of Object.entries(g67)) {
    const month_index = Number(monthKey);
    if (!Array.isArray(weeks)) continue;

    weeks.forEach((week, week_index) => {
      inserts.push(buildInsert(week as RawLesson, month_index, week_index));
    });
  }

  console.log(`Lecciones a procesar: ${inserts.length}`);

  const ids = inserts.map(i => i.lesson_id);
  const { data: existing } = await supabase
    .from("lessons")
    .select("lesson_id")
    .in("lesson_id", ids);

  const existingSet = new Set((existing ?? []).map((e: { lesson_id: string }) => e.lesson_id));
  const toInsert = inserts.filter(i => !existingSet.has(i.lesson_id));

  console.log(`Nuevas a insertar: ${toInsert.length}`);

  for (let i = 0; i < toInsert.length; i += 50) {
    const chunk = toInsert.slice(i, i + 50);
    const { error } = await supabase
      .from("lessons")
      .upsert(chunk, {
        onConflict: "grade_code,month_index,week_index",
        ignoreDuplicates: true,
      });
    if (error) {
      console.error(`Error en lote ${i}:`, error.message);
      process.exit(1);
    }
  }

  console.log("Migración completada.");
}

main();
