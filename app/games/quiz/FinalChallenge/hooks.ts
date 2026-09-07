import { useState } from "react";

import { GAME_CONFIG } from "./data";

/* ==========================================================
   FINAL CHALLENGE
   HOOK
   Arquitectura 3.0
========================================================== */

export interface FinalChallengeStats {
    score: number;
    coins: number;
    correct: number;
    wrong: number;
    streak: number;
    progress: number;
    lives: number;
}

export interface FinalChallengeState {
    questions: any[];
    currentQuestion: number;
    selectedAnswer: string | null;
    gameOver: boolean;
    finished: boolean;
    timeLeft: number;
    stats: FinalChallengeStats;
}

export interface FinalChallengeActions {
    loadQuestions: (list: any[]) => void;
    selectAnswer: (answer: string) => void;
    nextQuestion: () => void;
    updateStats: (values: Partial<FinalChallengeStats>) => void;
    loseLife: () => void;
    resetTimer: () => void;
    finishGame: () => void;
    endGame: () => void;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export default function useFinalChallenge(): FinalChallengeState & FinalChallengeActions {

    /*=========================================================
        Preguntas
    =========================================================*/

    const [questions, setQuestions] = useState<any[]>([]);

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    /*=========================================================
        Respuesta
    =========================================================*/

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    /*=========================================================
        Juego
    =========================================================*/

    const [gameOver, setGameOver] = useState<boolean>(false);

    const [finished, setFinished] = useState<boolean>(false);

    /*=========================================================
        Tiempo
    =========================================================*/

    const [timeLeft, setTimeLeft] = useState<number>(
        GAME_CONFIG.initialTime
    );

    /*=========================================================
        Estadísticas
    =========================================================*/

    const [stats, setStats] = useState<FinalChallengeStats>({

        score: 0,

        coins: 0,

        correct: 0,

        wrong: 0,

        streak: 0,

        progress: 0,

        lives: GAME_CONFIG.lives,

    });

    /*=========================================================
        Cargar preguntas
    =========================================================*/

    function loadQuestions(list: any[]): void {

        setQuestions(list);

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setFinished(false);

        setGameOver(false);

        setTimeLeft(
            GAME_CONFIG.initialTime
        );

        setStats({

            score: 0,

            coins: 0,

            correct: 0,

            wrong: 0,

            streak: 0,

            progress: 0,

            lives: GAME_CONFIG.lives,

        });

    }

    /*=========================================================
        Respuesta seleccionada
    =========================================================*/

    function selectAnswer(answer: string): void {

        setSelectedAnswer(answer);

    }

    /*=========================================================
        Siguiente pregunta
    =========================================================*/

    function nextQuestion(): void {

        setCurrentQuestion((q: number) => q + 1);

        setSelectedAnswer(null);

        setTimeLeft(
            GAME_CONFIG.initialTime
        );

    }

    /*=========================================================
        Actualizar estadísticas
    =========================================================*/

    function updateStats(values: Partial<FinalChallengeStats>): void {

        setStats((prev) => ({
            ...prev,
            ...values,
        }));

    }

    /*=========================================================
        Restar vida
    =========================================================*/

    function loseLife(): void {

        setStats((prev) => {
            const lives = prev.lives - 1;
            return {
                ...prev,
                lives,
            };
        });

    }

    /*=========================================================
        Reiniciar tiempo
    =========================================================*/

    function resetTimer(): void {

        setTimeLeft(
            GAME_CONFIG.initialTime
        );

    }

    /*=========================================================
        Estado final
    =========================================================*/

    function finishGame(): void {

        setFinished(true);

    }

    function endGame(): void {

        setGameOver(true);

    }

    /*=========================================================
        Exportar
    =========================================================*/

    return {

        questions,

        currentQuestion,

        selectedAnswer,

        gameOver,

        finished,

        timeLeft,

        stats,

        loadQuestions,

        selectAnswer,

        nextQuestion,

        updateStats,

        loseLife,

        resetTimer,

        finishGame,

        endGame,

        setTimeLeft,

    };

}
