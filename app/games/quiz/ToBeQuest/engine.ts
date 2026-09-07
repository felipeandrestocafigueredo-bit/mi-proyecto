import {
    calculateAccuracy,
    calculateStars,
    calculateScore,
    calculateProgress,
} from "./utils";

import { GAME_CONFIG } from "./data";

import type { ToBeQuestState, ToBeQuestActions, ToBeQuestStats } from "./hooks";

/* ==========================================================
   TO BE QUEST
   ENGINE
   Arquitectura 3.0
========================================================== */

export interface ToBeEngineReturn {
    current: any;
    checkAnswer: (answer: string) => boolean;
    next: () => void;
    finishQuiz: () => {
        score: number;
        correct: number;
        total: number;
        wrong: number;
        coins: number;
        streak: number;
        accuracy: number;
        stars: number;
    };
}

export interface ToBeEngineProps {
    questions: any[];
    quiz: ToBeQuestState & ToBeQuestActions;
}

export default function ToBeEngine({
    questions = [],
    quiz,
}: ToBeEngineProps): ToBeEngineReturn {

    /*=========================================================
        Pregunta actual
    =========================================================*/

    const current: any =
        questions[quiz.currentQuestion] || null;

    /*=========================================================
        Validar respuesta
    =========================================================*/

    function checkAnswer(answer: string): boolean {

        if (!current) return false;

        const correct: boolean =
            answer === current.correct;

        const stats: ToBeQuestStats = {
            ...quiz.stats,
        };

        if (correct) {

            stats.correct += 1;

            stats.streak += 1;

            stats.coins += 1;

        } else {

            stats.wrong += 1;

            stats.streak = 0;

        }

        stats.score = calculateScore(
            stats.correct,
            stats.streak,
            GAME_CONFIG
        );

        stats.progress = calculateProgress(
            quiz.currentQuestion,
            questions.length
        );

        quiz.updateStats(stats);

        return correct;

    }

    /*=========================================================
        Siguiente pregunta
    =========================================================*/

    function next(): void {

        if (
            quiz.currentQuestion + 1 >=
            questions.length
        ) {
            quiz.finishGame();
            return;
        }

        quiz.nextQuestion();

    }

    /*=========================================================
        Resultado final
    =========================================================*/

    function finishQuiz() {

        const accuracy = calculateAccuracy(
            quiz.stats.correct,
            questions.length
        );

        const stars = calculateStars(
            quiz.stats.correct,
            questions.length
        );

        return {
            score: quiz.stats.score,
            correct: quiz.stats.correct,
            total: questions.length,
            wrong: quiz.stats.wrong,
            coins: quiz.stats.coins,
            streak: quiz.stats.streak,
            accuracy,
            stars,
        };

    }

    /*=========================================================
        API
    =========================================================*/

    return {

        current,

        checkAnswer,

        next,

        finishQuiz,

    };

}
