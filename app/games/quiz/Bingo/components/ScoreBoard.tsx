import React from "react";

/* ==========================================================
   BINGO
   SCORE BOARD
   Arquitectura Oficial 3.0
========================================================== */

interface ScoreBoardProps {
    score?: number;
    lives?: number;
    timeLeft?: number;
    stars?: number;
    currentWord?: { word: string; image?: string } | null;
}

export default function ScoreBoard({
    score = 0,
    lives = 3,
    timeLeft = 0,
    stars = 0,
    currentWord = null,
}: ScoreBoardProps) {

    return (

        <div className="bingo-stats">

            <div className="bingo-stat">
                <h2>{score}</h2>
                <small>Score</small>
            </div>

            <div className="bingo-stat">
                <h2>
                    {"❤️".repeat(lives)}
                </h2>
                <small>Lives</small>
            </div>

            <div className="bingo-stat">
                <h2>
                    ⏱ {timeLeft}
                </h2>
                <small>Time</small>
            </div>

            <div className="bingo-stat">
                <h2>
                    {"⭐".repeat(stars)}
                </h2>
                <small>Stars</small>
            </div>

            <div className="bingo-stat">
                <h2>
                    {currentWord?.image ? (
                        <img
                            src={currentWord.image}
                            alt={currentWord.word}
                            style={{
                                width: "45px",
                                height: "45px",
                                objectFit: "contain",
                            } as React.CSSProperties}
                        />
                    ) : (
                        currentWord?.word || "..."
                    )}
                </h2>
                <small>Find</small>
            </div>

        </div>

    );

}
