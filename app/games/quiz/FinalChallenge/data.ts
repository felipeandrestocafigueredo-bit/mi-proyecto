/* ==========================================================
   FINAL CHALLENGE
   DATA
   Arquitectura 3.0
========================================================== */

export interface FinalWorld {
    id: string;
    name: string;
    icon: string;
    grad: [string, string];
    questions: any[];
    description?: string;
}

export const FINAL_WORLDS: FinalWorld[] = [
    {
        id: "march",
        name: "March Challenge",
        icon: "🌸",
        grad: ["#2563EB", "#1E3A8A"],
        questions: [],
    },
    {
        id: "april",
        name: "April Challenge",
        icon: "🌼",
        grad: ["#16A34A", "#166534"],
        questions: [],
    },
    {
        id: "may",
        name: "May Challenge",
        icon: "🌻",
        grad: ["#F59E0B", "#B45309"],
        questions: [],
    },
    {
        id: "june",
        name: "June Challenge",
        icon: "☀️",
        grad: ["#DC2626", "#991B1B"],
        questions: [],
    },
    {
        id: "july",
        name: "July Challenge",
        icon: "🏖️",
        grad: ["#0891B2", "#155E75"],
        questions: [],
    },
    {
        id: "august",
        name: "August Challenge",
        icon: "🎒",
        grad: ["#7C3AED", "#5B21B6"],
        questions: [],
    },
    {
        id: "september",
        name: "September Challenge",
        icon: "🍂",
        grad: ["#EA580C", "#9A3412"],
        questions: [],
    },
    {
        id: "october",
        name: "October Challenge",
        icon: "🎃",
        grad: ["#9333EA", "#581C87"],
        questions: [],
    },
    {
        id: "november",
        name: "November Challenge",
        icon: "🏆",
        grad: ["#059669", "#065F46"],
        questions: [],
    },
];

export const FINAL_CSS = "";

/* ==========================================================
   Configuración General
========================================================== */

export interface GameConfig {
    lives: number;
    initialTime: number;
    bonusTime: number;
    scoreCorrect: number;
    scoreWrong: number;
    coinReward: number;
    streakBonus: number;
    maxStars: number;
}

export const GAME_CONFIG: GameConfig = {
    lives: 3,
    initialTime: 20,
    bonusTime: 5,
    scoreCorrect: 100,
    scoreWrong: -25,
    coinReward: 10,
    streakBonus: 50,
    maxStars: 3,
};

/* ==========================================================
   Mensajes Positivos
========================================================== */

export const SUCCESS_MESSAGES: string[] = [
    "Excellent! 🌟",
    "Amazing! 🎉",
    "Perfect! 💯",
    "Great Job! 🚀",
    "Fantastic! 🏆",
    "Awesome! ⭐",
];

/* ==========================================================
   Mensajes Error
========================================================== */

export const FAIL_MESSAGES: string[] = [
    "Try Again 💪",
    "Almost! 😊",
    "Don't Give Up 🚀",
    "Keep Practicing 📘",
    "One More Time ⭐",
];

/* ==========================================================
   Podio
========================================================== */

export interface PodiumItem {
    place: number;
    icon: string;
    title: string;
}

export const PODIUM: PodiumItem[] = [
    {
        place: 1,
        icon: "🥇",
        title: "Champion",
    },
    {
        place: 2,
        icon: "🥈",
        title: "Runner Up",
    },
    {
        place: 3,
        icon: "🥉",
        title: "Explorer",
    },
];

/* ==========================================================
   Sistema de Recompensas
========================================================== */

export const REWARDS = {
    bronze: {
        stars: 1,
        minAccuracy: 50,
    },
    silver: {
        stars: 2,
        minAccuracy: 75,
    },
    gold: {
        stars: 3,
        minAccuracy: 90,
    },
};
