"use client";

import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import GradoBar from "./components/GradoBar/GradoBar";
import MonthView from "./components/MonthView/MonthView";
import Footer from "./components/Footer/Footer";
import TeacherControl from "./components/Header/TeacherControl";
import AccessCodeEntry from "./components/Auth/AccessCodeEntry";
import { useSession } from "@/app/providers/SessionProvider";
import { useAccessControl } from "@/app/providers/AccessControlProvider";

import {
  getGrade,
  loadGradeFromSupabase,
} from "@/app/academic/Index";

import type { Lesson } from "@/app/models/LessonModel";
import { getPeriodColors } from "@/app/styles/theme";
import MONTHS from "@/app/data/months";
import MonthBar from "./components/MonthBar/MonthBar";
import WeekView from "./components/WeekView/WeekView";

type MonthMap = Record<string, Lesson[]>;

export default function Home() {
  const { user } = useSession();
  const { accessMode, editMode } = useAccessControl();
  const [grado, setGrado] = useState("g67");
  const [mesIdx, setMesIdx] = useState(0);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [months, setMonths] = useState<MonthMap>(() => getGrade("g67"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadGrade() {
      setLoading(true);

      try {
        const data = await loadGradeFromSupabase(grado);

        if (!cancelled) {
          setMonths(data);
        }
      } catch (error) {
        console.error("Error cargando grado:", error);

        if (!cancelled) {
          setMonths(getGrade(grado));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGrade();

    return () => {
      cancelled = true;
    };
  }, [grado, reloadKey]);

  /*
   * =========================================================
   * DATOS DEL MES ACTUAL
   * =========================================================
   */

  const monthLessons = months[String(mesIdx)] || [];

  const lessons: Lesson[] = monthLessons;

  const periodColors = getPeriodColors(mesIdx);

  const activeMonths = MONTHS.map((_, idx) =>
    Boolean(months[String(idx)]?.length)
  );

  /*
   * =========================================================
   * NAVEGACIÃ“N
   * =========================================================
   */

  function handleOpenLesson(next: number) {
    setSelectedWeekIdx(next);
  }

  function handleToggleWeek() {
    setSelectedWeekIdx(null);
  }

  function handleChangeMonth(next: number) {
    setSelectedWeekIdx(null);
    setMesIdx(next);
  }

  const currentLesson: Lesson | undefined =
    selectedWeekIdx !== null ? lessons[selectedWeekIdx] : undefined;

  function handleFileUploaded() {
    setReloadKey((k) => k + 1);
  }

  /*
   * =========================================================
   * ACCESO BLOQUEADO â€” Mostrar pantalla de cÃ³digo
   * =========================================================
   */

  if (accessMode === "locked") {
    return <AccessCodeEntry />;
  }

  /*
   * =========================================================
   * PLATAFORMA â€” visitor o teacher
   * =========================================================
   */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      <Header
        colors={periodColors}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px 40px",
        }}
      >
        <GradoBar
          grado={grado}
          setGrado={setGrado}
        />

        <MonthBar
          mesIdx={mesIdx}
          setMesIdx={handleChangeMonth}
          activeMonths={activeMonths}
          colors={periodColors}
        />

        {loading ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Cargando contenido acadÃ©mico...
          </div>
        ) : selectedWeekIdx !== null ? (
          <WeekView
            lesson={lessons[selectedWeekIdx]}
            colors={periodColors}
            onBack={handleToggleWeek}
            editMode={editMode}
          />
        ) : (
          <MonthView
            monthName={MONTHS[mesIdx]}
            mesIdx={mesIdx}
            lessons={lessons}
            colors={periodColors}
            gradoActive={Boolean(months[String(mesIdx)]?.length)}
            gradoLabel={grado.toUpperCase()}
            gradeCode={grado}
            onOpenLesson={handleOpenLesson}
            editMode={editMode}
          />
        )}
      </div>

      <Footer />

      <TeacherControl
        colors={{ dark: periodColors.dark }}
        role={user?.role}
        currentLesson={currentLesson}
        onFileUploaded={handleFileUploaded}
      />
    </main>
  );
}

