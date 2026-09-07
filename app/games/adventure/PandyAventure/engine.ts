// ============================================================
// Pandy Adventure Engine
// Arquitectura 3.0
// ============================================================

import { paShuffle } from "./utils";

export interface GameData {
    world: {
        words: { word: string; emoji: string }[];
    };
    questions: { word: string; emoji: string }[];
    current: number;
    score: number;
    coins: number;
    lives: number;
    streak: number;
    correct: number;
    total: number;
    waveSpeed: number;
}

export interface AdventureEngineReturn {
    world: GameData["world"];
    target: { word: string } | null;
    progress: number;
    time: number;
    playerLane: number;
    playerAnimation: string;
    speakWord: () => void;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    getResult: () => {
        score: number;
        coins: number;
        correct: number;
        total: number;
    };
}

export function createAdventure(world: GameData["world"]): GameData {
    return {
        world,
        questions: paShuffle(world.words),
        current: 0,
        score: 0,
        coins: 0,
        lives: 3,
        streak: 0,
        correct: 0,
        total: 0,
        waveSpeed: 3.5,
    };
}

/* ============================================================
   Pregunta actual
============================================================ */

export function currentQuestion(game: GameData) {
    return game.questions[game.current] || null;
}

/* ============================================================
   Opciones
============================================================ */

export function createOptions(game: GameData) {
    const target = currentQuestion(game);

    if (!target) return [];

    const pool = game.world.words.filter(
        (w) => w.word !== target.word
    );

    return paShuffle([
        target,
        ...paShuffle(pool).slice(0, 2),
    ]);
}

/* ============================================================
   Respuesta correcta
============================================================ */

export function correctAnswer(game: GameData): GameData {
    game.correct++;
    game.total++;

    game.streak++;
    game.coins++;

    game.score += 10 + game.streak * 3;

    game.waveSpeed = Math.max(
        1.5,
        game.waveSpeed - 0.08
    );

    return game;
}

/* ============================================================
   Respuesta incorrecta
============================================================ */

export function wrongAnswer(game: GameData): GameData {
    game.total++;
    game.streak = 0;
    game.lives--;

    return game;
}

/* ============================================================
   Avanzar pregunta
============================================================ */

export function nextQuestion(game: GameData): boolean {
    game.current++;

    return game.current < game.questions.length;
}

/* ============================================================
   Estado final
============================================================ */

export function isFinished(game: GameData): boolean {
    return (
        game.lives <= 0 ||
        game.current >= game.questions.length
    );
}

/* ============================================================
   Precisión
============================================================ */

export function getAccuracy(game: GameData): number {
    if (game.total === 0) return 0;

    return Math.round(
        (game.correct / game.total) * 100
    );
}

/* ============================================================
   Estrellas
============================================================ */

export function calculateStars(game: GameData): number {
    const acc = getAccuracy(game);

    if (acc >= 90) return 3;

    if (acc >= 65) return 2;

    return 1;
}

/* ============================================================
   Resultado
============================================================ */

export interface GameResult {
    score: number;
    coins: number;
    correct: number;
    total: number;
    accuracy: number;
    stars: number;
}

export function buildResult(game: GameData): GameResult {
    return {
        score: game.score,
        coins: game.coins,
        correct: game.correct,
        total: game.total,
        accuracy: getAccuracy(game),
        stars: calculateStars(game),
    };
}

export default function AdventureEngine({ world = { words: [] }, adventure }: { world?: GameData["world"]; adventure?: Partial<GameData> } = {}): AdventureEngineReturn {
    const target = world.words?.[0] ?? null;

    return {
        world,
        target,
        progress: 0,
        time: 0,
        playerLane: 1,
        playerAnimation: "idle",
        speakWord: () => {},
        start: () => {},
        pause: () => {},
        resume: () => {},
        reset: () => {},
        getResult: () => buildResult({
            world: { words: [] },
            questions: [],
            current: 0,
            score: 0,
            coins: 0,
            lives: 0,
            streak: 0,
            correct: 0,
            total: 0,
            waveSpeed: 0,
        }),
    };
}
