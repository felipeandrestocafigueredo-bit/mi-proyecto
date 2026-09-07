import React from "react";

/* ==========================================================
   WORD RACE
   FINISH SCREEN
   Arquitectura 3.0
========================================================== */

interface FinishScreenProps {
    score?: number;
    stars?: number;
    correct?: number;
    total?: number;
    onRestart?: () => void;
    onExit?: () => void;
}

export default function FinishScreen({
    score = 0,
    stars = 0,
    correct = 0,
    total = 0,
    onRestart,
    onExit,
}: FinishScreenProps) {

    const message: string =
        stars === 3
            ? "🏆 Excellent!"
            : stars === 2
            ? "🎉 Great Job!"
            : stars === 1
            ? "👏 Good Effort!"
            : "🙂 Keep Practicing!";

    return (

        <div className="wordrace-finish">

            <h1>{message}</h1>

            <div
                style={{
                    fontSize: "2rem",
                    marginBottom: "10px",
                } as React.CSSProperties}
            >
                {"⭐".repeat(stars)}
                {"☆".repeat(
                    Math.max(0, 3 - stars)
                )}
            </div>

            <div
                className="wordrace-stats"
                style={{
                    marginTop: "10px",
                } as React.CSSProperties}
            >
                <div className="wordrace-stat">
                    <h2>{score}</h2>
                    <small>Score</small>
                </div>

                <div className="wordrace-stat">
                    <h2>
                        {correct} / {total}
                    </h2>
                    <small>Correct</small>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "25px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                } as React.CSSProperties}
            >
                <button
                    className="wordrace-button"
                    onClick={onRestart}
                >
                    🔄 Play Again
                </button>

                <button
                    className="wordrace-button"
                    onClick={onExit}
                >
                    🚪 Exit
                </button>

            </div>

        </div>

    );

}
