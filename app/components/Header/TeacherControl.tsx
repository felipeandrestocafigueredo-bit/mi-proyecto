"use client";

import { useMemo, useState, useEffect } from "react";
import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import academic from "@/app/academic/Index";
import MONTHS from "@/app/data/months";
import { summarizeLessonProgress } from "@/app/utils/lessonProgress";
import type { Lesson } from "@/app/models/LessonModel";
import { uploadWorksheet, uploadSlide, uploadResource, getPublicUrl, listFilesByWeek, addFileToLessonContent, removeFileFromLessonContent, deleteFile, findLessonByWeek, type StoredFile } from "@/app/services/storageService";
import { useAccessControl } from "@/app/providers/AccessControlProvider";
import { createClient } from "@/app/lib/supabase/client";
import { uploadAndPersistFile } from "@/app/actions/storageActions";
import { getGameResults, type StudentGameResult } from "@/app/games/engine/playerProfile";
import { buildCsvFromResults, downloadTextFile, fetchStudentResultsFromSupabase, mergeStudentResults } from "@/app/services/gameAnalyticsService";

const EXPORT_FILENAME = "informe-control-docente.json";
const EXPORT_CSV_FILENAME = "informe-control-docente.csv";

function formatGrade(grade: string): string {
  const labels: Record<string, string> = {
    g67: "G6-7",
    g8: "G8",
    g9: "G9",
    g1011: "G10-11",
  };
  return labels[grade] || grade;
}

function formatMonth(monthIndex: string | number): string {
    const idx = typeof monthIndex === "number" ? monthIndex : Number(monthIndex);
    return MONTHS[idx] || `Mes ${Number(monthIndex) + 1}`;
}

function getFileFolder(file: StoredFile): "worksheets" | "slides" | "resources" {
  if (file.path.includes("/slides/")) return "slides";
  if (file.path.includes("/resources/")) return "resources";
  return "worksheets";
}

function downloadJson(content: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

interface TeacherControlProps {
  onClose?: () => void;
  colors?: {
    dark?: string;
  };
  role?: string;
  currentLesson?: {
    grade_code?: string;
    month_index?: number;
    week_index?: number;
  } | null;
  onFileUploaded?: () => void;
}

export default function TeacherControl({ onClose, colors, role, currentLesson, onFileUploaded }: TeacherControlProps) {
  const {
    accessMode,
    editMode,
    toggleEditMode,
    teacherPanelOpen,
    setTeacherPanelOpen,
    minimized,
    setMinimized,
    exitTeacherMode,
    confirmTeacherAuth,
    cancelTeacherAuth,
  } = useAccessControl();

  const isTeacher = role === "teacher" || accessMode === "teacher";

  const isOpen = teacherPanelOpen && !minimized;

  const [gradeCode, setGradeCode] = useState("g67");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [gradeReview, setGradeReview] = useState<"digital" | "life" | "all">("digital");
  const [monthIndex, setMonthIndex] = useState(0);
  const [weekIndex, setWeekIndex] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<"worksheets" | "slides" | "resources">("worksheets");
  const [filesPanelOpen, setFilesPanelOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<StoredFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [liveResults, setLiveResults] = useState<StudentGameResult[]>(() => getGameResults());

  useEffect(() => {
    const syncResults = async () => {
      const remoteResults = await fetchStudentResultsFromSupabase();
      setLiveResults(mergeStudentResults(getGameResults(), remoteResults));
    };

    const handleResultsUpdated = () => {
      setLiveResults(mergeStudentResults(getGameResults(), []));
      void syncResults();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("student-results-updated", handleResultsUpdated);
      window.addEventListener("storage", handleResultsUpdated);
    }

    void syncResults();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("student-results-updated", handleResultsUpdated);
        window.removeEventListener("storage", handleResultsUpdated);
      }
    };
  }, []);

  useEffect(() => {
    if (currentLesson) {
      if (currentLesson.grade_code) setGradeCode(currentLesson.grade_code);
      if (typeof currentLesson.month_index === "number") setMonthIndex(currentLesson.month_index);
      if (typeof currentLesson.week_index === "number") setWeekIndex(currentLesson.week_index);
    }
  }, [currentLesson?.grade_code, currentLesson?.month_index, currentLesson?.week_index]);

  const report = useMemo(() => {
    const rows: Array<{
      grade: string;
      month: string;
      topic: string;
      date: string;
      badge: string;
      totalGames: number;
      completedGames: number;
      progress: number;
      xp: number;
      bestScore: number;
    }> = [];
    let totalGames = 0;
    let totalCompleted = 0;
    let totalXP = 0;
    let totalScore = 0;

    const academicData = academic as Record<string, unknown>;

    Object.entries(academicData).forEach(([grade, months]) => {
      const monthsRecord = months as Record<string, unknown[]>;
      Object.entries(monthsRecord).forEach(([monthIndex, lessons]) => {
        lessons.forEach((lesson) => {
          const lessonRecord = lesson as Record<string, unknown>;
          const lessonProgress = summarizeLessonProgress(lesson as unknown as Lesson);
          const lessonRow = {
            grade: formatGrade(grade),
            month: formatMonth(monthIndex),
            topic: (lessonRecord.topic as string) || "Week",
            date: (lessonRecord.fecha as string) || "N/A",
            badge: (lessonRecord.badge as string) || "-",
            totalGames: lessonProgress.totalGames,
            completedGames: lessonProgress.completedGames,
            progress: lessonProgress.progress,
            xp: lessonProgress.totalXP,
            bestScore: lessonProgress.maxScore,
          };

          rows.push(lessonRow);
          totalGames += lessonProgress.totalGames;
          totalCompleted += lessonProgress.completedGames;
          totalXP += lessonProgress.totalXP;
          totalScore += lessonProgress.maxScore;
        });
      });
    });

    const averageCompletion = totalGames ? Math.round((totalCompleted / totalGames) * 100) : 0;

    return {
      generatedAt: new Date().toISOString(),
      totals: {
        lessons: rows.length,
        totalGames,
        completedGames: totalCompleted,
        averageCompletion,
        totalXP,
        totalScore,
      },
      rows,
    };
  }, []);

  const gameAnalytics = useMemo(() => {
    const results = gradeFilter === "all"
      ? liveResults
      : liveResults.filter((entry) => entry.gradeCode === gradeFilter);
    const participants = new Set(results.map((entry) => `${entry.studentName}-${entry.avatar}`)).size;
    const failed = results.filter((entry) => Number(entry.percentage) < 60).length;
    const favoriteMap = new Map<string, number>();

    results.forEach((entry) => {
      const key = entry.title || "Sin nombre";
      favoriteMap.set(key, (favoriteMap.get(key) || 0) + 1);
    });

    const favoriteGameEntry = [...favoriteMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const averageScore = results.length
      ? Math.round(results.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / results.length)
      : 0;

    const monthlyParticipation = MONTHS.map((label, index) => {
      const monthResults = results.filter((entry) => Number(entry.monthIndex) === index);
      const average = monthResults.length
        ? Math.round(monthResults.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / monthResults.length)
        : 0;
      const failedInMonth = monthResults.filter((entry) => Number(entry.percentage) < 60).length;

      return {
        label,
        participants: monthResults.length,
        failed: failedInMonth,
        average,
      };
    }).filter((entry) => entry.participants > 0);

    return {
      participants,
      failed,
      favoriteGame: favoriteGameEntry ? favoriteGameEntry[0] : "Sin resultados",
      favoriteCount: favoriteGameEntry ? favoriteGameEntry[1] : 0,
      averageScore,
      monthlyParticipation,
    };
  }, [gradeFilter, liveResults]);

  const filteredRows = useMemo(() => {
    if (gradeFilter === "all") return report.rows;
    return report.rows.filter((row) => row.grade.toLowerCase() === formatGrade(gradeFilter).toLowerCase());
  }, [gradeFilter, report.rows]);

  const filteredReportTotals = useMemo(() => {
    const totalGames = filteredRows.reduce((sum, row) => sum + row.totalGames, 0);
    const completedGames = filteredRows.reduce((sum, row) => sum + row.completedGames, 0);
    return {
      lessons: filteredRows.length,
      totalGames,
      completedGames,
      averageCompletion: totalGames ? Math.round((completedGames / totalGames) * 100) : 0,
      totalXP: filteredRows.reduce((sum, row) => sum + row.xp, 0),
    };
  }, [filteredRows]);

  const monthlySeries = useMemo(() => {
    const totals = new Map<string, { total: number; count: number; score: number }>();

    filteredRows.forEach((row) => {
      const current = totals.get(row.month) || { total: 0, count: 0, score: 0 };
      current.total += row.progress;
      current.count += 1;
      current.score += row.bestScore;
      totals.set(row.month, current);
    });

    const results = gradeFilter === "all"
      ? liveResults
      : liveResults.filter((entry) => entry.gradeCode === gradeFilter);

    results.forEach((entry) => {
      const monthLabel = typeof entry.monthIndex === "number" ? MONTHS[entry.monthIndex] || `Mes ${entry.monthIndex + 1}` : "Sin mes";
      const current = totals.get(monthLabel) || { total: 0, count: 0, score: 0 };
      current.total += Number(entry.percentage) || 0;
      current.count += 1;
      current.score += Number(entry.score) || 0;
      totals.set(monthLabel, current);
    });

    return Array.from(totals.entries())
      .map(([label, value]) => ({
        label,
        value: value.count ? Math.round(value.total / value.count) : 0,
        score: value.score,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredRows, gradeFilter, liveResults]);

  const lifeGameResults = useMemo(
    () =>
      liveResults.filter((entry) => {
        if (gradeFilter !== "all" && entry.gradeCode !== gradeFilter) return false;
        const gameId = String(entry.gameId || "");
        return gameId.startsWith("monthly-life-game-") || gameId.startsWith("monthly-life-game") || gameId.includes("life-game");
      }),
    [gradeFilter, liveResults],
  );

  const lifeGameMonthlySeries = useMemo(() => {
    const totals = new Map<string, { total: number; count: number; passed: number }>();

    lifeGameResults.forEach((entry) => {
      const monthIndexValue = typeof entry.monthIndex === "number" ? entry.monthIndex : 0;
      const monthLabel = MONTHS[monthIndexValue] || `Mes ${monthIndexValue + 1}`;
      const current = totals.get(monthLabel) || { total: 0, count: 0, passed: 0 };
      const percentage = Number(entry.percentage) || 0;
      current.total += percentage;
      current.count += 1;
      if (percentage >= 60) current.passed += 1;
      totals.set(monthLabel, current);
    });

    return Array.from(totals.entries())
      .map(([label, value]) => ({
        label,
        average: value.count ? Math.round(value.total / value.count) : 0,
        passed: value.passed,
        participants: value.count,
      }))
      .sort((a, b) => MONTHS.indexOf(a.label) - MONTHS.indexOf(b.label));
  }, [lifeGameResults]);

  const lifeStudentSummaries = useMemo(() => {
    const map = new Map<string, { studentName: string; avatar: string; percentage: number; monthLabel: string; attempts: number }>();

    lifeGameResults.forEach((entry) => {
      const studentKey = `${entry.studentName || "Estudiante"}-${entry.avatar || "🐼"}`;
      const current = map.get(studentKey);
      const currentPercentage = Number(entry.percentage) || 0;
      const monthLabel = typeof entry.monthIndex === "number" ? MONTHS[entry.monthIndex] || `Mes ${entry.monthIndex + 1}` : "Sin mes";

      if (!current || currentPercentage > current.percentage) {
        map.set(studentKey, {
          studentName: entry.studentName || "Estudiante",
          avatar: entry.avatar || "🐼",
          percentage: currentPercentage,
          monthLabel,
          attempts: Number(entry.attempts) || 1,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.percentage - a.percentage);
  }, [lifeGameResults]);

  const [uploadedFiles, setUploadedFiles] = useState<StoredFile[]>([]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const showLoginStep = teacherPanelOpen && accessMode !== "teacher";

  const loadUploadedFiles = async () => {
    try {
      const files = await listFilesByWeek(gradeCode, monthIndex, weekIndex);
      const allFiles: StoredFile[] = [
        ...files.worksheets.map((f) => ({ ...f, type: f.type || "worksheets" })),
        ...files.slides.map((f) => ({ ...f, type: f.type || "slides" })),
        ...files.resources.map((f) => ({ ...f, type: f.type || "resources" })),
      ];
      setUploadedFiles(allFiles);
    } catch (error) {
      setUploadedFiles([]);
      setMessage(error instanceof Error ? error.message : "No se pudieron cargar los archivos.");
    }
  };

  useEffect(() => {
    if (!isOpen || !filesPanelOpen) return;

    const controller = new AbortController();

    const fetchFiles = async () => {
      try {
        const files = await listFilesByWeek(gradeCode, monthIndex, weekIndex);
        if (controller.signal.aborted) return;
        const allFiles: StoredFile[] = [
          ...files.worksheets.map((f) => ({ ...f, type: f.type || "worksheets" })),
          ...files.slides.map((f) => ({ ...f, type: f.type || "slides" })),
          ...files.resources.map((f) => ({ ...f, type: f.type || "resources" })),
        ];
        setUploadedFiles(allFiles);
      } catch (error) {
        if (!controller.signal.aborted) {
          setMessage(error instanceof Error ? error.message : "No se pudieron cargar los archivos.");
        }
      }
    };

    void fetchFiles();

    return () => controller.abort();
  }, [isOpen, filesPanelOpen, gradeCode, monthIndex, weekIndex]);

  if (!isOpen && !minimized) return null;

  function handleExport(): void {
    downloadJson(report, EXPORT_FILENAME);
  }

  function handleExportCsv(): void {
    downloadTextFile(EXPORT_CSV_FILENAME, buildCsvFromResults(liveResults), "text/csv;charset=utf-8;");
  }

  function handleClose() {
    setTeacherPanelOpen(false);
    setMinimized(false);
    onClose?.();
  }

  function handleExitTeacherMode() {
    setTeacherPanelOpen(false);
    setMinimized(false);
    exitTeacherMode();
  }

  async function handleSupabaseLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error || !data.session) {
        setLoginError(error?.message || "Error al iniciar sesión.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      if (profileError) {
        console.error("Error loading profile:", profileError);
      }

      if (profile?.role !== "teacher") {
        setLoginError("Esta cuenta no tiene permisos de docente.");
        await supabase.auth.signOut();
        return;
      }

      confirmTeacherAuth();
      setLoginEmail("");
      setLoginPassword("");
    } catch {
      setLoginError("Error inesperado. Intenta nuevamente.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleCancelLogin() {
    setLoginEmail("");
    setLoginPassword("");
    setLoginError(null);
    cancelTeacherAuth();
  }

  function handleToggleEditMode() {
    toggleEditMode();
  }

  function handleMinimize() {
    setMinimized(true);
    setTeacherPanelOpen(false);
  }

  function handleReopen() {
    setMinimized(false);
    setTeacherPanelOpen(true);
  }

  async function handleUpload() {
    if (!file) {
      setMessage("Selecciona un archivo antes de subirlo.");
      return;
    }
    setUploading(true);
    setMessage(null);

    try {
      // No llamamos findLessonByWeek desde el cliente (puede fallar por DNS).
      // El server action resuelve el lesson_id internamente con service_role.
      const persisted = await uploadAndPersistFile(
        null,
        gradeCode,
        monthIndex,
        weekIndex,
        kind,
        file,
      );
      if (persisted.error || !persisted.data) {
        setMessage(persisted.error ?? "No se pudo guardar en la lección.");
        return;
      }
      const resolvedLessonId = persisted.lessonId;
      if (editingFile && resolvedLessonId) {
        const oldLesson = await removeFileFromLessonContent(resolvedLessonId, getFileFolder(editingFile), editingFile.path);
        if (!oldLesson) {
          setMessage("El archivo nuevo se guardó, pero no se pudo retirar el archivo anterior.");
          return;
        }
        await deleteFile(editingFile.path);
      }
      setMessage("Archivo subido y guardado correctamente.");
      onFileUploaded?.();

      await loadUploadedFiles();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error inesperado al guardar el archivo.";
      setMessage(detail);
    } finally {
      setUploading(false);
      setFile(null);
      setEditingFile(null);
    }
  }

  async function handleDeleteFile(storedFile: StoredFile) {
    if (!window.confirm(`¿Eliminar "${storedFile.name}"? Esta acción no se puede deshacer.`)) return;

    try {
      const lesson = await findLessonByWeek(gradeCode, monthIndex, weekIndex);
      const folder = getFileFolder(storedFile);
      const lessonUpdated = lesson?.lesson_id
        ? await removeFileFromLessonContent(lesson.lesson_id, folder, storedFile.path)
        : null;

      if (lesson?.lesson_id && !lessonUpdated) {
        setMessage("No se pudo actualizar el registro de la lección.");
        return;
      }

      if (!(await deleteFile(storedFile.path))) {
        setMessage("No se pudo eliminar el archivo del almacenamiento.");
        return;
      }

      setMessage("Archivo eliminado correctamente.");
      await loadUploadedFiles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado al eliminar el archivo.");
    }
  }

  if (minimized) {
    return (
      <button
        type="button"
        onClick={handleReopen}
        title="Reabrir Control Docente"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 5000,
          border: "none",
          borderRadius: 999,
          padding: "14px 20px",
          background: "linear-gradient(135deg, #2563EB, #1E448E)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(37,99,235,.35)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>🔐</span>
        <span>Control Docente</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (showLoginStep) {
            handleCancelLogin();
          } else {
            handleClose();
          }
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(18, 28, 45, 0.56)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1080px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 28,
          background: "#F8FAFC",
          border: `2px solid ${colors?.dark || "#243B53"}`,
          boxShadow: "0 30px 80px rgba(15,23,42,.25)",
          padding: 24,
        }}
      >
        {showLoginStep ? (
          <TeacherLoginForm
            email={loginEmail}
            password={loginPassword}
            error={loginError}
            loading={loginLoading}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleSupabaseLogin}
            onCancel={handleCancelLogin}
          />
        ) : (
          <React.Fragment>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#102A43",
                  }}
                >
                  🔐 Control Docente
                </div>
                <div style={{ color: "#475569", marginTop: 6, lineHeight: 1.6 }}>
                  Revisa el desempeño semanal de todos los juegos, los resultados de cada semana y descarga un informe de estadísticas.
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Button
                  onClick={handleMinimize}
                  type="secondary"
                >
                  ➖ Minimizar
                </Button>
                <Button
                  onClick={handleToggleEditMode}
                  type={editMode ? "primary" : "secondary"}
                >
                  {editMode ? "✏️ Edición ON" : "✏️ Activar edición"}
                </Button>
                <Button onClick={handleExport} type="success">
                  📄 JSON
                </Button>
                <Button onClick={handleExportCsv} type="secondary">
                  📊 CSV
                </Button>
                <Button onClick={handleExitTeacherMode} type="danger">
                  Cerrar
                </Button>
              </div>
            </div>

            {!minimized && (
              <React.Fragment>
                <div style={{ marginBottom: 24, padding: 18, borderRadius: 22, background: "linear-gradient(135deg, #EFF6FF, #F8FAFC)", border: "1px solid #DBEAFE" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#102A43" }}>Centro de análisis</div>
                      <div style={{ marginTop: 4, fontSize: 12, color: "#64748B" }}>Selecciona un grado y después el tipo de resultados que quieres revisar.</div>
                    </div>
                    <span style={{ padding: "7px 11px", borderRadius: 999, background: "#FFFFFF", color: "#1D4ED8", fontSize: 12, fontWeight: 800 }}>
                      {gradeFilter === "all" ? "Todos los grados" : formatGrade(gradeFilter)}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 10 }}>
                    {[
                      { label: "6.º - 7.º", value: "g67", icon: "🎒" },
                      { label: "8.º", value: "g8", icon: "📘" },
                      { label: "9.º", value: "g9", icon: "🚀" },
                      { label: "10.º - 11.º", value: "g1011", icon: "🎓" },
                    ].map((filter) => (
                      <div key={filter.value} style={{ padding: 10, borderRadius: 16, background: gradeFilter === filter.value ? "#FFFFFF" : "rgba(255,255,255,.55)", border: gradeFilter === filter.value ? "2px solid #60A5FA" : "1px solid transparent" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setGradeFilter(filter.value);
                            setGradeReview("digital");
                          }}
                          style={{ width: "100%", border: "none", background: "transparent", color: "#102A43", textAlign: "left", cursor: "pointer", fontWeight: 900, fontSize: 14, padding: "4px 2px 9px" }}
                        >
                          {filter.icon} {filter.label}
                        </button>
                        {gradeFilter === filter.value && (
                          <div style={{ display: "grid", gap: 6 }}>
                            {[
                              { label: "Resultados de juegos", value: "digital", icon: "🎮" },
                              { label: "Juego de vidas", value: "life", icon: "❤️" },
                              { label: "Todas las tablas", value: "all", icon: "📋" },
                            ].map((review) => (
                              <button
                                key={review.value}
                                type="button"
                                onClick={() => {
                                  const value = review.value as "digital" | "life" | "all";
                                  setGradeReview(value);
                                }}
                                style={{ border: "none", borderRadius: 10, padding: "8px 10px", textAlign: "left", cursor: "pointer", fontSize: 12, fontWeight: 800, background: gradeReview === review.value ? "#DBEAFE" : "#F8FAFC", color: gradeReview === review.value ? "#1D4ED8" : "#475569" }}
                              >
                                {review.icon} {review.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGradeFilter("all");
                      setGradeReview("all");
                    }}
                    style={{ marginTop: 12, border: "none", background: "transparent", color: "#475569", textDecoration: "underline", cursor: "pointer", fontSize: 12, fontWeight: 800 }}
                  >
                    Ver todos los grados
                  </button>
                </div>

                {gradeReview === "digital" || gradeReview === "all" ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                        gap: 16,
                        marginBottom: 26,
                      }}
                    >
                      <Card title="Lecciones totales">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{filteredReportTotals.lessons}</div>
                      </Card>
                      <Card title="Juegos totales">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{filteredReportTotals.totalGames}</div>
                      </Card>
                      <Card title="Juegos completados">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{filteredReportTotals.completedGames}</div>
                      </Card>
                      <Card title="Avance promedio">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{filteredReportTotals.averageCompletion}%</div>
                      </Card>
                      <Card title="XP acumulada">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{filteredReportTotals.totalXP}</div>
                      </Card>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 26 }}>
                      <Card title="Participantes">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{gameAnalytics.participants}</div>
                      </Card>
                      <Card title="Fallaron">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{gameAnalytics.failed}</div>
                      </Card>
                      <Card title="Juego favorito">
                        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>{gameAnalytics.favoriteGame}</div>
                      </Card>
                      <Card title="Acierto promedio">
                        <div style={{ fontSize: 32, fontWeight: 800 }}>{gameAnalytics.averageScore}%</div>
                      </Card>
                    </div>
                  </>
                ) : null}

                {gradeReview === "life" || gradeReview === "all" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 26 }}>
                    <Card title="Evaluaciones registradas">
                      <div style={{ fontSize: 32, fontWeight: 800 }}>{lifeGameResults.length}</div>
                    </Card>
                    <Card title="Promedio general">
                      <div style={{ fontSize: 32, fontWeight: 800 }}>{lifeGameResults.length ? Math.round(lifeGameResults.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / lifeGameResults.length) : 0}%</div>
                    </Card>
                    <Card title="Aprobados">
                      <div style={{ fontSize: 32, fontWeight: 800 }}>{lifeGameResults.filter((entry) => Number(entry.percentage) >= 60).length}</div>
                    </Card>
                    <Card title="Mes con mejor resultado">
                      <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{lifeGameMonthlySeries.length ? lifeGameMonthlySeries.reduce((best, current) => current.average > best.average ? current : best, lifeGameMonthlySeries[0]).label : "Sin resultados"}</div>
                    </Card>
                  </div>
                ) : null}

                {(gradeReview === "life" ? lifeGameMonthlySeries : monthlySeries).length > 0 && (
                  <div style={{ marginBottom: 26, padding: 20, borderRadius: 22, background: "linear-gradient(135deg,#E0F2FE,#F8FAFC)", border: "1px solid rgba(59,130,246,.18)" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 16, textAlign: "center" }}>
                      {gradeReview === "life" ? "📊 Resultados del Juego de vidas por mes" : "📈 Rendimiento por mes"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, alignItems: "end" }}>
                      {(gradeReview === "life" ? lifeGameMonthlySeries : monthlySeries).map((item) => (
                        <div key={item.label} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
                          <div style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>{item.label}</div>
                          <div style={{ width: "100%", height: 120, display: "flex", alignItems: "end", justifyContent: "center", background: "rgba(255,255,255,.35)", borderRadius: 14, padding: 8 }}>
                            <div style={{ width: "100%", maxWidth: 52, height: `${Math.max(10, ("value" in item ? item.value : item.average))}%`, minHeight: 10, borderRadius: 12, background: "linear-gradient(180deg, #3B82F6, #1D4ED8)", boxShadow: "0 10px 18px rgba(59,130,246,.25)" }} />
                          </div>
                          <div style={{ fontSize: 12, color: "#0F172A", fontWeight: 800 }}>{"value" in item ? `${item.value}%` : `${item.average}%`}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(gradeReview === "life" || gradeReview === "all") && lifeStudentSummaries.length > 0 && (
                  <div style={{ marginBottom: 26, padding: 18, borderRadius: 20, border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 14, textAlign: "center" }}>Estudiantes del Juego de vidas</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {lifeStudentSummaries.map((student) => (
                        <div key={`${student.studentName}-${student.avatar}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", background: "#E0F2FE", fontSize: 20 }}>{student.avatar}</div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 800, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.studentName}</div>
                              <div style={{ fontSize: 12, color: "#475569" }}>{student.monthLabel}</div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 900, color: student.percentage >= 60 ? "#15803D" : "#B45309", fontSize: 18 }}>{student.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

        {isTeacher && (
          <div style={{ marginBottom: 18 }}>
            <Button
              type={filesPanelOpen ? "primary" : "secondary"}
              onClick={() => {
                setFilesPanelOpen((open) => !open);
                setMessage(null);
              }}
              style={{ width: "100%", justifyContent: "space-between", padding: "14px 18px" }}
            >
              <span>{filesPanelOpen ? "▴ Ocultar gestión de archivos" : "📁 Subir y gestionar archivos"}</span>
              <span style={{ fontSize: 12, opacity: 0.75 }}>{filesPanelOpen ? "Cerrar" : "Abrir panel"}</span>
            </Button>
          </div>
        )}

        {isTeacher && filesPanelOpen && (
          <div
            style={{
              display: "grid",
              gap: 14,
              padding: 18,
              borderRadius: 20,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              marginBottom: 26,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: "#102A43", fontSize: 16 }}>
                {editingFile ? "Reemplazar archivo" : "Subir archivo a la semana"}
              </div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
                Los archivos quedan registrados por grado, mes y semana.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                gap: 10,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 4,
                  }}
                >
                  Grado
                </label>
                <select
                  value={gradeCode}
                  onChange={(e) => setGradeCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 14,
                    border: "1px solid #CBD5E1",
                    fontSize: 13,
                  }}
                >
                  <option value="g67">G6-7</option>
                  <option value="g8">G8</option>
                  <option value="g9">G9</option>
                  <option value="g1011">G10-11</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 4,
                  }}
                >
                  Mes
                </label>
                <select
                  value={monthIndex}
                  onChange={(e) => setMonthIndex(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 14,
                    border: "1px solid #CBD5E1",
                    fontSize: 13,
                  }}
                >
                  {MONTHS.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 4,
                  }}
                >
                  Semana
                </label>
                <input
                  type="number"
                  min={1}
                  value={weekIndex}
                  onChange={(e) => {
                    const nextWeek = Number(e.target.value);
                    setWeekIndex(Number.isFinite(nextWeek) ? Math.min(4, Math.max(1, nextWeek)) : 1);
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 14,
                    border: "1px solid #CBD5E1",
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 4,
                  }}
                >
                  Tipo
                </label>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as "worksheets" | "slides" | "resources")}
                  style={{
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 14,
                    border: "1px solid #CBD5E1",
                    fontSize: 13,
                  }}
                >
                  <option value="worksheets">Worksheets</option>
                  <option value="slides">Slides</option>
                  <option value="resources">Resources</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={uploading}
                style={{ fontSize: 13 }}
              />
              <Button
                type="success"
                disabled={!file || uploading}
                onClick={handleUpload}
              >
                {uploading ? "Guardando..." : editingFile ? "Reemplazar" : "Subir archivo"}
              </Button>
              {uploading && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    fontWeight: 700,
                  }}
                >
                  Subiendo archivo, por favor espera...
                </div>
              )}
              {editingFile && (
                <Button
                  type="ghost"
                  disabled={uploading}
                  onClick={() => {
                    setEditingFile(null);
                    setFile(null);
                    setMessage(null);
                  }}
                >
                  Cancelar edición
                </Button>
              )}
            </div>

            {message && (
              <div
                style={{
                  padding: 10,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  background: message.includes("correctamente") ? "#DCFCE7" : "#FEE2E2",
                  color: message.includes("correctamente") ? "#166534" : "#991B1B",
                  border: "1px solid " + (message.includes("correctamente") ? "#86EFAC" : "#FECACA"),
                }}
              >
                {message}
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                  Archivos registrados en esta semana ({uploadedFiles.length})
                </div>
                <button
                  type="button"
                  onClick={() => void loadUploadedFiles()}
                  style={{ border: "none", background: "transparent", color: "#2563EB", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                >
                  Actualizar
                </button>
              </div>
              {uploadedFiles.length === 0 ? (
                <div style={{ padding: 16, borderRadius: 14, background: "#F8FAFC", border: "1px dashed #CBD5E1", color: "#64748B", fontSize: 12 }}>
                  No hay archivos registrados para este grado, mes y semana.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 6 }}>
                  {uploadedFiles.map((f, idx) => (
                    <div
                      key={f.path || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        borderRadius: 8,
                        background: "#F1F5F9",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700 }}>{f.name.replace(/^\d+-/, "")}</span>
                        <span style={{ display: "block", color: "#94A3B8", fontSize: 11 }}>{getFileFolder(f)}{f.size ? ` · ${Math.round(f.size / 1024)} KB` : ""}</span>
                      </span>
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}
                      >
                        Ver
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFile(f);
                          setKind(getFileFolder(f));
                          setMessage("Selecciona el nuevo archivo y pulsa Reemplazar.");
                        }}
                        style={{ border: "none", background: "transparent", color: "#2563EB", cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteFile(f)}
                        style={{ border: "none", background: "transparent", color: "#DC2626", cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

                {gradeReview === "all" && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB" }} />
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#102A43" }}>Tabla de resultados de juegos</div>
                    </div>
                    {filteredRows.length === 0 ? (
                      <EmptyState text="No hay resultados de juegos registrados aún para este filtro." />
                    ) : (
                      <div style={{ display: "grid", gap: 16 }}>
                    {filteredRows.map((row, index) => (
                      <div
                        key={`${row.grade}-${row.month}-${row.topic}-${index}`}
                        style={{
                          display: "grid",
                          gap: 14,
                          padding: 18,
                          borderRadius: 20,
                          border: "1px solid #E2E8F0",
                          background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                          boxShadow: "0 12px 28px rgba(15,23,42,.04)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{row.topic}</div>
                            <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{row.date}</div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ padding: "6px 10px", borderRadius: 999, background: "#DBEAFE", color: "#1D4ED8", fontSize: 12, fontWeight: 800 }}>{row.grade}</span>
                            <span style={{ padding: "6px 10px", borderRadius: 999, background: "#F1F5F9", color: "#334155", fontSize: 12, fontWeight: 800 }}>{row.month}</span>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
                          <div style={{ padding: 12, borderRadius: 14, background: "#EFF6FF" }}>
                            <div style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>Progreso</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#1D4ED8", marginTop: 8 }}>{row.progress}%</div>
                          </div>
                          <div style={{ padding: 12, borderRadius: 14, background: "#F0FDF4" }}>
                            <div style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>Juegos</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#15803D", marginTop: 8 }}>{row.completedGames} / {row.totalGames}</div>
                          </div>
                          <div style={{ padding: 12, borderRadius: 14, background: "#FEF3C7" }}>
                            <div style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>XP</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#A16207", marginTop: 8 }}>{row.xp}</div>
                          </div>
                          <div style={{ padding: 12, borderRadius: 14, background: "#FDF2F8" }}>
                            <div style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>Puntaje</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#BE185D", marginTop: 8 }}>{row.bestScore}</div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#475569", fontWeight: 700 }}>
                            <span>Avance</span>
                            <span>{row.progress}%</span>
                          </div>
                          <div style={{ height: 12, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                            <div style={{ width: `${row.progress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #22C55E, #3B82F6)" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

interface TeacherLoginFormProps {
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function TeacherLoginForm({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onCancel,
}: TeacherLoginFormProps) {
  return (
    <div
      style={{
        maxWidth: 460,
        margin: "0 auto",
        padding: "20px 0",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#102A43",
          marginBottom: 6,
        }}
      >
        Acceso Docente
      </div>

      <div
        style={{
          color: "#475569",
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 28,
          maxWidth: 360,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Ingresa tus credenciales de Supabase para continuar.
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, textAlign: "left" }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              marginBottom: 6,
            }}
          >
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="docente@institucion.edu"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid #CBD5E1",
              fontSize: 15,
              outline: "none",
              transition: "border-color .2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#CBD5E1";
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              marginBottom: 6,
            }}
          >
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="            password={loginPassword}••"            required
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid #CBD5E1",
              fontSize: 15,
              outline: "none",
              transition: "border-color .2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#CBD5E1";
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "#FEE2E2",
              color: "#991B1B",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <Button
            type="secondary"
            onClick={onCancel}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            disabled={loading}
            loading={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
