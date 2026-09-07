/* ==========================================================
   QUIZ MULTIPLE
   Arquitectura 3.0
   Data
========================================================== */

export interface WorldItem {
    id: string;
    title: string;
    subtitle: string;
    color: string;
    icon: string;
    questions: any[];
    grad?: [string, string];
}

export const QUIZ_WORLDS: WorldItem[] = [
    {
        id: "world1",
        title: "Week 1",
        subtitle: "Vocabulary",
        color: "#4F46E5",
        icon: "📘",
        questions: []
    },
    {
        id: "world2",
        title: "Week 2",
        subtitle: "Grammar",
        color: "#0EA5E9",
        icon: "✏️",
        questions: []
    },
    {
        id: "world3",
        title: "Week 3",
        subtitle: "Practice",
        color: "#10B981",
        icon: "🎯",
        questions: []
    },
    {
        id: "world4",
        title: "Week 4",
        subtitle: "Challenge",
        color: "#F59E0B",
        icon: "🏆",
        questions: []
    }
];

/* ==========================================================
   Configuración general
========================================================== */

export interface QuizConfig {
    lives: number;
    timePerQuestion: number;
    scoreCorrect: number;
    bonusPerfect: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showProgress: boolean;
    showTimer: boolean;
    showFeedback: boolean;
}

export const QUIZ_CONFIG: QuizConfig = {
    lives: 3,
    timePerQuestion: 20,
    scoreCorrect: 10,
    bonusPerfect: 50,
    shuffleQuestions: true,
    shuffleOptions: true,
    showProgress: true,
    showTimer: true,
    showFeedback: true,
};

/* ==========================================================
   Mensajes positivos
========================================================== */

export const POSITIVE_MESSAGES: string[] = [
    "Excellent! 🎉",
    "Very Good! ⭐",
    "Awesome! 🚀",
    "Great Job! 🏆",
    "Perfect! 💯",
    "Keep Going! 🔥"
];

/* ==========================================================
   Mensajes negativos
========================================================== */

export const NEGATIVE_MESSAGES: string[] = [
    "Try Again 💪",
    "Almost 😄",
    "Don't Give Up ⭐",
    "Keep Practicing 📚",
    "Next One 🚀"
];

/* ==========================================================
   Sonidos
========================================================== */

export const QUIZ_SOUNDS = {
    correct: "correct",
    wrong: "wrong",
    click: "click",
    finish: "finish"
};

/* ==========================================================
   Colores
========================================================== */

export const QUIZ_COLORS = {
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
    dark: "#1F2937"
};
