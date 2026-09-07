import { useState, useRef } from "react";
import { paCreateGameState, GameState } from "./utils";

/* ==========================================================
   Hook principal de Pandy Adventure
   ========================================================== */

export interface PandyAdventureState {
    score: number;
    coins: number;
    lives: number;
    correct: number;
    total: number;
    question: number;
    progress: number;
    wave: number;
    lane: number;
    feedback: any;
    options: any[];
    animation: string;
    confetti: number;
}

export interface PandyAdventureRefs {
    scoreRef: React.RefObject<number>;
    coinsRef: React.RefObject<number>;
    livesRef: React.RefObject<number>;
    streakRef: React.RefObject<number>;
    correctRef: React.RefObject<number>;
    totalRef: React.RefObject<number>;
    questionRef: React.RefObject<number>;
    waveTimeRef: React.RefObject<number>;
    pandaLaneRef: React.RefObject<number>;
    lockedRef: React.RefObject<boolean>;
    questionsRef: React.RefObject<any[]>;
    optionsRef: React.RefObject<any[]>;
    rafRef: React.RefObject<number | null>;
    waveStartRef: React.RefObject<number | null>;
}

export interface PandyAdventureActions {
    resetGame: () => void;
    reset: () => void;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setCoins: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    setCorrect: React.Dispatch<React.SetStateAction<number>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    setQuestion: React.Dispatch<React.SetStateAction<number>>;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    setWave: React.Dispatch<React.SetStateAction<number>>;
    setLane: React.Dispatch<React.SetStateAction<number>>;
    setOptions: React.Dispatch<React.SetStateAction<any[]>>;
    setFeedback: React.Dispatch<React.SetStateAction<any>>;
    setAnimation: React.Dispatch<React.SetStateAction<string>>;
    setConfetti: React.Dispatch<React.SetStateAction<number>>;
}

export default function usePandyAdventure(): PandyAdventureState & PandyAdventureActions & PandyAdventureRefs {

    const initial: GameState = paCreateGameState();

    /* ---------------- Estado React ---------------- */

    const [score, setScore] = useState<number>(initial.score);
    const [coins, setCoins] = useState<number>(initial.coins);
    const [lives, setLives] = useState<number>(initial.lives);

    const [correct, setCorrect] = useState<number>(initial.correct);
    const [total, setTotal] = useState<number>(initial.total);

    const [question, setQuestion] = useState<number>(initial.question);

    const [progress, setProgress] = useState<number>(0);

    const [wave, setWave] = useState<number>(0);

    const [lane, setLane] = useState<number>(initial.pandaLane);

    const [feedback, setFeedback] = useState<any>(null);

    const [options, setOptions] = useState<any[]>([]);

    const [animation, setAnimation] = useState<string>("idle");

    const [confetti, setConfetti] = useState<number>(0);

    /* ---------------- Refs ---------------- */

    const scoreRef = useRef<number>(initial.score);

    const coinsRef = useRef<number>(initial.coins);

    const livesRef = useRef<number>(initial.lives);

    const streakRef = useRef<number>(initial.streak);

    const correctRef = useRef<number>(initial.correct);

    const totalRef = useRef<number>(initial.total);

    const questionRef = useRef<number>(initial.question);

    const waveTimeRef = useRef<number>(initial.waveTime);

    const pandaLaneRef = useRef<number>(initial.pandaLane);

    const lockedRef = useRef<boolean>(false);

    const questionsRef = useRef<any[]>([]);

    const optionsRef = useRef<any[]>([]);

    const rafRef = useRef<number | null>(null);

    const waveStartRef = useRef<number | null>(null);

    /* ---------------- Funciones ---------------- */

    function resetGame(): void {

        const initial: GameState = paCreateGameState();

        scoreRef.current = initial.score;
        coinsRef.current = initial.coins;
        livesRef.current = initial.lives;

        streakRef.current = initial.streak;

        correctRef.current = initial.correct;
        totalRef.current = initial.total;

        questionRef.current = initial.question;

        waveTimeRef.current = initial.waveTime;

        pandaLaneRef.current = initial.pandaLane;

        lockedRef.current = false;

        setScore(initial.score);
        setCoins(initial.coins);
        setLives(initial.lives);

        setCorrect(initial.correct);
        setTotal(initial.total);

        setQuestion(initial.question);

        setProgress(0);

        setWave(0);

        setLane(initial.pandaLane);

        setFeedback(null);

        setAnimation("idle");

        setConfetti(0);

        setOptions([]);
    }

    return {

        /* state */

        score,
        coins,
        lives,

        correct,
        total,

        question,

        progress,

        wave,

        lane,

        options,

        feedback,

        animation,

        confetti,

        /* setters */

        setScore,
        setCoins,
        setLives,

        setCorrect,
        setTotal,

        setQuestion,

        setProgress,

        setWave,

        setLane,

        setOptions,

        setFeedback,

        setAnimation,

        setConfetti,

        /* methods */

        resetGame,

        reset: resetGame,

        /* refs */

        scoreRef,
        coinsRef,
        livesRef,

        streakRef,

        correctRef,
        totalRef,

        questionRef,

        waveTimeRef,

        pandaLaneRef,

        lockedRef,

        questionsRef,

        optionsRef,

        rafRef,

        waveStartRef,

    };

}
