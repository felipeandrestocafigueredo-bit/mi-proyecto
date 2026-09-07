/* ==========================================================
   WORD RACE
   DATA
   Arquitectura 3.0
========================================================== */

/*
=========================================================
Configuración del juego
=========================================================
*/

export interface VocabWord {
    word: string;
    emoji?: string;
    image?: string;
    text?: string;
}

export interface WordRaceConfig {
    GAME_ID: string;
    TITLE: string;
    DESCRIPTION: string;
    MAX_LIVES: number;
    ROUND_TIME: number;
    POINTS_CORRECT: number;
    POINTS_WRONG: number;
    BONUS_TIME: number;
    MAX_STARS: number;
}

export const WORDRACE_CONFIG: WordRaceConfig = {
    GAME_ID: "wordrace",
    TITLE: "Word Race",
    DESCRIPTION:
        "Write the correct English word before the time runs out.",
    MAX_LIVES: 3,
    ROUND_TIME: 30,
    POINTS_CORRECT: 100,
    POINTS_WRONG: -25,
    BONUS_TIME: 5,
    MAX_STARS: 3,
};

/*
=========================================================
Mensajes
=========================================================
*/

export const WORDRACE_MESSAGES = {
    START:
        "Type the correct word!",
    CORRECT: [
        "Excellent!",
        "Great!",
        "Awesome!",
        "Fantastic!",
        "Correct!",
    ],
    WRONG: [
        "Try again!",
        "Keep trying!",
        "Almost!",
        "Don't give up!",
    ],
    TIME:
        "Time is over!",
    WIN:
        "Congratulations!",
    LOSE:
        "Game Over",
};

/*
=========================================================
Estrellas
=========================================================
*/

export const WORDRACE_STARS = {
    THREE: 3,
    TWO: 2,
    ONE: 1,
};

/*
=========================================================
Colores
=========================================================
*/

export const WORDRACE_COLORS = {
    primary: "#3B82F6",
    secondary: "#06B6D4",
    accent: "#FACC15",
    success: "#22C55E",
    danger: "#EF4444",
    background: "#F8FAFC",
};

/*
=========================================================
Animaciones
=========================================================
*/

export const WORDRACE_ANIMATIONS = {
    LETTER_POP: 200,
    CORRECT: 500,
    WRONG: 500,
    NEXT_ROUND: 1000,
    MESSAGE_TIME: 1200,
};
