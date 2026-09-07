import { createClient } from "@/app/lib/supabase/client";

export interface StudentProfile {
  name: string;
  avatar: string;
}

export interface StudentGameResult {
  gameId: string;
  title: string;
  studentName: string;
  avatar: string;
  score: number;
  percentage: number;
  accuracy: number;
  attempts: number;
  savedAt?: string;
  monthIndex?: number;
  weekIndex?: number;
  gradeCode?: string;
  student_user_id?: string;
}

const PROFILE_KEY = "student-profile-v1";
const RESULTS_KEY = "student-game-results-v1";
const RESULTS_UPDATED_EVENT = "student-results-updated";

export const AVATAR_OPTIONS = ["🐼", "🦊", "🐻", "🦁", "🐰", "🐵", "🤖", "🦄", "🌟", "🎧"];

export function notifyStudentResultsUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(RESULTS_UPDATED_EVENT));
}

export function getStudentProfile(): StudentProfile {
  if (typeof window === "undefined") {
    return { name: "Estudiante", avatar: "🐼" };
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return { name: "Estudiante", avatar: "🐼" };
    }

    const parsed = JSON.parse(raw) as Partial<StudentProfile>;
    return {
      name: (parsed.name || "Estudiante").trim() || "Estudiante",
      avatar: parsed.avatar || "🐼",
    };
  } catch {
    return { name: "Estudiante", avatar: "🐼" };
  }
}

export function saveStudentProfile(profile: Partial<StudentProfile>): StudentProfile {
  const nextProfile = {
    name: String(profile.name || "Estudiante").trim() || "Estudiante",
    avatar: profile.avatar || "🐼",
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
  }

  return nextProfile;
}

export function getGameResults(): StudentGameResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGameResult(result: StudentGameResult): StudentGameResult {
  const nextResult: StudentGameResult = {
    ...result,
    studentName: String(result.studentName || "Estudiante").trim() || "Estudiante",
    avatar: result.avatar || "🐼",
    score: Number(result.score) || 0,
    percentage: Number(result.percentage) || 0,
    accuracy: Number(result.accuracy) || 0,
    attempts: Number(result.attempts) || 0,
    savedAt: result.savedAt || new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const current = getGameResults();
    const nextList = [nextResult, ...current.filter((entry) => !(entry.gameId === nextResult.gameId && entry.studentName === nextResult.studentName && entry.savedAt === nextResult.savedAt))];
    window.localStorage.setItem(RESULTS_KEY, JSON.stringify(nextList));
    notifyStudentResultsUpdated();
  }

  return nextResult;
}

export async function saveStudentResultToSupabase(result: StudentGameResult): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (typeof window === "undefined") {
    return { ok: false, skipped: true };
  }

  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    return { ok: false, skipped: true, error: "Usuario no autenticado" };
  }

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
    student_user_id: result.student_user_id ?? userData.user.id,
  };

  const { error } = await supabase.from("student_game_results").insert(payload);

  if (error) {
    const isMissingTable = error.code === "42P01" || error.message.toLowerCase().includes("does not exist");
    if (isMissingTable) {
      return { ok: false, skipped: true, error: "Supabase table not configured yet." };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export function getPodiumEntries(): Array<{ name: string; avatar: string; score: number; percentage: number; gameId: string; title: string }> {
  return getGameResults()
    .slice()
    .sort((a, b) => (b.score + b.percentage * 10) - (a.score + a.percentage * 10))
    .slice(0, 3)
    .map((entry) => ({
      name: entry.studentName,
      avatar: entry.avatar,
      score: entry.score,
      percentage: entry.percentage,
      gameId: entry.gameId,
      title: entry.title,
    }));
}
