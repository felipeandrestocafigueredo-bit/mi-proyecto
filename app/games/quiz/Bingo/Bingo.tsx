import React, {
    useEffect,
} from "react";

import useBingo from "./hooks";

import BingoEngine from "./engine";

import {

    BINGO_CONFIG,

} from "./data";

import {

    BINGO_CSS,

} from "./styles";

import ProgressBar from "./components/ProgressBar";

import ScoreBoard from "./components/ScoreBoard";

import BingoBoard from "./components/BingoBoard";

import FinishScreen from "./components/FinishScreen";

interface BingoProps {
    vocab?: { word: string; emoji?: string; image?: string }[];
}

interface WordItem {
    word: string;
    emoji?: string;
    image?: string;
}

export default function Bingo({
    vocab = [],
}: BingoProps) {

    const game = useBingo();

    const engine = BingoEngine({

        vocabulary: vocab as WordItem[],

        game,

    });

    useEffect(() => {

        engine.start();

    }, []);

    useEffect(() => {

        if (

            !game.playing ||

            game.finished

        ) {

            return;

        }

        if (

            game.timeLeft <= 0

        ) {

            engine.timeout();

            return;

        }

        const timer = setTimeout(() => {

            game.setTimeLeft(

                (time: number) =>

                    time - 1

            );

        }, 1000);

        return () =>

            clearTimeout(timer);

    }, [

        game.timeLeft,

        game.playing,

        game.finished,

    ]);

    useEffect(() => {

        if (

            game.lives <= 0

        ) {

            engine.finish(false);

        }

    }, [

        game.lives,

    ]);

    const stars = Math.min(
        BINGO_CONFIG.MAX_STARS,
        Math.floor(
            game.score / 40
        )
    );

    if (game.finished) {

        return (

            <>

                <style>{BINGO_CSS}</style>

                <FinishScreen
                    score={game.score}
                    stars={stars}
                    marked={game.marked}
                    total={game.total}
                    onRestart={() =>
                        engine.restart()
                    }
                    onExit={() =>
                        game.resetGame()
                    }
                />

            </>

        );

    }

    return (

        <>

            <style>{BINGO_CSS}</style>

            <div className="bingo-container">

                <h1 className="bingo-title">
                    Bingo
                </h1>

                <ScoreBoard
                    score={game.score}
                    lives={game.lives}
                    timeLeft={game.timeLeft}
                    stars={stars}
                    currentWord={game.currentWord}
                />

                <ProgressBar
                    progress={game.progress}
                    marked={game.marked}
                    total={game.total}
                />

                <div className="bingo-message">
                    {game.message}
                </div>

                {game.currentWord && (
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "15px",
                        } as React.CSSProperties}
                    >
                        <h3>
                            Find:
                        </h3>

                        {game.currentWord.image ? (
                            <img
                                src={game.currentWord.image}
                                alt={game.currentWord.word}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "contain",
                                } as React.CSSProperties}
                            />
                        ) : (
                            <h2>
                                {game.currentWord.word}
                            </h2>
                        )}
                    </div>
                )}

                <BingoBoard
                    board={game.board}
                    disabled={!game.playing}
                    onCellClick={(cell) =>
                        engine.markCell(cell)
                    }
                />                <div

                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    } as React.CSSProperties}
                >
                    <button
                        className="bingo-button"
                        onClick={() =>
                            engine.nextWord()
                        }
                    >
                        Next Word
                    </button>

                </div>

            </div>

        </>

    );

}
