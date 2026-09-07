export interface CardData {
    id?: string;
    word: string;
    emoji?: string;
    image?: string;
    selected?: boolean;
    correct?: boolean;
    wrong?: boolean;
}

export interface SnapGameState {
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
