import {
    calculateScore,
    calculateStars,
    calculateCoins,
    calculateAccuracy,
    isCorrectAnswer,
} from "./utils";

import type { QuizState, QuizActions, QuizStats } from "./hooks";

/* ==========================================================
   QUIZ MULTIPLE
   Arquitectura 3.0
   Engine
========================================================== */

export interface QuizEngineReturn {
    current: any;
    questions: any[];
    checkAnswer: (answer: string) => boolean;
    finishQuiz: () => {
        score: number;
        correct: number;
        wrong: number;
        coins: number;
        stars: number;
        accuracy: number;
        progress: number;
    };
    restart: () => void;
    next: () => void;
    tick: () => void;
}

export interface QuizEngineProps {
    questions: any[];
    quiz: QuizState & QuizActions;
}

export default function QuizEngine({
    questions = [],
    quiz,
}: QuizEngineProps): QuizEngineReturn {

    /*=========================================================
        Obtener pregunta actual
    =========================================================*/

    const current: any = questions[quiz.currentQuestion];

    /*=========================================================
        Validar respuesta
    =========================================================*/

    function checkAnswer(answer: string): boolean {

        if (!current) return false;

        const correct: boolean = isCorrectAnswer(
            answer,
            current.correct
        );

        const oldStats: QuizStats = quiz.stats;

        const nextCorrect: number = correct
            ? oldStats.correct + 1
            : oldStats.correct;

        const nextWrong: number = correct
            ? oldStats.wrong
            : oldStats.wrong + 1;

        const nextStreak: number = correct
            ? oldStats.streak + 1
            : 0;

        const nextScore: number = calculateScore(
            nextCorrect,
            nextStreak
        );

        quiz.updateStats({
            correct: nextCorrect,
            wrong: nextWrong,
            streak: nextStreak,
            score: nextScore,
        });

        return correct;

    }

    /*=========================================================
        Finalizar Quiz
    =========================================================*/

    function finishQuiz() {

        const stats: QuizStats = quiz.stats;

        const accuracy: number = calculateAccuracy(
            stats.correct,
            questions.length
        );

        const stars: number = calculateStars(
            stats.correct,
            questions.length
        );

        const coins: number = calculateCoins(
            stars
        );

        quiz.updateStats({
            accuracy,
            stars,
            coins,
            progress: 100,
        });

        return {
            ...quiz.stats,
            accuracy,
            stars,
            coins,
        };

    }

    /*=========================================================
        Reiniciar
    =========================================================*/

    function restart(): void {

        quiz.restartGame();

    }

    /*=========================================================
        Siguiente pregunta
    =========================================================*/

    function next(): void {

        quiz.updateProgress();

        quiz.nextQuestion();

    }

    /*=========================================================
        Temporizador
    =========================================================*/

    function tick(): void {

        if (quiz.timeLeft <= 0) {
            next();
            return;
        }

        quiz.updateTime(
            quiz.timeLeft - 1
        );

    }

    /*=========================================================
        Return
    =========================================================*/

    return {

        current,

        questions,

        checkAnswer,

        finishQuiz,

        restart,

        next,

        tick,

    };

}
