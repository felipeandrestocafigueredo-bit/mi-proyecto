import { useState, useEffect } from "react";

import { createInitialStats } from "./utils";

import { GAME_CONFIG } from "./data";

/* ==========================================================
   TO BE QUEST
   HOOKS
   Arquitectura 3.0
========================================================== */

export interface ToBeQuestStats {
    score: number;
    correct: number;
    wrong: number;
    streak: number;
    stars: number;
    accuracy: number;
    progress: number;
    coins: number;
}

export interface ToBeQuestState {
    questions: any[];
    currentQuestion: number;
    selectedAnswer: string | null;
    timeLeft: number;
    finished: boolean;
    stats: ToBeQuestStats;
}

export interface ToBeQuestActions {
    loadQuestions: (list: any[]) => void;
    selectAnswer: (answer: string) => void;
    nextQuestion: () => void;
    updateStats: (newStats: Partial<ToBeQuestStats>) => void;
    finishGame: () => void;
    reset: () => void;
}

export default function useToBeQuest(): ToBeQuestState & ToBeQuestActions {

    /*=========================================================
        Estados principales
    =========================================================*/

    const [questions, setQuestions] = useState<any[]>([]);

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [timeLeft, setTimeLeft] = useState<number>(
        GAME_CONFIG.TIME_PER_QUESTION
    );

    const [finished, setFinished] = useState<boolean>(false);

    const [stats, setStats] = useState<ToBeQuestStats>(
        createInitialStats()
    );

    /*=========================================================
        Temporizador
    =========================================================*/

    useEffect(() => {

        if (finished) return;

        if (!questions.length) return;

        const timer = setInterval(() => {

            setTimeLeft((value: number) => {

                if (value <= 1) {

                    clearInterval(timer);

                    return 0;

                }

                return value - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [
        currentQuestion,
        finished,
        questions,
    ]);

    /*=========================================================
        Funciones públicas
    =========================================================*/

    function loadQuestions(list: any[]): void {

        setQuestions(list);

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setFinished(false);

        setTimeLeft(
            GAME_CONFIG.TIME_PER_QUESTION
        );

        setStats(
            createInitialStats()
        );

    }

    function selectAnswer(answer: string): void {

        setSelectedAnswer(answer);

    }

    function nextQuestion(): void {

        setSelectedAnswer(null);

        setCurrentQuestion((value: number) => value + 1);

        setTimeLeft(
            GAME_CONFIG.TIME_PER_QUESTION
        );

    }

    function updateStats(newStats: Partial<ToBeQuestStats>): void {

        setStats((prev) => ({
            ...prev,
            ...newStats,
        }));

    }

    function finishGame(): void {

        setFinished(true);

    }

    function reset(): void {

        setQuestions([]);

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setFinished(false);

        setTimeLeft(
            GAME_CONFIG.TIME_PER_QUESTION
        );

        setStats(
            createInitialStats()
        );

    }

    /*=========================================================
        API del Hook
    =========================================================*/

    return {

        questions,

        currentQuestion,

        selectedAnswer,

        timeLeft,

        finished,

        stats,

        loadQuestions,

        selectAnswer,

        nextQuestion,

        updateStats,

        finishGame,

        reset,

    };

}
