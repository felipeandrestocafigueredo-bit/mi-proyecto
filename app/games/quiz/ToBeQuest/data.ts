/* ==========================================================
   TO BE QUEST
   DATA
   Arquitectura 3.0
========================================================== */

export interface Question {
    question: string;
    options: string[];
    correct: string;
}

export interface World {
    id: string;
    name: string;
    icon: string;
    grade: number;
    grad: [string, string];
    questions: Question[];
}

export const TOBE_WORLDS: World[] = [
    {
        id: "tb-1",
        name: "Verb To Be",
        icon: "👦",
        grade: 6,
        grad: ["#3B82F6", "#1D4ED8"],
        questions: [
            {
                question: "I ___ a student.",
                options: ["am", "is", "are", "be"],
                correct: "am",
            },
            {
                question: "She ___ happy.",
                options: ["am", "is", "are", "be"],
                correct: "is",
            },
            {
                question: "They ___ friends.",
                options: ["am", "is", "are", "be"],
                correct: "are",
            },
            {
                question: "We ___ at school.",
                options: ["am", "is", "are", "be"],
                correct: "are",
            },
            {
                question: "He ___ my brother.",
                options: ["am", "is", "are", "be"],
                correct: "is",
            },
        ],
    },
    {
        id: "tb-2",
        name: "Negative",
        icon: "❌",
        grade: 6,
        grad: ["#8B5CF6", "#6D28D9"],
        questions: [
            {
                question: "I am not tired.",
                options: ["Negative", "Question", "Affirmative", "Plural"],
                correct: "Negative",
            },
            {
                question: "She isn't sad.",
                options: ["Negative", "Affirmative", "Question", "Plural"],
                correct: "Negative",
            },
            {
                question: "They aren't here.",
                options: ["Negative", "Affirmative", "Verb", "Question"],
                correct: "Negative",
            },
        ],
    },
    {
        id: "tb-3",
        name: "Questions",
        icon: "❓",
        grade: 6,
        grad: ["#10B981", "#047857"],
        questions: [
            {
                question: "___ you happy?",
                options: ["Am", "Is", "Are", "Be"],
                correct: "Are",
            },
            {
                question: "___ she your sister?",
                options: ["Are", "Am", "Is", "Be"],
                correct: "Is",
            },
            {
                question: "___ I late?",
                options: ["Am", "Is", "Are", "Be"],
                correct: "Am",
            },
        ],
    },
];

export const POSITIVE_MESSAGES: string[] = [
    "Excellent! ⭐",
    "Amazing! 🎉",
    "Great Job! 🏆",
    "Perfect! 💯",
    "Fantastic! 🚀",
];

export const NEGATIVE_MESSAGES: string[] = [
    "Try Again! 💪",
    "Keep Practicing! 📚",
    "Almost! ⭐",
    "Don't Give Up! ❤️",
];

export interface GameConfig {
    TIME_PER_QUESTION: number;
    POINTS_CORRECT: number;
    BONUS_STREAK: number;
    MAX_STARS: number;
    PASS_SCORE: number;
}

export const GAME_CONFIG: GameConfig = {
    TIME_PER_QUESTION: 20,
    POINTS_CORRECT: 10,
    BONUS_STREAK: 5,
    MAX_STARS: 3,
    PASS_SCORE: 70,
};
