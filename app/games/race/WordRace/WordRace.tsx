import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import useWordRace from "./hooks";
import WordRaceEngine from "./engine";

import { WORDRACE_CSS } from "./styles";
import { calculateStars } from "./utils";

import LetterBox from "./components/LetterBox";
import Keyboard from "./components/Keyboard";
import ProgressBar from "./components/ProgressBar";
import ScoreBoard from "./components/ScoreBoard";
import FinishScreen from "./components/FinishScreen";

/* ==========================================================
   WORD RACE
   Arquitectura Oficial 3.0
========================================================== */

interface WordRaceProps {
    vocab?: { word: string; emoji?: string; image?: string; translation?: string }[];
    colors?: Record<string, string>;
    onBack?: () => void;
    onExit?: () => void;
}

interface VocabWord {
    word: string;
    emoji?: string;
    image?: string;
}

export default function WordRace({
    vocab = [],
    colors = {},
    onBack,
    onExit,
}: WordRaceProps) {

    const game = useWordRace();

    const engine = useMemo(() => {
        return WordRaceEngine({
            vocabulary: vocab as VocabWord[],
            game,
        });
    }, [vocab, game]);

    const [answer, setAnswer] = useState<string>("");

    /* ==========================================
       START GAME
    ========================================== */

    useEffect(() => {
        engine.start();
    }, [engine]);

    /* ==========================================
       RESET ANSWER
    ========================================== */

    useEffect(() => {
        setAnswer("");
    }, [game.currentWord]);

    /* ==========================================
       TIMER
    ========================================== */

    useEffect(() => {
        if (!game.playing) return;
        if (game.finished) return;

        const timer = setTimeout(() => {
            if (game.timeLeft <= 1) {
                engine.timeout();
            } else {
                game.setTimeLeft((time: number) => time - 1);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [
        game.timeLeft,
        game.playing,
        game.finished,
        engine,
    ]);

    /* ==========================================
       RESULTS
    ========================================== */

    const results = useMemo(() => {
        return engine.getResults();
    }, [
        engine,
        game.score,
        game.current,
        game.lives,
        game.finished,
    ]);

    /* ==========================================
       CURRENT WORD
    ========================================== */

    const currentWord = game.currentWord;

    const letters: string[] = currentWord
        ? currentWord.word.split("")
        : [];

    /* ==========================================
       KEYBOARD
    ========================================== */

    function addLetter(letter: string): void {

        if (game.finished) return;

        if (!currentWord) return;

        const expected = currentWord.word;

        if (answer.length >= expected.length) return;

        const value = answer + letter;

        setAnswer(value);

        game.updateLetters(
            value.split("")
        );

        if (value.length === expected.length) {
            engine.checkAnswer(value);
        }

    }

    function deleteLetter(): void {

        if (game.finished) return;

        const value = answer.slice(0, -1);

        setAnswer(value);

        game.updateLetters(
            value.split("")
        );

    }

    function clearWord(): void {

        setAnswer("");

        game.resetLetters();

    }    return (

        <>

            <style>
                {WORDRACE_CSS}
            </style>

            <div className="wordrace-container">

                <div className="wordrace-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>

                    <h1 className="wordrace-title">
                        🏁 Word Race
                    </h1>

                    {(onBack || onExit) && (
                        <button
                            type="button"
                            onClick={() => (onBack ? onBack() : onExit?.())}
                            style={{
                                border: "none",
                                background: colors.light ?? "#E2E8F0",
                                color: colors.text ?? "#0F172A",
                                borderRadius: 12,
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontWeight: 700,
                            }}
                        >
                            ← Volver
                        </button>
                    )}

                </div>

                <ScoreBoard
                    score={game.score}
                    lives={game.lives}
                    timeLeft={game.timeLeft}
                    stars={calculateStars(game.score, vocab.length)}
                />

                <ProgressBar
                    progress={game.progress}
                    current={game.current + 1}
                    total={vocab.length}
                />

                {!game.finished && (
                    <>
                        <div className="wordrace-message">
                            {game.message || "Type the correct word"}
                        </div>

                        <div className="wordrace-board">
                            {letters.map(
                                (letter, index) => (
                                    <LetterBox
                                        key={index}
                                        index={index}
                                        expected={letter}
                                        value={answer[index] || ""}
                                        state="normal"
                                    />
                                )
                            )}
                        </div>

                        <Keyboard
                            disabled={game.finished}
                            usedLetters={[]}
                            onLetter={addLetter}
                            onDelete={deleteLetter}
                            onClear={clearWord}
                        />

                    </>
                )}                {game.finished && (
                    <FinishScreen
                        score={results.score}
                        stars={results.stars}
                        correct={results.rounds}
                        total={results.total}
                        onRestart={() => {
                            setAnswer("");
                            engine.restart();
                        }}
                        onExit={() => {
                            if (onExit) {
                                onExit();
                            }
                        }}
                    />
                )}

            </div>

        </>

    );

}
