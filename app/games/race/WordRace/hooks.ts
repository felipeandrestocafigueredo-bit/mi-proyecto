import { useState, useCallback } from "react";

import {

    WORDRACE_CONFIG,

} from "./data";

import {

    calculateProgress,

    clearLetters,

} from "./utils";

import { VocabWord } from "./data";

/* ==========================================================
   WORD RACE
   HOOKS
   Arquitectura 3.0
========================================================== */

export interface WordRaceStats {
    score: number;
    lives: number;
    current: number;
    total: number;
    progress: number;
    timeLeft: number;
}

export interface WordRaceState {
    words: VocabWord[];
    currentWord: VocabWord | null;
    letters: string[];
    score: number;
    lives: number;
    current: number;
    total: number;
    progress: number;
    timeLeft: number;
    playing: boolean;
    finished: boolean;
    message: string;
}

export interface WordRaceActions {
    setWords: React.Dispatch<React.SetStateAction<VocabWord[]>>;
    setCurrentWord: React.Dispatch<React.SetStateAction<VocabWord | null>>;
    setLetters: React.Dispatch<React.SetStateAction<string[]>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    startGame: (deck: VocabWord[]) => void;
    updateLetters: (value: string[]) => void;
    resetLetters: () => void;
    updateProgress: (currentRound: number, totalRounds: number) => void;
    restart: () => void;
}

export default function useWordRace(): WordRaceState & WordRaceActions {

    /*=========================================================
        Estados principales
    =========================================================*/

    const [words, setWords] = useState<VocabWord[]>([]);

    const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);

    const [letters, setLetters] = useState<string[]>([]);

    const [score, setScore] = useState<number>(0);

    const [lives, setLives] = useState<number>(
        WORDRACE_CONFIG.MAX_LIVES
    );

    const [current, setCurrent] = useState<number>(0);

    const [total, setTotal] = useState<number>(0);

    const [progress, setProgress] = useState<number>(0);

    const [timeLeft, setTimeLeft] = useState<number>(
        WORDRACE_CONFIG.ROUND_TIME
    );

    const [playing, setPlaying] = useState<boolean>(false);

    const [finished, setFinished] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("");

    /*=========================================================
        Iniciar juego
    =========================================================*/

    const startGame = useCallback(
        (deck: VocabWord[] = []) => {
            setWords(deck);

            setCurrentWord(null);

            setLetters([]);

            setScore(0);

            setLives(
                WORDRACE_CONFIG.MAX_LIVES
            );

            setCurrent(0);

            setTotal(deck.length);

            setProgress(0);

            setTimeLeft(
                WORDRACE_CONFIG.ROUND_TIME
            );

            setMessage("");

            setPlaying(true);

            setFinished(false);

        },
        []
    );

    /*=========================================================
        Actualizar letras
    =========================================================*/

    const updateLetters = useCallback(
        (value: string[]): void => {
            setLetters(value);
        },
        []
    );

    /*=========================================================
        Limpiar letras
    =========================================================*/

    const resetLetters = useCallback((): void => {
        setLetters(
            clearLetters([])
        );
    }, []);

    /*=========================================================
        Actualizar progreso
    =========================================================*/

    const updateProgress = useCallback(
        (currentRound: number, totalRounds: number): void => {
            setProgress(
                calculateProgress(
                    currentRound,
                    totalRounds
                )
            );
        },
        []
    );

    /*=========================================================
        Reiniciar juego
    =========================================================*/

    const restart = useCallback((): void => {
        setWords([]);

        setCurrentWord(null);

        setLetters([]);

        setScore(0);

        setLives(
            WORDRACE_CONFIG.MAX_LIVES
        );

        setCurrent(0);

        setTotal(0);

        setProgress(0);

        setTimeLeft(
            WORDRACE_CONFIG.ROUND_TIME
        );

        setMessage("");

        setPlaying(false);

        setFinished(false);

    }, []);

    return {

        words,
        setWords,

        currentWord,
        setCurrentWord,

        letters,
        setLetters,

        score,
        setScore,

        lives,
        setLives,

        current,
        setCurrent,

        total,
        setTotal,

        progress,
        setProgress,

        timeLeft,
        setTimeLeft,

        playing,
        setPlaying,

        finished,
        setFinished,

        message,
        setMessage,

        startGame,

        updateLetters,

        resetLetters,

        updateProgress,

        restart,

    };

}
