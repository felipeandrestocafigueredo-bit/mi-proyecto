/* ==========================================================
   SNAP CARDS
   DATA
   Arquitectura 3.0
========================================================== */

export interface SnapConfig {
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

export const SNAP_CONFIG: SnapConfig = {
    GAME_ID: "snapcards",
    TITLE: "Snap Cards",
    DESCRIPTION:
        "Find the matching English word as fast as possible.",
    MAX_LIVES: 3,
    ROUND_TIME: 60,
    POINTS_CORRECT: 100,
    POINTS_WRONG: -25,
    BONUS_TIME: 10,
    MAX_STARS: 3,
};

export const SNAP_DATA: any[] = [];

export const SNAP_MESSAGES = {
    START:
        "Find the correct card!",
    CORRECT: [
        "Excellent!",
        "Great!",
        "Awesome!",
        "Fantastic!",
        "Correct!",
    ],
    WRONG: [
        "Try again!",
        "Keep looking!",
        "Almost!",
        "Not this one!",
    ],
    WIN:
        "Congratulations!",
    LOSE:
        "Game Over",
};

export const SNAP_STARS = {
    THREE: 3,
    TWO: 2,
    ONE: 1,
};

export const SNAP_COLORS = {
    primary: "#6C5CE7",
    secondary: "#2EC4B6",
    accent: "#FFD93D",
    danger: "#FF6B6B",
    success: "#4CAF50",
    background: "#F8F9FF",
};

export const SNAP_ANIMATIONS = {
    CARD_FLIP: 250,
    CARD_POP: 300,
    MESSAGE_TIME: 1200,
    NEXT_ROUND: 800,
};
