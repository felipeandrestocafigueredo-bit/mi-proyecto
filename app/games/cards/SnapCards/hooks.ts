import { useState, useCallback } from "react";

import {
    SNAP_CONFIG,
} from "./data";

import {
    calculateProgress,
    resetCards,
} from "./utils";

import { CardData } from "../types";

/* ==========================================================
   SNAP CARDS
   HOOKS
   Arquitectura 3.0
========================================================== */

export interface SnapCardsState {
    cards: CardData[];
    target: CardData | null;
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

export interface SnapCardsActions {
    setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
    setTarget: React.Dispatch<React.SetStateAction<CardData | null>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    startGame: (deck: CardData[]) => void;
    updateProgress: (currentRound: number, totalRounds: number) => void;
    restart: () => void;
}

export default function useSnapCards(): SnapCardsState & SnapCardsActions {

    /*=========================================================
        Estados principales
    =========================================================*/

    const [cards, setCards] = useState<CardData[]>([]);

    const [target, setTarget] = useState<CardData | null>(null);

    const [score, setScore] = useState<number>(0);

    const [lives, setLives] = useState<number>(
        SNAP_CONFIG.MAX_LIVES
    );

    const [current, setCurrent] = useState<number>(0);

    const [total, setTotal] = useState<number>(0);

    const [progress, setProgress] = useState<number>(0);

    const [timeLeft, setTimeLeft] = useState<number>(
        SNAP_CONFIG.ROUND_TIME
    );

    const [playing, setPlaying] = useState<boolean>(false);

    const [finished, setFinished] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("");

    /*=========================================================
        Iniciar juego
    =========================================================*/

    const startGame = useCallback(
        (deck: CardData[] = []) => {
            const cleanDeck = resetCards(deck);

            setCards(cleanDeck);

            setTarget(null);

            setScore(0);

            setLives(SNAP_CONFIG.MAX_LIVES);

            setCurrent(0);

            setTotal(cleanDeck.length);

            setProgress(0);

            setTimeLeft(
                SNAP_CONFIG.ROUND_TIME
            );

            setMessage("");

            setPlaying(true);

            setFinished(false);

        },
        []
    );

    /*=========================================================
        Actualizar progreso
    =========================================================*/

    const updateProgress = useCallback(
        (currentRound: number, totalRounds: number) => {
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
        Reiniciar
    =========================================================*/

    const restart = useCallback(() => {
        setCards([]);

        setTarget(null);

        setScore(0);

        setLives(SNAP_CONFIG.MAX_LIVES);

        setCurrent(0);

        setTotal(0);

        setProgress(0);

        setTimeLeft(
            SNAP_CONFIG.ROUND_TIME
        );

        setMessage("");

        setPlaying(false);

        setFinished(false);

    }, []);

    return {

        cards,
        setCards,

        target,
        setTarget,

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

        updateProgress,

        restart,

    };

}
