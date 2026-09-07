/* ==========================================================
   WORD RACE
   ENGINE
   Arquitectura 3.0
========================================================== */

import {

    WORDRACE_CONFIG,

    WORDRACE_MESSAGES,

} from "./data";

import {

    shuffleWords,

    randomWord,

    calculateScore,

    calculateStars,

    loseLife,

    isCorrectWord,

} from "./utils";

import { VocabWord } from "./data";
import { WordRaceState, WordRaceActions } from "./hooks";

export interface WordRaceEngineReturn {
    start: () => void;
    nextRound: () => void;
    checkAnswer: (answer: string) => void;
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

export interface WordRaceEngineProps {
    vocabulary: VocabWord[];
    game: WordRaceState & WordRaceActions;
}

export default function WordRaceEngine({
    vocabulary = [],
    game,
}: WordRaceEngineProps): WordRaceEngineReturn {

    /*=========================================================
        Nueva ronda
    =========================================================*/

    function nextRound(): void {

        const word = randomWord(
            vocabulary
        );

        game.setCurrentWord(word);

        game.resetLetters();

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
        Iniciar juego
    =========================================================*/

    function start(): void {

        const deck = shuffleWords(
            vocabulary
        );

        game.startGame(deck);

        nextRound();

    }

    /*=========================================================
        Validar respuesta
    =========================================================*/

    function checkAnswer(answer: string): void {

        if (
            !game.currentWord ||
            game.finished ||
            !game.playing
        ) {
            return;
        }

        const expected: string =
            game.currentWord.word ||
            game.currentWord.text ||
            "";

        const correct: boolean = isCorrectWord(
            answer,
            expected
        );

        if (correct) {

            game.setScore((score: number) =>
                calculateScore(
                    score,
                    true
                )
            );

            game.setMessage(
                WORDRACE_MESSAGES.CORRECT[
                    Math.floor(
                        Math.random() *
                        WORDRACE_MESSAGES.CORRECT.length
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
                    WORDRACE_CONFIG.BONUS_TIME * 200
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
                WORDRACE_MESSAGES.WRONG[
                    Math.floor(
                        Math.random() *
                        WORDRACE_MESSAGES.WRONG.length
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

        game.setMessage(
            WORDRACE_MESSAGES.TIME
        );

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
        Resultados
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

        checkAnswer,

        timeout,

        finishGame,

        restart,

        getResults,

    };

}
