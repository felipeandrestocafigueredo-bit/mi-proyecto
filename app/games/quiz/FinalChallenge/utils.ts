/* ==========================================================
   FINAL CHALLENGE
   UTILS
   Arquitectura 3.0
========================================================== */

import {

    SUCCESS_MESSAGES,

    FAIL_MESSAGES,

    PODIUM,

} from "./data";

/* ==========================================================
   Mezclar preguntas
========================================================== */

export function shuffle<T>(array: T[] = []): T[] {

    const items = [...array];

    for (
        let i = items.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );
        [items[i], items[j]] = [
            items[j],
            items[i],
        ];
    }

    return items;

}

/* ==========================================================
   Preparar preguntas
==========================================================*/

export function prepareQuestions(
    questions: any[] = []
): any[] {

    return shuffle(questions).map((q) => ({
        ...q,
        options: shuffle(q.options),
    }));

}

/* ==========================================================
   Precisión
========================================================== */

export function calculateAccuracy(
    correct: number,
    total: number
): number {

    if (!total) return 0;

    return Math.round(
        (correct / total) * 100
    );

}

/* ==========================================================
   Estrellas
========================================================== */

export function calculateStars(
    correct: number,
    total: number
): number {

    const accuracy = calculateAccuracy(
        correct,
        total
    );

    if (accuracy >= 90) return 3;

    if (accuracy >= 75) return 2;

    if (accuracy >= 50) return 1;

    return 0;

}

/* ==========================================================
   Puntaje
========================================================== */

export function calculateScore(
    correct: number,
    streak: number,
    config: any
): number {

    return (
        correct * config.scoreCorrect +
        streak * config.streakBonus
    );

}

/* ==========================================================
   Progreso
========================================================== */

export function calculateProgress(
    current: number,
    total: number
): number {

    if (!total) return 0;

    return Math.round(
        ((current + 1) / total) * 100
    );

}

/* ==========================================================
   Mensaje positivo
========================================================== */

export function randomSuccess(): string {

    return SUCCESS_MESSAGES[
        Math.floor(
            Math.random() *
                SUCCESS_MESSAGES.length
        )
    ];

}

/* ==========================================================
   Mensaje error
========================================================== */

export function randomFail(): string {

    return FAIL_MESSAGES[
        Math.floor(
            Math.random() *
                FAIL_MESSAGES.length
        )
    ];

}

/* ==========================================================
   Obtener podio
========================================================== */

export function getPodiumPlace(
    stars: number
): any {

    if (stars >= 3)
        return PODIUM[0];

    if (stars === 2)
        return PODIUM[1];

    return PODIUM[2];

}

/* ==========================================================
   Ranking
========================================================== */

export interface RankingData {
    rank: string;
    score: number;
    accuracy: number;
    coins: number;
}

export function calculateRanking({
    score,
    accuracy,
    coins,
}: {
    score: number;
    accuracy: number;
    coins: number;
}): RankingData {

    let rank = "C";

    if (
        score >= 2500 &&
        accuracy >= 95
    ) {
        rank = "S";
    }
    else if (
        score >= 1800 &&
        accuracy >= 85
    ) {
        rank = "A";
    }
    else if (
        score >= 1200 &&
        accuracy >= 70
    ) {
        rank = "B";
    }

    return {
        rank,
        score,
        accuracy,
        coins,
    };

}

/* ==========================================================
   Formatear tiempo
========================================================== */

export function formatTime(seconds: number): string {

    const m = Math.floor(
        seconds / 60
    );

    const s = seconds % 60;

    return `${m}:${String(s).padStart(2, "0")}`;

}

/* ==========================================================
   Vidas
========================================================== */

export function hearts(
    current: number,
    max: number
): { full: number; empty: number } {

    return {
        full: Math.max(0, current),
        empty: Math.max(
            0,
            max - current
        ),
    };

}
