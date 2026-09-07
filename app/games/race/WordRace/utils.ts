/* ==========================================================
   WORD RACE
   UTILS
   Arquitectura 3.0
========================================================== */

import {
    WORDRACE_CONFIG,
} from "./data";

import {
    VocabWord,
} from "./data";

/* ==========================================================
   Mezclar palabras
========================================================== */

export function shuffleWords(words: VocabWord[] = []): VocabWord[] {

    const deck = [...words];

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
   Seleccionar palabra
========================================================== */

export function randomWord(words: VocabWord[] = []): VocabWord | null {

    if (!words.length) return null;

    const index = Math.floor(
        Math.random() * words.length
    );

    return words[index];

}

/* ==========================================================
   Comparar respuesta
========================================================== */

export function isCorrectWord(
    answer: string,
    expected: string
): boolean {

    if (!answer || !expected)
        return false;

    return (
        answer.trim().toLowerCase() ===
        expected.trim().toLowerCase()
    );

}

/* ==========================================================
   Puntaje
========================================================== */

export function calculateScore(
    score: number,
    correct: boolean
): number {

    return correct
        ? score +
              WORDRACE_CONFIG.POINTS_CORRECT
        : Math.max(
               0,
               score +
                   WORDRACE_CONFIG.POINTS_WRONG
          );

}

/* ==========================================================
   Estrellas
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
   Tiempo
========================================================== */

export function formatTime(seconds: number): string {

    const min = Math.floor(seconds / 60);

    const sec = seconds % 60;

    return `${min}:${String(sec).padStart(
        2,
        "0"
    )}`;

}

/* ==========================================================
   Reiniciar letras
========================================================== */

export function clearLetters(letters: string[] = []): string[] {

    return letters.map(() => "");

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
   Juego terminado
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
