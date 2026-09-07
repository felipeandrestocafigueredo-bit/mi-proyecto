/* ==========================================================
   QUIZ MULTIPLE
   Arquitectura 3.0
   Utils
========================================================== */

/* ==========================================================
   Mezclar arreglo (Fisher-Yates)
========================================================== */

export function shuffleArray<T>(array: T[]): T[] {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

}

/* ==========================================================
   Número aleatorio
========================================================== */

export function randomItem<T>(array: T[]): T {
    return array[
        Math.floor(Math.random() * array.length)
    ];
}

/* ==========================================================
   Calcular precisión
========================================================== */

export function calculateAccuracy(
    correct: number,
    total: number
): number {

    if (total === 0) return 0;

    return Math.round(
        (correct / total) * 100
    );

}

/* ==========================================================
   Calcular estrellas
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

    if (accuracy >= 70) return 2;

    return 1;

}

/* ==========================================================
   Calcular puntuación
========================================================== */

export function calculateScore(
    correct: number,
    streak: number
): number {

    return (
        correct * 10 +
        streak * 5
    );

}

/* ==========================================================
   Formatear tiempo
========================================================== */

export function formatTime(seconds: number): string {

    const min = Math.floor(seconds / 60);

    const sec = seconds % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;

}

/* ==========================================================
   Mezclar preguntas
========================================================== */

export function prepareQuestions(
    questions: any[],
    shuffle: boolean = true
): any[] {

    if (!shuffle) return [...questions];

    return shuffleArray(questions);

}

/* ==========================================================
   Mezclar respuestas
========================================================== */

export function prepareOptions(
    options: any[],
    shuffle: boolean = true
): any[] {

    if (!shuffle) return [...options];

    return shuffleArray(options);

}

/* ==========================================================
   Validar respuesta
========================================================== */

export function isCorrectAnswer(
    selected: string,
    correct: string
): boolean {

    return selected === correct;

}

/* ==========================================================
   Calcular progreso
========================================================== */

export function calculateProgress(
    current: number,
    total: number
): number {

    if (total === 0) return 0;

    return Math.round(
        (current / total) * 100
    );

}

/* ==========================================================
   Monedas ganadas
========================================================== */

export function calculateCoins(stars: number): number {

    switch (stars) {

        case 3:
            return 15;

        case 2:
            return 10;

        default:
            return 5;

    }

}

/* ==========================================================
   Reiniciar estadísticas
========================================================== */

export function createInitialStats() {

    return {

        score: 0,

        correct: 0,

        wrong: 0,

        streak: 0,

        coins: 0,

        stars: 0,

        progress: 0,

        accuracy: 0,

    };

}
