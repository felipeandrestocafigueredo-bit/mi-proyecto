"use client";

import type { Lesson } from "@/app/models/LessonModel";
import MonthLifeGame from "./MonthLifeGame";

export type MonthViewColors = {
  main: string;
  accent?: string;
  [key: string]: string | number | undefined;
};

interface MonthViewProps {
  monthName: string;
  mesIdx: number;
  lessons: Lesson[];
  colors: MonthViewColors;
  gradoActive: boolean;
  gradoLabel: string;
  gradeCode?: string;
  onOpenLesson: (index: number) => void;
  editMode?: boolean;
}

export default function MonthView({
  monthName,
  mesIdx,
  lessons = [],
  colors,
  gradoActive,
  gradoLabel,
  gradeCode = "g67",
  onOpenLesson,
  editMode = false,
}: MonthViewProps) {
  const safeColors: MonthViewColors = {
    ...colors,
    main: colors?.main || "#2563eb",
    accent: colors?.accent || "#7c3aed",
  };

  return (
    <div
      style={{
        marginTop: 28,
        borderRadius: 24,
        background: "#fff",
        border: "2px solid rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${safeColors.main}, ${safeColors.accent || safeColors.main})`,
          color: "#fff",
          padding: "22px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 38, marginBottom: 6 }}>📘</div>
        <h2
          style={{
            margin: 0,
            fontSize: 32,
            lineHeight: 1.2,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          {monthName}
        </h2>
        <div style={{ opacity: 0.95, fontSize: 14, marginTop: 6, textAlign: "center" }}>
          {gradoLabel} · {gradoActive ? "Contenido activo" : "Sin contenido"}
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {lessons.length === 0 ? (
          <div
            style={{
              padding: "18px 16px",
              borderRadius: 14,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#475569",
              textAlign: "center",
            }}
          >
            Este mes aún no tiene contenidos disponibles para este grado.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#334155",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: 6,
              }}
            >
              Lecciones del mes
            </div>

            {lessons.map((lesson, index) => (
              <button
                key={lesson.id || `${mesIdx}-${index}`}
                type="button"
                onClick={() => onOpenLesson(index)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "linear-gradient(135deg, #F8FAFC, #EEF2FF)",
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  padding: "14px 16px",
                  cursor: "pointer",
                  boxShadow: "0 8px 16px rgba(15, 23, 42, 0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>{lesson.tema || lesson.topic || `Lección ${index + 1}`}</div>
                  <div style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>{lesson.badge || "Tema"}</div>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                  {lesson.topic || "Vocabulario y práctica del mes"}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 0, marginTop: 0 }}>
        <MonthLifeGame mesIdx={mesIdx} gradeCode={gradeCode} colors={safeColors} />
      </div>
    </div>
  );
}

