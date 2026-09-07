export interface CardItem {
    id: string;
    pairId: string | number;
    word: string;
    translation: string;
    image: string;
    audio: string;
    type: string;
}

export interface MemoryStats {
    matches: number;
    attempts: number;
    score: number;
}

export interface MemoryGameState {
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
    restart(): void;
    finish(win: boolean): void;
    flip(cardId: string): void;
    unflip(): void;
    match(a: string, b: string): void;
    addAttempt(): void;
    addScore(points: number): void;
    addCombo(): void;
    resetCombo(): void;
    removeLife(): void;
    showMessage(text: string): void;
}
