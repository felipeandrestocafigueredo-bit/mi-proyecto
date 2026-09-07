import { useCallback, useState } from "react";

/*
==========================================================

USE SCORE
Arquitectura Oficial 3.0

Controla:

✓ Score
✓ XP
✓ Monedas
✓ Estrellas
✓ Vidas

==========================================================
*/

export interface ScoreState {
    score: number;
    xp: number;
    coins: number;
    stars: number;
    lives: number;
}

export interface ScoreActions {
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setXp: React.Dispatch<React.SetStateAction<number>>;
    setCoins: React.Dispatch<React.SetStateAction<number>>;
    setStars: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    addScore: (value?: number) => void;
    removeScore: (value?: number) => void;
    addXp: (value?: number) => void;
    addCoins: (value?: number) => void;
    removeCoins: (value?: number) => void;
    addStars: (value?: number) => void;
    addLife: () => void;
    loseLife: () => void;
    reset: () => void;
}

export interface InitialData {
    score?: number;
    xp?: number;
    coins?: number;
    stars?: number;
    lives?: number;
}

export default function useScore(initialData: InitialData = {}): ScoreState & ScoreActions {

    const [score, setScore] = useState<number>(
        initialData.score || 0
    );

    const [xp, setXp] = useState<number>(
        initialData.xp || 0
    );

    const [coins, setCoins] = useState<number>(
        initialData.coins || 0
    );

    const [stars, setStars] = useState<number>(
        initialData.stars || 0
    );

    const [lives, setLives] = useState<number>(
        initialData.lives || 3
    );

    /*
    ======================================================
    SCORE
    ======================================================
    */

    const addScore = useCallback((value: number = 1): void => {
        setScore(prev => prev + value);
    }, []);

    const removeScore = useCallback((value: number = 1): void => {
        setScore(prev => Math.max(0, prev - value));
    }, []);

    /*
    ======================================================
    XP
    ======================================================
    */

    const addXp = useCallback((value: number = 1): void => {
        setXp(prev => prev + value);
    }, []);

    /*
    ======================================================
    COINS
    ======================================================
    */

    const addCoins = useCallback((value: number = 1): void => {
        setCoins(prev => prev + value);
    }, []);

    const removeCoins = useCallback((value: number = 1): void => {
        setCoins(prev => Math.max(0, prev - value));
    }, []);

    /*
    ======================================================
    STARS
    ======================================================
    */

    const addStars = useCallback((value: number = 1): void => {
        setStars(prev => prev + value);
    }, []);

    /*
    ======================================================
    LIVES
    ======================================================
    */

    const addLife = useCallback((): void => {
        setLives(prev => prev + 1);
    }, []);

    const loseLife = useCallback((): void => {
        setLives(prev => Math.max(0, prev - 1));
    }, []);

    /*
    ======================================================
    RESET
    ======================================================
    */

    const reset = useCallback((): void => {
        setScore(initialData.score || 0);
        setXp(initialData.xp || 0);
        setCoins(initialData.coins || 0);
        setStars(initialData.stars || 0);
        setLives(initialData.lives || 3);
    }, [initialData]);

    /*
    ======================================================
    API
    ======================================================
    */

    return {

        score,
        xp,
        coins,
        stars,
        lives,

        setScore,
        setXp,
        setCoins,
        setStars,
        setLives,

        addScore,
        removeScore,

        addXp,

        addCoins,
        removeCoins,

        addStars,

        addLife,
        loseLife,

        reset,

    };

}
