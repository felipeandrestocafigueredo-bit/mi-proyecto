import { GAME_CONFIG } from "./data";

import {

    calculateProgress,

    calculateScore,

} from "./utils";

import type {

    FinalChallengeState,

    FinalChallengeActions,

    FinalChallengeStats,

} from "./hooks";

/* ==========================================================
   FINAL CHALLENGE
   ENGINE
   Arquitectura 3.0
========================================================== */

export interface FinalChallengeEngineReturn {
    current: any;
    checkAnswer: (answer: string) => boolean;
    next: () => void;
    timeout: () => void;
    addBonusTime: () => void;
    finish: () => void;
    restart: (questions: any[]) => void;
}

export interface FinalChallengeEngineProps {
    world?: {
        id: string;
        name: string;
        icon: string;
        grad: [string, string];
        description?: string;
        questions: any[];
    };
    game: FinalChallengeState & FinalChallengeActions;
}

export default function FinalChallengeEngine({
    world,
    game,
}: FinalChallengeEngineProps): FinalChallengeEngineReturn {

    /*=========================================================
        Pregunta actual
    =========================================================*/

    const current: any =
        game.questions[game.currentQuestion];

    /*=========================================================
        Validar respuesta
    =========================================================*/

    function checkAnswer(answer: string): boolean {

        if (!current) return false;

        const correct: boolean =
            answer === current.correct;

        if (correct) {

            const streak: number =
                game.stats.streak + 1;

            const score: number = calculateScore(
                game.stats.correct + 1,
                streak,
                GAME_CONFIG
            );

            game.updateStats({

                correct:
                    game.stats.correct + 1,

                streak,

                coins:
                    game.stats.coins +
                    GAME_CONFIG.coinReward,

                score,

                progress:
                    calculateProgress(
                        game.currentQuestion,
                        game.questions.length
                    ),

            });

        } else {

            game.loseLife();

            game.updateStats({

                wrong:
                    game.stats.wrong + 1,

                streak: 0,

                score:
                    game.stats.score +
                    GAME_CONFIG.scoreWrong,

                progress:
                    calculateProgress(
                        game.currentQuestion,
                        game.questions.length
                    ),

            });

        }

        return correct;

    }

    /*=========================================================
        Siguiente pregunta
    =========================================================*/

    function next(): void {

        if (
            game.currentQuestion + 1 >=
            game.questions.length
        ) {
            finish();
            return;
        }

        game.nextQuestion();

    }

    /*=========================================================
        Tiempo agotado
    =========================================================*/

    function timeout(): void {

        game.loseLife();

        game.updateStats({

            wrong:
                game.stats.wrong + 1,

            streak: 0,

        });

        if (
            game.stats.lives - 1 <= 0
        ) {
            finish();
            return;
        }

        next();

    }

    /*=========================================================
        Bonus de tiempo
    =========================================================*/

    function addBonusTime(): void {

        game.setTimeLeft(
            (time: number) =>
                time +
                GAME_CONFIG.bonusTime
        );

    }

    /*=========================================================
        Finalizar juego
    =========================================================*/

    function finish(): void {

        game.finishGame();

    }

    /*=========================================================
        Reiniciar
    =========================================================*/

    function restart(questions: any[]): void {

        game.loadQuestions(
            questions
        );

    }

    /*=========================================================
        Exportar
    =========================================================*/

    return {

        current,

        checkAnswer,

        next,

        timeout,

        addBonusTime,

        finish,

        restart,

    };

}
