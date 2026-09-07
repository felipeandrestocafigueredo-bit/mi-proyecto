/* ==========================================================
   Pandy Adventure
   Utils
   ========================================================== */

/* ---------- Shuffle ---------- */
export function paShuffle<T>(array: T[]): T[] {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

/* ---------- Random ---------- */
export function paRand<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/* ---------- Accuracy ---------- */
export function paAccuracy(correct: number, total: number): number {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
}

/* ---------- Stars ---------- */
export function paStars(accuracy: number): number {

    if (accuracy >= 90) return 3;

    if (accuracy >= 65) return 2;

    return 1;
}

/* ---------- Coins ---------- */
export function paCoins(correct: number): number {
    return correct;
}

/* ---------- Score ---------- */
export function paScore(correct: number, streak = 0): number {
    return correct * 10 + streak * 3;
}

/* ---------- Time ---------- */
export function paNextWaveTime(current: number): number {

    return Math.max(1.5, current - 0.08);

}

/* ---------- Progress ---------- */
export function paProgress(index: number, total: number): number {

    if (!total) return 0;

    return (index / total) * 100;

}

/* ---------- Lives ---------- */
export function paHasLives(lives: number): boolean {

    return lives > 0;

}

/* ---------- Unlock ---------- */
export function paUnlocked(index: number, stars: Record<number, number>): boolean {

    if (index === 0) return true;

    return !!stars[index - 1];

}

/* ---------- Reset Game ---------- */
export interface GameState {
    score: number;
    coins: number;
    lives: number;
    streak: number;
    correct: number;
    total: number;
    waveTime: number;
    question: number;
    pandaLane: number;
}

export function paCreateGameState(): GameState {

    return {

        score: 0,

        coins: 0,

        lives: 3,

        streak: 0,

        correct: 0,

        total: 0,

        waveTime: 3.5,

        question: 0,

        pandaLane: 1,

    };

}
