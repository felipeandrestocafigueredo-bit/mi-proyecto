/*
=========================================================

PANDY MEMORY
HOOK
Arquitectura Oficial 3.0

Gestiona todo el estado del juego.

=========================================================
*/

import { useState } from "react";

import { MEMORY_CONFIG } from "./data";

import { CardItem } from "./types";

export interface MemoryStats {
    matches: number;
    attempts: number;
    score: number;
}

export interface MemoryState {
    cards: CardItem[];
    playing: boolean;
    finished: boolean;
    won: boolean;
    flipped: string[];
    matched: string[];
    score: number;
    combo: number;
    lives: number;
    timeLeft: number;
    message: string;
    stats: MemoryStats;
    totalPairs: number;
    progress: number;
}

export interface MemoryActions {
    setCards: React.Dispatch<React.SetStateAction<CardItem[]>>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setWon: React.Dispatch<React.SetStateAction<boolean>>;
    setFlipped: React.Dispatch<React.SetStateAction<string[]>>;
    setMatched: React.Dispatch<React.SetStateAction<string[]>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setCombo: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setStats: React.Dispatch<React.SetStateAction<MemoryStats>>;
    startGame: (deck: CardItem[]) => void;
    restart: () => void;
    flip: (id: string) => void;
    unflip: () => void;
    match: (a: string, b: string) => void;
    addAttempt: () => void;
    addScore: (points: number) => void;
    addCombo: () => void;
    resetCombo: () => void;
    removeLife: () => void;
    showMessage: (text: string) => void;
    finish: (win: boolean) => void;
}

export default function useMemory(): MemoryState & MemoryActions {

    /*======================================================
        Estado del juego
    ======================================================*/

    const [cards, setCards] = useState<CardItem[]>([]);

    const [playing, setPlaying] = useState<boolean>(false);

    const [finished, setFinished] = useState<boolean>(false);

    const [won, setWon] = useState<boolean>(false);

    const [flipped, setFlipped] = useState<string[]>([]);

    const [matched, setMatched] = useState<string[]>([]);

    const [score, setScore] = useState<number>(0);

    const [combo, setCombo] = useState<number>(0);

    const [lives, setLives] = useState<number>(MEMORY_CONFIG.lives);

    const [timeLeft, setTimeLeft] = useState<number>(MEMORY_CONFIG.time);

    const [message, setMessage] = useState<string>("");

    const [stats, setStats] = useState<MemoryStats>({

        matches: 0,

        attempts: 0,

        score: 0,

    });

    /*======================================================
        Inicializar partida
    ======================================================*/

    function startGame(deck: CardItem[] = []): void {

        setCards(deck);

        setPlaying(true);

        setFinished(false);

        setWon(false);

        setFlipped([]);

        setMatched([]);

        setScore(0);

        setCombo(0);

        setLives(MEMORY_CONFIG.lives);

        setTimeLeft(MEMORY_CONFIG.time);

        setMessage("");

        setStats({

            matches: 0,

            attempts: 0,

            score: 0,

        });

    }

    /*======================================================
        Reiniciar
    ======================================================*/

    function restart(): void {

        startGame(cards);

    }

    /*======================================================
        Voltear carta
    ======================================================*/

    function flip(id: string): void {

        setFlipped(prev => [...prev, id]);

    }

    /*======================================================
        Ocultar cartas
    ======================================================*/

    function unflip(): void {

        setFlipped([]);

    }

    /*======================================================
        Marcar pareja
    ======================================================*/

    function match(a: string, b: string): void {

        setMatched(prev => [...prev, a, b]);

        setFlipped([]);

        setStats(prev => ({
            ...prev,
            matches: prev.matches + 1,
        }));

    }

    /*======================================================
        Intentos
    ======================================================*/

    function addAttempt(): void {

        setStats(prev => ({
            ...prev,
            attempts: prev.attempts + 1,
        }));

    }

    /*======================================================
        Puntuación
    ======================================================*/

    function addScore(points: number): void {

        setScore(prev => prev + points);

        setStats(prev => ({
            ...prev,
            score: prev.score + points,
        }));

    }

    /*======================================================
        Combo
    ======================================================*/

    function addCombo(): void {

        setCombo(prev => prev + 1);

    }

    function resetCombo(): void {

        setCombo(0);

    }

    /*======================================================
        Vidas
    ======================================================*/

    function removeLife(): void {

        setLives(prev => Math.max(prev - 1, 0));

    }

    /*======================================================
        Mensajes
    ======================================================*/

    function showMessage(text: string): void {

        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 1200);

    }

    /*======================================================
        Finalizar
    ======================================================*/

    function finish(win: boolean): void {

        setWon(win);

        setFinished(true);

        setPlaying(false);

    }

    /*======================================================
        Progreso
    ======================================================*/

    const totalPairs: number = cards.length / 2;

    const progress: number =

        totalPairs === 0
            ? 0
            : Math.round(
                  (stats.matches / totalPairs) * 100
              );

    /*======================================================
        API pública
    ======================================================*/

    return {

        cards,

        setCards,

        playing,

        setPlaying,

        finished,

        setFinished,

        won,

        setWon,

        flipped,

        setFlipped,

        matched,

        setMatched,

        score,

        setScore,

        combo,

        setCombo,

        lives,

        setLives,

        timeLeft,

        setTimeLeft,

        message,

        setMessage,

        stats,

        setStats,

        totalPairs,

        progress,

        startGame,

        restart,

        flip,

        unflip,

        match,

        addAttempt,

        addScore,

        addCombo,

        resetCombo,

        removeLife,

        showMessage,

        finish,

    };

}
