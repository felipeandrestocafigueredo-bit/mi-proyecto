/* ==========================================================
   TO BE QUEST
   UTILS
   Arquitectura 3.0
========================================================== */

/*==========================================================
    Mezclar arreglo (Fisher-Yates)
==========================================================*/

export function shuffle<T>(array: T[]): T[] {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];

    }

    return copy;

}

/*==========================================================
    Preparar preguntas
==========================================================*/

export function prepareQuestions(questions: any[] = []): any[] {

    return shuffle(questions).map((question) => ({
        ...question,
        options: shuffle(question.options),
    }));

}

/*==========================================================
    Calcular precisión
==========================================================*/

export function calculateAccuracy(correct: number = 0, total: number = 0): number {

    if (total === 0) return 0;

    return Math.round((correct / total) * 100);

}

/*==========================================================
    Calcular estrellas
==========================================================*/

export function calculateStars(correct: number = 0, total: number = 0): number {

    const accuracy = calculateAccuracy(correct, total);

    if (accuracy >= 90) return 3;

    if (accuracy >= 70) return 2;

    if (accuracy >= 50) return 1;

    return 0;

}

/*==========================================================
    Calcular puntaje
==========================================================*/

export function calculateScore(
    correct: number = 0,
    streak: number = 0,
    config: any
): number {

    if (!config) return correct * 10;

    return (
        (correct * config.POINTS_CORRECT) +
        (streak * config.BONUS_STREAK)
    );

}

/*==========================================================
    Obtener mensaje positivo
==========================================================*/

export function randomPositive(messages: string[] = []): string {

    if (!messages.length) return "";

    return messages[
        Math.floor(
            Math.random() * messages.length
        )
    ];

}

/*==========================================================
    Obtener mensaje negativo
==========================================================*/

export function randomNegative(messages: string[] = []): string {

    if (!messages.length) return "";

    return messages[
        Math.floor(
            Math.random() * messages.length
        )
    ];

}

/*==========================================================
    Reiniciar estadísticas
==========================================================*/

export function createInitialStats() {

    return {

        score: 0,

        correct: 0,

        wrong: 0,

        streak: 0,

        stars: 0,

        accuracy: 0,

        progress: 0,

        coins: 0,

    };

}

/*==========================================================
    Actualizar progreso
==========================================================*/

export function calculateProgress(
    current: number = 0,
    total: number = 1
): number {

    if (total <= 0) return 0;

    return Math.round(
        ((current + 1) / total) * 100
    );

}
