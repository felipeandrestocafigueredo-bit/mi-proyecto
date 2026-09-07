/* ==========================================================
   BINGO
   HOOKS
   Arquitectura Oficial 3.0
========================================================== */

import { useState } from "react";

import { BINGO_MESSAGES } from "./data";

import { BoardCell } from "./utils";

export interface BingoState {
    board: BoardCell[];
    currentWord: VocabItem | null;
    score: number;
    progress: number;
    marked: number;
    total: number;
    timeLeft: number;
    lives: number;
    playing: boolean;
    finished: boolean;
    message: string;
}

export interface BingoActions {
    setBoard: React.Dispatch<React.SetStateAction<BoardCell[]>>;
    setCurrentWord: React.Dispatch<React.SetStateAction<VocabItem | null>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    setMarked: React.Dispatch<React.SetStateAction<number>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    resetGame: () => void;
}

interface VocabItem {
    word: string;
    emoji?: string;
    image?: string;
}

export default function useBingo(): BingoState & BingoActions {

    const [board, setBoard] = useState<BoardCell[]>([]);

    const [currentWord, setCurrentWord] = useState<VocabItem | null>(null);

    const [score, setScore] = useState<number>(0);

    const [progress, setProgress] = useState<number>(0);

    const [marked, setMarked] = useState<number>(0);

    const [total, setTotal] = useState<number>(0);

    const [timeLeft, setTimeLeft] = useState<number>(90);

    const [lives, setLives] = useState<number>(3);

    const [playing, setPlaying] = useState<boolean>(false);

    const [finished, setFinished] = useState<boolean>(false);

    const [message, setMessage] = useState<string>(
        BINGO_MESSAGES.START
    );

    function resetGame(): void {

        setBoard([]);

        setCurrentWord(null);

        setScore(0);

        setProgress(0);

        setMarked(0);

        setTotal(0);

        setTimeLeft(90);

        setLives(3);

        setPlaying(false);

        setFinished(false);

        setMessage(BINGO_MESSAGES.START);

    }

    return {

        board,
        setBoard,

        currentWord,
        setCurrentWord,

        score,
        setScore,

        progress,
        setProgress,

        marked,
        setMarked,

        total,
        setTotal,

        timeLeft,
        setTimeLeft,

        lives,
        setLives,

        playing,
        setPlaying,

        finished,
        setFinished,

        message,
        setMessage,

        resetGame,

    };

}
