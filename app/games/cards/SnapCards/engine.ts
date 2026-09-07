/* ==========================================================
   SNAP CARDS
   ENGINE
   Arquitectura 3.0
========================================================== */

import {

    SNAP_CONFIG,

    SNAP_MESSAGES,

    SNAP_ANIMATIONS,

} from "./data";

import {

    randomTarget,

    calculateScore,

    loseLife,

    calculateStars,

    isCorrectCard,

    isGameFinished,

} from "./utils";

import { CardData, SnapGameState } from "../types";

export interface SnapEngineReturn {
    start: () => void;
    nextRound: () => void;
    selectCard: (card: CardData) => void;
    timeout: () => void;
    finishGame: () => void;
    restart: () => void;
    getResults: () => {
        score: number;
        lives: number;
        rounds: number;
        total: number;
        stars: number;
    };
}

export default function SnapEngine({
    vocabulary = [],
    game,
}: {
    vocabulary: CardData[];
    game: SnapGameState;
}): SnapEngineReturn {

    /*=========================================================
        Seleccionar nueva carta objetivo
    =========================================================*/

    function nextRound(): void {

        const target = randomTarget(vocabulary);

        game.setTarget(target);

        game.setCurrent((value: number) => {

            const next = value + 1;

            game.updateProgress(
                next,
                vocabulary.length
            );

            return next;

        });

    }

    /*=========================================================
        Iniciar partida
    =========================================================*/

    function start(): void {

        game.startGame(vocabulary);

        nextRound();

    }

    /*=========================================================
        Seleccionar carta
    =========================================================*/

    function selectCard(card: CardData): void {

        if (
            game.finished ||
            !game.playing ||
            !game.target
        ) {
            return;
        }

        const correct = isCorrectCard(
            card,
            game.target
        );

        if (correct) {

            game.setScore((score: number) =>
                calculateScore(
                    score,
                    true
                )
            );

            game.setMessage(
                SNAP_MESSAGES.CORRECT[
                    Math.floor(
                        Math.random() *
                        SNAP_MESSAGES.CORRECT.length
                    )
                ]
            );

            if (
                game.current >=
                vocabulary.length
            ) {
                finishGame();
            } else {
                setTimeout(
                    () => {
                        nextRound();
                    },
                    SNAP_ANIMATIONS.NEXT_ROUND
                );
            }

        } else {

            game.setLives((lives: number) => {
                const nextLives = loseLife(
                    lives
                );

                if (
                    nextLives <= 0
                ) {
                    setTimeout(
                        finishGame,
                        500
                    );
                }

                return nextLives;
            });

            game.setScore((score: number) =>
                calculateScore(
                    score,
                    false
                )
            );

            game.setMessage(
                SNAP_MESSAGES.WRONG[
                    Math.floor(
                        Math.random() *
                        SNAP_MESSAGES.WRONG.length
                    )
                ]
            );

        }

    }

    /*=========================================================
        Tiempo agotado
    =========================================================*/

    function timeout(): void {

        game.setPlaying(false);

        game.setFinished(true);

    }

    /*=========================================================
        Finalizar juego
    =========================================================*/

    function finishGame(): void {

        game.setPlaying(false);

        game.setFinished(true);

    }

    /*=========================================================
        Reiniciar
    =========================================================*/

    function restart(): void {

        game.restart();

        start();

    }

    /*=========================================================
        Resultado final
    =========================================================*/

    function getResults() {

        return {
            score: game.score,
            lives: game.lives,
            rounds: game.current,
            total: vocabulary.length,
            stars: calculateStars(
                game.current,
                vocabulary.length
            ),
        };

    }

    return {

        start,

        nextRound,

        selectCard,

        timeout,

        finishGame,

        restart,

        getResults,

    };

}
