/*
=========================================================

PANDY MEMORY
UTILS
Arquitectura Oficial 3.0

Funciones auxiliares del juego.

=========================================================
*/

import { MEMORY_CONFIG, STAR_LIMITS } from "./data";

import { CardItem } from "./types";

/*==========================================================
MEZCLAR ARREGLO (Fisher-Yates)
==========================================================*/

export function shuffle<T>(array: T[] = []): T[] {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];

    }

    return result;

}

/*==========================================================
CREAR MAZO

Recibe lesson.vocab

Cada palabra genera dos cartas.

==========================================================*/

export function createDeck(vocabulary: any[] = []): CardItem[] {

    if (!Array.isArray(vocabulary)) return [];

    const cards: CardItem[] = [];

    vocabulary.forEach((item, index) => {

        const id = item.id ?? index;

        cards.push({
            id: `${id}-A`,
            pairId: id,
            word: item.word ?? "",
            translation: item.translation ?? "",
            image: item.image ?? "",
            audio: item.audio ?? "",
            type: "A",
        });

        cards.push({
            id: `${id}-B`,
            pairId: id,
            word: item.word ?? "",
            translation: item.translation ?? "",
            image: item.image ?? "",
            audio: item.audio ?? "",
            type: "B",
        });

    });

    return shuffle(cards);

}

/*==========================================================
CALCULAR ESTRELLAS

attempts = intentos

totalPairs = parejas

==========================================================*/

export function calculateStars(
    attempts: number = 0,
    totalPairs: number = 0
): number {

    if (totalPairs === 0) return 0;

    const perfect = totalPairs;

    const ratio = perfect / Math.max(attempts, 1);

    if (ratio >= STAR_LIMITS.three) {
        return 3;
    }

    if (ratio >= STAR_LIMITS.two) {
        return 2;
    }

    if (ratio >= STAR_LIMITS.one) {
        return 1;
    }

    return 0;

}

/*==========================================================
FORMATO DE TIEMPO

90
↓
01:30

==========================================================*/

export function formatTime(seconds: number = 0): string {

    const min = Math.floor(seconds / 60);

    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

}

/*==========================================================
PORCENTAJE

==========================================================*/

export function calculateProgress(
    matches: number = 0,
    totalPairs: number = 0
): number {

    if (totalPairs === 0) return 0;

    return Math.round(
        (matches / totalPairs) * 100
    );

}

/*==========================================================
PUNTOS DEL JUEGO

==========================================================*/

export function calculateScore(
    matches: number = 0,
    combo: number = 0
): number {

    return (
        matches * MEMORY_CONFIG.pairPoints +
        combo * MEMORY_CONFIG.comboBonus
    );

}
