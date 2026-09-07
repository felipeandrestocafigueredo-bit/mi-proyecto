"use client";

import { useState } from "react";

import GameLauncher from "./GameLauncher";
import EmptyState from "../common/EmptyState";
import { getGameInfo } from "../../data/gameCatalog";
import { ProgressEngine } from "../../games";

/* ==========================================================
   LESSON GAMES
   Arquitectura Oficial 3.0

   Construye automáticamente el panel de juegos
   leyendo lesson.games.

   Formatos soportados:

   games:[
      "memory",
      "quiz"
   ]

   o

   games:[
      { id:"memory" },
      { id:"quiz" }
   ]

========================================================== */

const DEFAULT_GAMES = ["pandyMemory", "snapCards", "quizMultiple"];
const GAME_ALIASES: Record<string, string | null> = {
    wordsearch: "pandyMemory",
    hangman: "wordRace",
    matching: "snapCards",
    scramble: "wordRace",
    truefalsegame: "quizMultiple",
    fillblank: "quizMultiple",
    flashcards: "pandyMemory",
    worksheet: null,
    memory: "pandyMemory",
    quiz: "quizMultiple",
    bingo: "bingo",
    finalchallenge: "finalChallenge",
    tobequest: "toBeQuest",
    pandyadventure: "pandyAdventure",
    adventure: "pandyAdventure",
};
const GAME_AVATARS: Record<string, string> = {
    pandyMemory: "🧠",
    snapCards: "🃏",
    quizMultiple: "❓",
    wordRace: "🏁",
    bingo: "🎱",
    finalChallenge: "🏆",
    toBeQuest: "🗺️",
    pandyAdventure: "🚀",
    memory: "🧩",
    matching: "🟩",
    adventure: "🚀",
};

interface LessonGameEntry {
    id: string;
    difficulty?: string;
    stars?: number;
    enabled?: boolean;
    [key: string]: unknown;
}

interface LessonGamesProps {
    lesson: {
        games?: Array<string | LessonGameEntry>;
        [key: string]: unknown;
    };
    colors: {
        main?: string;
        [key: string]: unknown;
    };
    onPlay?: (gameId: string) => void;
}

interface LeaderboardEntry {
    id: string;
    score: number;
    title: string;
    avatar: string;
}

export default function LessonGames({
    lesson,
    colors,
    onPlay,
}: LessonGamesProps) {

    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const lessonGames = Array.isArray(lesson?.games) ? lesson.games : [];
    const normalizedGames = lessonGames
        .map((game) => {
            const entry = typeof game === "string" ? { id: game } : game || {};
            const normalizedId = GAME_ALIASES[entry.id?.toLowerCase?.()] ?? entry.id;
            return normalizedId ? { ...entry, id: normalizedId } : null;
        })
        .filter((game): game is LessonGameEntry => Boolean(game));

    const gameEntries: LessonGameEntry[] = [];
    const seenIds = new Set<string>();

    normalizedGames.forEach((game) => {
        if (!game.id || seenIds.has(game.id)) return;
        seenIds.add(game.id);
        gameEntries.push(game);
    });

    while (gameEntries.length < 3) {
        const nextBest = DEFAULT_GAMES.find((id) => !seenIds.has(id));
        if (!nextBest) break;
        seenIds.add(nextBest);
        gameEntries.push({ id: nextBest });
    }

    if (gameEntries.length > 3) {
        gameEntries.splice(3);
    }

    const leaderboard: LeaderboardEntry[] = gameEntries
        .map((game) => {
            const progress = ProgressEngine.getGame(game.id);
            return {
                id: game.id,
                score: progress.bestScore || 0,
                title: getGameInfo(game.id)?.title || game.id,
                avatar: GAME_AVATARS[game.id] || "🎮",
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    /* ======================================================
       No existen juegos
    ====================================================== */

    if (!gameEntries.length) {

        return (

            <EmptyState

                text="Esta lección todavía no tiene juegos disponibles."

            />

        );

    }

    /* ======================================================
       Ejecutar juego
    ====================================================== */

    if (selectedGame) {

        return (

            <GameLauncher

                lesson={lesson}

                gameId={selectedGame}

                colors={colors}

                onBack={() => {
                  setSelectedGame(null);
                  if (typeof onPlay === "function") onPlay("");
                }}

            />

        );

    }

    /* ======================================================
       Panel de juegos
    ====================================================== */

    return (

        <div

            style={{

                display: "grid",

                gap: 18,

            }}

        >

            <div

                style={{

                    background: "#fff",

                    borderRadius: 18,

                    border: "2px solid rgba(36,31,26,.08)",

                    padding: 24,

                    display: "grid",

                    gridTemplateColumns: "1fr auto",

                    gap: 18,

                    alignItems: "center",

                }}

            >

                <div>

                    <div

                        style={{

                            fontSize: 18,

                            fontWeight: 700,

                            marginBottom: 8,

                        }}

                    >

                        🏆 Podio semanal

                    </div>

                    <div

                        style={{

                            color: "#475569",

                            lineHeight: 1.6,

                            fontSize: 14,

                        }}

                    >

                        Practica acá el vocabulario semanal.

                    </div>

                </div>

                <div

                    style={{

                        display: "grid",

                        gridTemplateColumns: "repeat(3,minmax(0,1fr))",

                        gap: 12,

                    }}

                >

                    {leaderboard.map((item, index) => (

                        <div

                            key={item.id}

                            style={{

                                background: index === 0 ? "#F8FAFC" : "#FFFFFF",

                                borderRadius: 16,

                                border: "1px solid rgba(148,163,184,.2)",

                                padding: 12,

                                textAlign: "center",

                            }}

                        >

                            <div

                                style={{

                                    marginBottom: 8,

                                    fontSize: 12,

                                    color: "#64748B",

                                    textTransform: "uppercase",

                                    letterSpacing: ".04em",

                                }}

                            >

                                {index === 0 ? "1er" : index === 1 ? "2do" : "3ro"}

                            </div>

                            <div

                                style={{

                                    fontSize: 24,

                                }}

                            >

                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}

                            </div>

                            <div

                                style={{

                                    marginTop: 6,

                                    fontSize: 32,

                                }}

                            >

                                {item.avatar}

                            </div>

                            <div

                                style={{

                                    marginTop: 6,

                                    fontWeight: 700,

                                }}

                            >

                                {item.title}

                            </div>

                            <div

                                style={{

                                    marginTop: 4,

                                    color: "#64748B",

                                    fontSize: 12,

                                }}

                            >

                                {item.score} pts

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <div

                style={{

                    display: "grid",

                    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",

                    gap: 18,

                }}

            >

                {

                    gameEntries.map((game) => {

                        const gameData = { ...game } as LessonGameEntry & Record<string, unknown>;

                        const info = getGameInfo(gameData.id);

                        const gameAvatar = GAME_AVATARS[gameData.id] || "🎮";

                        if (!info) return null;

                        return (

                            <div

                                key={gameData.id}

                                style={{

                                    background: "#fff",

                                    borderRadius: 18,

                                    overflow: "hidden",

                                    border: "2px solid rgba(36,31,26,.08)",

                                    display: "flex",

                                    flexDirection: "column",

                                }}

                            >

                                {/* ================= Header ================= */}

                                <div

                                    style={{

                                        background: info.color,

                                        color: "#fff",

                                        padding: 18,

                                    }}

                                >

                                    <div

                                        style={{

                                            fontSize: 34,

                                        }}

                                    >

                                        {info.icon}

                                    </div>

                                    <div

                                        style={{

                                            marginTop: 8,

                                            fontSize: 20,

                                            fontWeight: 700,

                                        }}

                                    >

                                        {info.title}

                                    </div>

                                    <div

                                        style={{

                                            marginTop: 10,

                                            fontSize: 28,

                                        }}

                                    >

                                        {gameAvatar}

                                    </div>

                                </div>

                                {/* ================= Body ================= */}

                                <div

                                    style={{

                                        padding: 18,

                                        display: "flex",

                                        flexDirection: "column",

                                        flex: 1,

                                    }}

                                >

                                    <div

                                        style={{

                                            flex: 1,

                                            color: "#64748B",

                                            lineHeight: 1.5,

                                            fontSize: 14,

                                        }}

                                    >

                                        {info.description}

                                    </div>

                                    {/* Dificultad */}

                                    {

                                        gameData.difficulty && (

                                            <div

                                                style={{

                                                    marginTop: 12,

                                                    fontSize: 12,

                                                    fontWeight: 700,

                                                    color: "#64748B",

                                                }}

                                            >

                                                ⭐ Dificultad: {gameData.difficulty}

                                            </div>

                                        )

                                    }

                                    {/* Estrellas */}

                                    {

                                        typeof gameData.stars === "number" && (

                                            <div

                                                style={{

                                                    marginTop: 6,

                                                    fontSize: 13,

                                                }}

                                            >

                                                {"⭐".repeat(gameData.stars)}

                                            </div>

                                        )

                                    }

                                    <button

                                        onClick={() => {

                                            if (typeof onPlay === "function") {

                                                onPlay(gameData.id);

                                            } else {

                                                setSelectedGame(gameData.id);

                                            }

                                        }

                                        }

                                        disabled={gameData.enabled === false}

                                        style={{

                                            marginTop: 18,

                                            width: "100%",

                                            border: "none",

                                            borderRadius: 12,

                                            padding: "12px 16px",

                                            cursor:

                                                gameData.enabled === false

                                                    ? "not-allowed"

                                                    : "pointer",

                                            fontWeight: 700,

                                            fontSize: 15,

                                            background:

                                                gameData.enabled === false

                                                    ? "#CBD5E1"

                                                    : colors?.main || "#2563EB",

                                            color: "#fff",

                                            opacity:

                                                gameData.enabled === false

                                                    ? 0.6

                                                    : 1,

                                        }}

                                    >

                                        {

                                            gameData.enabled === false

                                                ? "🔒 Bloqueado"

                                                : "Practica"

                                        }

                                    </button>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );
}
