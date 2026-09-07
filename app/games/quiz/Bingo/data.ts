/* ==========================================================
   BINGO
   DATA
   Arquitectura Oficial 3.0
========================================================== */

export interface BingoConfig {
    GRID_SIZE: number;
    FREE_CENTER: boolean;
    MAX_STARS: number;
    POINTS_PER_MATCH: number;
    BONUS_BINGO: number;
    INITIAL_LIVES: number;
    ROUND_TIME: number;
}

export const BINGO_CONFIG: BingoConfig = {
    GRID_SIZE: 4,
    FREE_CENTER: false,
    MAX_STARS: 3,
    POINTS_PER_MATCH: 10,
    BONUS_BINGO: 50,
    INITIAL_LIVES: 3,
    ROUND_TIME: 90,
};

export interface BingoMessages {
    START: string;
    MARK: string[];
    WRONG: string[];
    BINGO: string;
    WIN: string;
    GAME_OVER: string;
    TIME: string;
}

export const BINGO_MESSAGES: BingoMessages = {
    START: "Complete the Bingo board!",
    MARK: [
        "Great!",
        "Nice!",
        "Excellent!",
        "Correct!",
        "Keep going!",
    ],
    WRONG: [
        "Try again!",
        "Oops!",
        "Not this one!",
        "Look carefully!",
    ],
    BINGO: "🎉 BINGO!",
    WIN: "Excellent work!",
    GAME_OVER: "Game Over",
    TIME: "Time is over!",
};

export const BINGO_PATTERNS = {
    ROW: "row",
    COLUMN: "column",
    DIAGONAL: "diagonal",
    FULL: "full",
};

export const DEFAULT_THEME = {
    primary: "#4F46E5",
    secondary: "#22C55E",
    accent: "#F59E0B",
    danger: "#EF4444",
    background: "#F8FAFC",
};

export default {
    BINGO_CONFIG,
    BINGO_MESSAGES,
    BINGO_PATTERNS,
    DEFAULT_THEME,
};
