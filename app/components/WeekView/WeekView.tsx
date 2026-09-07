"use client";

import { useEffect, useState } from "react";

import type { Lesson } from "../../models/LessonModel";

import WeekCard from "../MonthView/WeekCard";

import PresentationTab from "./PresentationTab";
import FlashcardsTab from "./FlashCardsTab";
import ResourcesTab from "./ResourcesTab";
import WorksheetTab from "./WorksheetTab";
import GamesTab from "./GamesTab";

import GameLauncher from "../LessonEngine/GameLauncher";
import EmptyState from "../common/EmptyState";

interface WeekViewColors extends Record<string, string> {
  dark: string;
  mid: string;
  main: string;
  light: string;
  text: string;
  name: string;
}

interface WeekViewProps {
  lessons?: Lesson[];
  lesson?: Lesson | null;
  colors: WeekViewColors;
  onBack?: () => void;
  inline?: boolean;
  onClose?: () => void;
  editMode?: boolean;
  onFileUploaded?: () => void;
}

export default function WeekView({
  lessons = [],
  lesson: selectedLesson,
  colors,
  onBack,
  inline = false,
  onClose,
  editMode = false,
  onFileUploaded,
}: WeekViewProps) {

  const weeks = lessons;
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("presentation");
  const [lessonOverride, setLessonOverride] = useState<Lesson | null>(null);

  const lessonFromList =
      selectedWeek !== null
          ? weeks[selectedWeek]
          : null;

  const lesson = lessonOverride ?? selectedLesson ?? lessonFromList;

  useEffect(() => {
    setLessonOverride(null);
  }, [selectedLesson?.id]);

  function handleLessonUpdated(updatedLesson: Lesson): void {
    setLessonOverride(updatedLesson);
    onFileUploaded?.();
  }

  const isDirectLesson = Boolean(selectedLesson);

  const lessonGradeCode = lesson?.grade_code;
  const lessonMonthIndex = lesson?.month_index;
  const lessonWeekIndex = lesson?.week_index;

    /*
    =======================================================
    No existen semanas
    =======================================================
    */

    if (!isDirectLesson && !weeks.length) {

        return (

            <EmptyState

                text="Este mes todavía no tiene semanas configuradas."

            />

        );

    }

    /*
    =======================================================
    Vista principal (lista de semanas)
    =======================================================
    */

    if (!isDirectLesson && selectedWeek === null) {

        return (

            <div

                style={{

                    display: "grid",

                    gap: 14,

                }}

            >

                {weeks.map((week, index) => (

                    <WeekCard

                        key={week.id || index}

                        lesson={week}

                        index={index}

                        colors={colors}

                        onClick={() => {

                            setSelectedWeek(index);

                            setSelectedGame(null);

                            setTab("presentation");

                        }}

                    />

                ))}

            </div>

        );

    }

    /*
    =======================================================
    Si hay un juego abierto
    =======================================================
    */

    if (selectedGame) {

        return (

            <GameLauncher

                lesson={lesson as unknown as Record<string, unknown>}

                gameId={selectedGame}

                colors={colors}

                onBack={() => setSelectedGame(null)}

            />

        );

    }

    /*
    =======================================================
    Tabs disponibles
    =======================================================
    */

    const tabs = [

        {
 
             id: "presentation",
 
             label: "📖 Presentación",
 
         },
 
         {
 
             id: "slides",
 
             label: "📽️ Diapositivas",
 
         },
 
         {
 
             id: "flashcards",
 
             label: "🃏 Flashcards",
 
         },
 
         {
 
             id: "resources",
 
             label: "🌐 Recursos",
 
         },
 
         {
 
             id: "worksheet",
 
             label: "📄 Worksheet",
 
         },
 
         {
 
             id: "games",
 
             label: "🎮 Juegos",
 
         },
 
     ];

    /*
    =======================================================
    Modo inline: solo tabs y contenido
    =======================================================
    */

    if (inline) {

        return (

            <div>

                {onClose && (

                    <button

                        onClick={onClose}

                        style={{

                            marginBottom: 12,

                            border: "none",

                            background: colors.light,

                            color: colors.text,

                            padding: "8px 14px",

                            borderRadius: 10,

                            cursor: "pointer",

                            fontWeight: 700,

                            fontSize: 13,

                        }}

                    >

                        ← Cerrar semana

                    </button>

                )}

                <div

                    style={{

                        display: "flex",

                        flexWrap: "wrap",

                        justifyContent: "center",

                        alignItems: "center",

                        gap: 10,

                        marginBottom: 18,

                    }}

                >

                    {

                        tabs.map((item) => (

                            <button

                                key={item.id}

                                onClick={() => setTab(item.id)}

                                style={{

                                    border: "none",

                                    cursor: "pointer",

borderRadius: 999,

                                        padding: "12px 20px",

                                        fontWeight: 700,

                                        fontSize: 14,

                                        fontFamily: "'Fredoka', sans-serif",

                                        transition: "all .25s ease",

                                        background:

                                        tab === item.id

                                            ? colors.main

                                            : "#F1F5F9",

                                        color:

                                            tab === item.id

                                                ? "#fff"

                                                : colors.text,

                                        boxShadow:

                                            tab === item.id

                                                ? `0 4px 14px ${colors.main}44`

                                                : "none",

                                    }}

                            >

                                {item.label}

                            </button>

                        ))

                    }

                </div>

                  {
                      tab === "presentation" && (
              
                           <PresentationTab
                               
                               lesson={lesson}
                               
                               colors={colors}
                               gradeCode={lessonGradeCode}
                               monthIndex={lessonMonthIndex}
                               weekIndex={lessonWeekIndex}
                               onFileUploaded={handleLessonUpdated}
              
                               onOpenSlides={() => setTab("slides")}
              
                           />
              
                       )
              
                    }
              
                    {
              
                        tab === "slides" && (
              
                            <PresentationTab
                                 
                                lesson={lesson}
                                 
                                colors={colors}
                                gradeCode={lessonGradeCode}
                                monthIndex={lessonMonthIndex}
                                weekIndex={lessonWeekIndex}
                                onFileUploaded={handleLessonUpdated}
              
                                view="slides"
              
                            />
              
                        )
              
                    }
              
                    {
              
                        tab === "flashcards" && (
              
                            <FlashcardsTab
              
                                lesson={lesson}
              
                                colors={colors}
              
                                onOpenSlides={() => setTab("slides")}
              
                            />
              
                        )
              
                    }
              
                    {
              
                        tab === "resources" && (
              
                            <ResourcesTab
              
                                lesson={lesson}
              
                                colors={colors}
                                onFileUploaded={handleLessonUpdated}
              
                                gradeCode={lessonGradeCode}
              
                                monthIndex={lessonMonthIndex}
              
                                weekIndex={lessonWeekIndex}
              
                            />
              
                        )
              
                    }
              
                    {
              
                        tab === "worksheet" && (
              
                            <WorksheetTab
              
                                lesson={lesson}
              
                                colors={colors}
                                gradeCode={lessonGradeCode}
                                monthIndex={lessonMonthIndex}
                                weekIndex={lessonWeekIndex}
                                onFileUploaded={handleLessonUpdated}
              
                            />
              
                        )
              
                    }
              
                    {
              
                        tab === "games" && (
              
                            <GamesTab
              
                                lesson={lesson}
              
                                onPlay={setSelectedGame}
              
                                colors={colors}
              
                            />
              
                        )
              
                    }

            </div>

        );

    }

    /*
    =======================================================
    Vista de una semana
    =======================================================
    */

    return (

        <div>

            {!inline && (

                /* ==========================================
                    Botón volver
                ========================================== */

                <button

                    onClick={() => {

                        setSelectedGame(null);

                        if (typeof onBack === "function") {

                            return onBack();

                        }

                        setSelectedWeek(null);

                    }}

                    style={{

                        marginBottom: 18,

                        border: "none",

                        background: colors.light,

                        color: colors.text,

                        padding: "10px 18px",

                        borderRadius: 12,

                        cursor: "pointer",

                        fontWeight: 700,

                        fontSize: 14,

                    }}

                >

                    ← Volver a las semanas

                </button>

            )}

            {!inline && (

                /* ==========================================
                    Información de la semana
                ========================================== */

                <div

                    style={{

                        background: "#fff",

                        borderRadius: 18,

                        padding: 22,

                        border: "2px solid rgba(36,31,26,.08)",

                        marginBottom: 20,

                    }}

                >

                    <h2

                        style={{

                            margin: 0,

                            color: colors.text,

                            fontFamily: "'Fredoka', sans-serif",

                        }}

                    >

                        {lesson!.topic}

                    </h2>

                    <div

                        style={{

                            marginTop: 8,

                            color: "#64748B",

                            fontSize: 14,

                        }}

                    >

                        📅 {lesson!.fecha}

                    </div>

                    {

                        lesson!.badge && (

                            <div

                                style={{

                                    display: "inline-block",

                                    marginTop: 12,

                                    padding: "6px 12px",

                                    borderRadius: 10,

                                    background: colors.light,

                                    color: colors.text,

                                    fontWeight: 700,

                                    fontSize: 12,

                                }}

                            >

                                {lesson!.badge}

                            </div>

                        )

                    }

                </div>

            )}

            {!inline && (

                /* ==========================================
                    Barra de Tabs
                ========================================== */

                <div

                    style={{

                        display: "flex",

                        flexWrap: "wrap",

                        gap: 10,

                        marginBottom: 22,

                    }}

                >

                    {

                        tabs.map((item) => (

                            <button

                                key={item.id}

                                onClick={() => setTab(item.id)}

                                style={{

                                    border: "none",

                                    cursor: "pointer",

                                    borderRadius: 999,

                                        padding: "12px 20px",

                                        fontWeight: 700,

                                        fontSize: 14,

                                        fontFamily: "'Fredoka', sans-serif",

                                        transition: "all .25s ease",

                                    background:

                                        tab === item.id

                                            ? colors.main

                                            : "#F1F5F9",

                                        color:

                                            tab === item.id

                                                ? "#fff"

                                                : colors.text,

                                        boxShadow:

                                            tab === item.id

                                                ? `0 4px 14px ${colors.main}44`

                                                : "none",

                                    }}

                            >

                                {item.label}

                            </button>

                        ))

                    }

                </div>

            )}

            {/* ==========================================
                Contenido
            ========================================== */}

            {

                tab === "presentation" && (
 
                    <PresentationTab
 
                        lesson={lesson}
 
                        colors={colors}
 
                        onOpenSlides={() => setTab("slides")}
 
                    />
 
                )
 
            }
 
{
                tab === "slides" && (

                    <PresentationTab

                        lesson={lesson}

                        colors={colors}
                        gradeCode={lessonGradeCode}
                        monthIndex={lessonMonthIndex}
                        weekIndex={lessonWeekIndex}
                        onFileUploaded={handleLessonUpdated}

                        view="slides"

                    />

                )

            }
 
            {
 
                tab === "flashcards" && (
 
                    <FlashcardsTab
 
                        lesson={lesson}
 
                        colors={colors}
 
                        onOpenSlides={() => setTab("slides")}
 
                    />
 
                )
 
            }

            {

                tab === "resources" && (

                    <ResourcesTab

                        lesson={lesson}

                        colors={colors}
                        gradeCode={lessonGradeCode}
                        monthIndex={lessonMonthIndex}
                        weekIndex={lessonWeekIndex}
                        onFileUploaded={handleLessonUpdated}

                    />

                )

            }

            {

                tab === "worksheet" && (

                    <WorksheetTab
                        
                        lesson={lesson}
                        
                        colors={colors}
                        gradeCode={lessonGradeCode}
                        monthIndex={lessonMonthIndex}
                        weekIndex={lessonWeekIndex}
                        onFileUploaded={handleLessonUpdated}

                    />

                )

            }

            {

                tab === "games" && (

                    <GamesTab

                        lesson={lesson}

                        onPlay={setSelectedGame}

                        colors={colors}

                    />

                )

            }

        </div>

    );

}
