import { useCallback, useState } from "react";

/*
==========================================================

USE GAME STATE
Arquitectura Oficial 3.0

Controla el estado general de cualquier juego.

Estados disponibles

menu
playing
paused
completed
gameover

==========================================================
*/

export type GameStateType = "menu" | "playing" | "paused" | "completed" | "gameover";

export interface UseGameStateReturn {
    state: GameStateType;
    setState: React.Dispatch<React.SetStateAction<GameStateType>>;
    start: () => void;
    pause: () => void;
    resume: () => void;
    complete: () => void;
    gameOver: () => void;
    reset: () => void;
    goTo: (newState: GameStateType) => void;
    isMenu: boolean;
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    isGameOver: boolean;
}

export default function useGameState(initial: GameStateType = "menu"): UseGameStateReturn {

    const [state, setState] = useState<GameStateType>(initial);

    /*
    ======================================================
    Acciones principales
    ======================================================
    */

    const start = useCallback((): void => {
        setState("playing");
    }, []);

    const pause = useCallback((): void => {
        setState("paused");
    }, []);

    const resume = useCallback((): void => {
        setState("playing");
    }, []);

    const complete = useCallback((): void => {
        setState("completed");
    }, []);

    const gameOver = useCallback((): void => {
        setState("gameover");
    }, []);

    const reset = useCallback((): void => {
        setState(initial);
    }, [initial]);

    const goTo = useCallback((newState: GameStateType): void => {
        setState(newState);
    }, []);

    /*
    ======================================================
    Helpers
    ======================================================
    */

    const isMenu: boolean = state === "menu";

    const isPlaying: boolean = state === "playing";

    const isPaused: boolean = state === "paused";

    const isCompleted: boolean = state === "completed";

    const isGameOver: boolean = state === "gameover";

    /*
    ======================================================
    API
    ======================================================
    */

    return {

        state,

        setState,

        start,

        pause,

        resume,

        complete,

        gameOver,

        reset,

        goTo,

        isMenu,

        isPlaying,

        isPaused,

        isCompleted,

        isGameOver,

    };

}
