import { useState, useCallback } from "react";

import {
    createInitialStats,
    calculateProgress,
} from "./utils";

/* ==========================================================
   QUIZ MULTIPLE
   Arquitectura 3.0
   Hook principal
========================================================== */

export interface QuizStats {
    score: number;
    correct: number;
    wrong: number;
    streak: number;
    coins: number;
    stars: number;
    progress: number;
    accuracy: number;
}

export interface QuizState {
    currentQuestion: number;
    selectedAnswer: string | null;
    finished: boolean;
    stats: QuizStats;
    questions: any[];
    timeLeft: number;
    loading: boolean;
}

export interface QuizActions {
    loadQuestions: (list: any[]) => void;
    selectAnswer: (answer: string) => void;
    nextQuestion: () => void;
    restartGame: () => void;
    reset: () => void;
    updateStats: (data: Partial<QuizStats>) => void;
    updateTime: (value: number) => void;
    updateProgress: () => void;
    startLoading: () => void;
    stopLoading: () => void;
}

export default function useQuiz(): QuizState & QuizActions {

    /*=========================================================
        Estados
    =========================================================*/

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [finished, setFinished] = useState<boolean>(false);

    const [stats, setStats] = useState<QuizStats>(
        createInitialStats()
    );

    const [questions, setQuestions] = useState<any[]>([]);

    const [timeLeft, setTimeLeft] = useState<number>(20);

    const [loading, setLoading] = useState<boolean>(false);

    /*=========================================================
        Cargar preguntas
    =========================================================*/

    const loadQuestions = useCallback((list: any[]): void => {

        setQuestions(list);

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setFinished(false);

        setStats(createInitialStats());

        setTimeLeft(20);

    }, []);

    /*=========================================================
        Seleccionar respuesta
    =========================================================*/

    const selectAnswer = useCallback((answer: string): void => {

        setSelectedAnswer(answer);

    }, []);

    /*=========================================================
        Siguiente pregunta
    =========================================================*/

    const nextQuestion = useCallback((): void => {

        if (currentQuestion + 1 >= questions.length) {

            setFinished(true);

            return;

        }

        setCurrentQuestion((prev: number) => prev + 1);

        setSelectedAnswer(null);

        setTimeLeft(20);

    }, [currentQuestion, questions.length]);

    /*=========================================================
        Reiniciar juego
    =========================================================*/

    const restartGame = useCallback((): void => {

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setFinished(false);

        setStats(createInitialStats());

        setTimeLeft(20);

    }, []);

    const reset = useCallback((): void => {

        setQuestions([]);

        setCurrentQuestion(0);

        setSelectedAnswer(null);

        setFinished(false);

        setStats(createInitialStats());

        setTimeLeft(20);

        setLoading(false);

    }, []);

    /*=========================================================
        Actualizar estadísticas
    =========================================================*/

    const updateStats = useCallback((data: Partial<QuizStats>): void => {

        setStats((prev) => ({
            ...prev,
            ...data,
        }));

    }, []);

    /*=========================================================
        Actualizar tiempo
    =========================================================*/

    const updateTime = useCallback((value: number): void => {

        setTimeLeft(value);

    }, []);

    /*=========================================================
        Actualizar progreso
    =========================================================*/

    const updateProgress = useCallback((): void => {

        setStats((prev) => ({
            ...prev,
            progress: calculateProgress(
                currentQuestion + 1,
                questions.length
            ),
        }));

    }, [currentQuestion, questions.length]);

    /*=========================================================
        Loading
    =========================================================*/

    const startLoading = (): void => {

        setLoading(true);

    };

    const stopLoading = (): void => {

        setLoading(false);

    };

    /*=========================================================
        Return
    =========================================================*/

    return {

        currentQuestion,

        selectedAnswer,

        finished,

        stats,

        questions,

        timeLeft,

        loading,

        loadQuestions,

        selectAnswer,

        nextQuestion,

        restartGame,

        reset,

        updateStats,

        updateTime,

        updateProgress,

        startLoading,

        stopLoading,

    };

}
