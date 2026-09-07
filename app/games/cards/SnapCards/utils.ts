/* ==========================================================
   SNAP CARDS
   UTILS
   Arquitectura 3.0
========================================================== */

import {

    SNAP_CONFIG,

} from "./data";

import { CardData } from "../types";

/* ==========================================================
   Mezclar tarjetas
========================================================== */

export function shuffleCards(cards: CardData[] = []): CardData[] {

    const deck = [...cards];

    for (
        let i = deck.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );
        [deck[i], deck[j]] = [
            deck[j],
            deck[i],
        ];
    }

    return deck;

}

/* ==========================================================
   Seleccionar carta objetivo
========================================================== */

export function randomTarget(cards: CardData[] = []): CardData | null {

    if (!cards.length) return null;

    const index = Math.floor(
        Math.random() * cards.length
    );

    return cards[index];

}

/* ==========================================================
   Verificar respuesta
========================================================== */

export function isCorrectCard(
    selected: CardData | null,
    target: CardData | null
): boolean {

    if (!selected || !target)
        return false;

    return (
        selected.word === target.word
    );

}

/* ==========================================================
   Calcular puntaje
========================================================== */

export function calculateScore(
    score: number,
    correct: boolean
): number {

    return correct
        ? score +
              SNAP_CONFIG.POINTS_CORRECT
        : Math.max(
               0,
               score +
                   SNAP_CONFIG.POINTS_WRONG
          );

}

/* ==========================================================
   Calcular estrellas
========================================================== */

export function calculateStars(
    correct: number,
    total: number
): number {

    if (!total) return 0;

    const percent =
        (correct / total) * 100;

    if (percent >= 90) return 3;

    if (percent >= 70) return 2;

    return 1;

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
        (current / total) * 100
    );

}

/* ==========================================================
   Reiniciar cartas
========================================================== */

export function resetCards(
    cards: CardData[] = []
): CardData[] {

    return shuffleCards(
        cards.map((card) => ({
            ...card,
            selected: false,
            correct: false,
            wrong: false,
        }))
    );

}

/* ==========================================================
   Tiempo
========================================================== */

export function formatTime(seconds: number): string {

    const min = Math.floor(
        seconds / 60
    );

    const sec = seconds % 60;

    return `${min}:${String(sec).padStart(
        2,
        "0"
    )}`;

}

/* ==========================================================
   Vidas
========================================================== */

export function loseLife(lives: number): number {

    return Math.max(
        0,
        lives - 1
    );

}

/* ==========================================================
   Final del juego
========================================================== */

export function isGameFinished({
    lives,
    current,
    total,
}: {
    lives: number;
    current: number;
    total: number;
}): boolean {

    return (
        lives <= 0 ||
        current >= total
    );

}
