import { createClient } from "@/app/lib/supabase/client";
import { getGameResults, type StudentGameResult } from "@/app/games/engine/playerProfile";

const TABLE_NAME = "student_game_results";

function normalizeRemoteResult(row: Record<string, unknown>): StudentGameResult | null {
  const gameId = String(row.game_id ?? row.gameId ?? "").trim();
  if (!gameId) return null;

  return {
    gameId,
    title: String(row.title ?? "Juego").trim(),
    studentName: String(row.student_name ?? row.studentName ?? "Estudiante").trim() || "Estudiante",
    avatar: String(row.avatar ?? "🐼"),
    score: Number(row.score ?? 0),
    percentage: Number(row.percentage ?? 0),
    accuracy: Number(row.accuracy ?? row.percentage ?? 0),
    attempts: Number(row.attempts ?? 1),
    savedAt: typeof row.saved_at === "string" ? row.saved_at : typeof row.savedAt === "string" ? row.savedAt : new Date().toISOString(),
    monthIndex: typeof row.month_index === "number" ? row.month_index : typeof row.monthIndex === "number" ? row.monthIndex : undefined,
    weekIndex: typeof row.week_index === "number" ? row.week_index : typeof row.weekIndex === "number" ? row.weekIndex : undefined,
    gradeCode: typeof row.grade_code === "string" ? row.grade_code : typeof row.gradeCode === "string" ? row.gradeCode : undefined,
  };
}

export async function syncStudentGameResultToSupabase(result: StudentGameResult): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (typeof window === "undefined") return { ok: false, skipped: true };

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const payload = {
    game_id: result.gameId,
    title: result.title,
    student_name: result.studentName,
    avatar: result.avatar,
    score: result.score,
    percentage: result.percentage,
    accuracy: result.accuracy,
    attempts: result.attempts,
    saved_at: result.savedAt || new Date().toISOString(),
    month_index: result.monthIndex ?? null,
    week_index: result.weekIndex ?? null,
    grade_code: result.gradeCode ?? null,
    student_user_id: result.student_user_id ?? userData?.user?.id ?? null,
  };

  const { error } = await supabase.from(TABLE_NAME).insert(payload);

  if (error) {
    const isMissingTable = error.code === "42P01" || error.message.toLowerCase().includes("does not exist");
    if (isMissingTable) {
      return { ok: false, skipped: true, error: "Supabase table not configured yet." };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function fetchStudentResultsFromSupabase(): Promise<StudentGameResult[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("saved_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? [])
    .map((row: Record<string, unknown>) => normalizeRemoteResult(row as Record<string, unknown>))
    .filter((row: unknown): row is StudentGameResult => Boolean(row));
}

export function mergeStudentResults(localResults: StudentGameResult[], remoteResults: StudentGameResult[]): StudentGameResult[] {
  const merged = new Map<string, StudentGameResult>();

  [...localResults, ...remoteResults].forEach((result) => {
    const key = `${result.gameId}-${result.studentName}-${result.savedAt ?? "unknown"}`;
    merged.set(key, result);
  });

  return Array.from(merged.values()).sort((a, b) => {
    const aTime = new Date(a.savedAt || 0).getTime();
    const bTime = new Date(b.savedAt || 0).getTime();
    return bTime - aTime;
  });
}

export async function getUnifiedGameResults(): Promise<StudentGameResult[]> {
  const localResults = getGameResults();

  if (typeof window === "undefined") {
    return localResults;
  }

  const remoteResults = await fetchStudentResultsFromSupabase();
  return mergeStudentResults(localResults, remoteResults);
}

export function buildCsvFromResults(results: StudentGameResult[]): string {
  const headers = [
    "studentName",
    "avatar",
    "gameId",
    "title",
    "score",
    "percentage",
    "accuracy",
    "attempts",
    "monthIndex",
    "weekIndex",
    "gradeCode",
    "savedAt",
  ];

  const rows = results.map((result) => [
    result.studentName,
    result.avatar,
    result.gameId,
    result.title,
    result.score,
    result.percentage,
    result.accuracy,
    result.attempts,
    result.monthIndex ?? "",
    result.weekIndex ?? "",
    result.gradeCode ?? "",
    result.savedAt ?? "",
  ]);

  const escapeValue = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

  return [
    headers.map(escapeValue).join(","),
    ...rows.map((row) => row.map((value) => escapeValue(value)).join(",")),
  ].join("\n");
}

export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  if (typeof document === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
