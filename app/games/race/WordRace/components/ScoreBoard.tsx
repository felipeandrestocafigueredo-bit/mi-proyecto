import React from "react";

/* ==========================================================
   WORD RACE
   SCORE BOARD
   Arquitectura 3.0
========================================================== */

interface ScoreBoardProps {
    score?: number;
    lives?: number;
    timeLeft?: number;
    stars?: number;
}

export default function ScoreBoard({
    score = 0,
    lives = 3,
    timeLeft = 30,
    stars = 0,
}: ScoreBoardProps) {

    return (

        <div className="wordrace-stats">

            <div className="wordrace-stat">
                <h2>
                    🏆 {score}
                </h2>
                <small>Score</small>
            </div>

            <div className="wordrace-stat">
                <h2>
                    {"❤️".repeat(lives)}
                    {"🤍".repeat(
                        Math.max(0, 3 - lives)
                    )}
                </h2>
                <small>Lives</small>
            </div>

            <div className="wordrace-stat">
                <h2>
                    ⏰ {timeLeft}s
                </h2>
                <small>Time</small>
            </div>

            <div className="wordrace-stat">
                <h2>
                    {"⭐".repeat(stars)}
                    {"☆".repeat(
                        Math.max(0, 3 - stars)
                    )}
                </h2>
                <small>Stars</small>
            </div>

        </div>

    );

}
