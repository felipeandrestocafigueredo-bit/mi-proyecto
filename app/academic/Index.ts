import type { Lesson } from "../models/LessonModel";
import { normalizeLesson } from "../models/LessonModel";

import { migrateAcademicGrade } from "./lessonMigration";

import g67 from "./grades/g67";
import g8 from "./grades/g8";
import g9 from "./grades/g9";
import g1011 from "./grades/g1011";

import MONTHS from "../data/months";

import { createClient } from "../lib/supabase/client";

type MonthMap = Record<string, Lesson[]>;
type GradeMap = Record<string, MonthMap>;

const GRADES: GradeMap = {
  g67: migrateAcademicGrade(g67),
  g8: migrateAcademicGrade(g8),
  g9: migrateAcademicGrade(g9),
  g1011: migrateAcademicGrade(g1011),
};

function monthNameToIndex(name: string): number {
  const idx = MONTHS.indexOf(name);
  return idx >= 0 ? idx : 0;
}

/* =========================================================
   DATOS LOCALES — RESPALDO
   ========================================================= */

export function getGrade(gradeId: string = "g67"): MonthMap {
  return GRADES[gradeId as keyof GradeMap] || GRADES.g67;
}

export function getMonth(
  gradeId = "g67",
  month = "Enero"
): Lesson[] {
  const grade = getGrade(gradeId);
  const idx = String(monthNameToIndex(month));

  return grade[idx] || [];
}

export function getMonthByIndex(
  gradeId = "g67",
  monthIndex = 0
): Lesson[] {
  const grade = getGrade(gradeId);

  return grade[String(monthIndex)] || [];
}

export function getLesson(
  gradeId = "g67",
  month = "Enero",
  weekIndex = 0
): Lesson | null {
  const monthLessons = getMonth(gradeId, month);

  return monthLessons[weekIndex] || null;
}

export function getLessonByIndex(
  gradeId = "g67",
  monthIndex = 0,
  weekIndex = 0
): Lesson | null {
  const monthLessons = getMonthByIndex(
    gradeId,
    monthIndex
  );

  return monthLessons[weekIndex] || null;
}

/* =========================================================
   SUPABASE — FUENTE PRINCIPAL
   ========================================================= */

export async function loadGradeFromSupabase(
  gradeCode = "g67"
): Promise<MonthMap> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(
      "lesson_id, grade_code, month_index, week_index, title, content"
    )
    .eq("grade_code", gradeCode)
    .order("month_index", { ascending: true })
    .order("week_index", { ascending: true });

  if (error) {
    console.error(
      "Error cargando lessons desde Supabase:",
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        raw: error,
      }
    );

    return getGrade(gradeCode);
  }

  if (!data) {
    console.warn("loadGradeFromSupabase: data vacía, usando respaldo local");
    return getGrade(gradeCode);
  }

  const result: MonthMap = {};

  for (const row of data ?? []) {
    const monthKey = String(row.month_index);

    if (!result[monthKey]) {
      result[monthKey] = [];
    }

    result[monthKey].push(normalizeLesson(row));
  }

  return result;
}

/* =========================================================
   SUPABASE — MES
   ========================================================= */

export async function loadMonthFromSupabase(
  gradeCode = "g67",
  monthIndex = 0
): Promise<Lesson[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(
      "lesson_id, grade_code, month_index, week_index, title, content"
    )
    .eq("grade_code", gradeCode)
    .eq("month_index", monthIndex)
    .order("week_index", { ascending: true });

  if (error) {
    console.error(
      "Error cargando mes desde Supabase:",
      error
    );

    return getMonthByIndex(gradeCode, monthIndex);
  }

  return (data ?? []).map((row: Record<string, unknown>) => normalizeLesson(row));
}

/* =========================================================
   SUPABASE — LESSON INDIVIDUAL
   ========================================================= */

export async function loadLessonFromSupabase(
  gradeCode = "g67",
  monthIndex = 0,
  weekIndex = 0
): Promise<Lesson | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(
      "lesson_id, grade_code, month_index, week_index, title, content"
    )
    .eq("grade_code", gradeCode)
    .eq("month_index", monthIndex)
    .eq("week_index", weekIndex)
    .maybeSingle();

  if (error) {
    console.error(
      "Error cargando lesson desde Supabase:",
      error
    );

    return getLessonByIndex(
      gradeCode,
      monthIndex,
      weekIndex
    );
  }

  if (!data) {
    return null;
  }

  return normalizeLesson(data);
}

/* =========================================================
   EXPORTS
   ========================================================= */

export { GRADES };

export default GRADES;
