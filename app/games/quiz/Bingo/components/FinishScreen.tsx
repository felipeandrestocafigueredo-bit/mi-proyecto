import React from "react";

/* ==========================================================
   BINGO
   FINISH SCREEN
   Arquitectura Oficial 3.0
========================================================== */

interface FinishScreenProps {
    score?: number;
    stars?: number;
    marked?: number;
    total?: number;
    onRestart?: () => void;
    onExit?: () => void;
}

export default function FinishScreen({
    score = 0,
    stars = 0,
    marked = 0,
    total = 0,
    onRestart,
    onExit,
}: FinishScreenProps) {

    const message: string =
        stars === 3
            ? "Outstanding! 🏆"
            : stars === 2
            ? "Excellent! 🌟"
            : stars === 1
            ? "Good Job! 👍"
            : "Keep Practicing! 💪";

    return (

        <div className="bingo-finish">

            <h1
                style={{
                    fontSize: "2.2rem",
                    color: "#4F46E5",
                    marginBottom: "10px",
                } as React.CSSProperties}
            >
                🎉 BINGO!
            </h1>

            <h2
                style={{
                    color: "#334155",
                    marginBottom: "20px",
                } as React.CSSProperties}
            >
                {message}
            </h2>

            <div
                style={{
                    fontSize: "2rem",
                    marginBottom: "20px",
                } as React.CSSProperties}
            >
                {"⭐".repeat(stars)}
            </div>

            <div className="bingo-stats">

                <div className="bingo-stat">
                    <h2>{score}</h2>
                    <small>Score</small>
                </div>

                <div className="bingo-stat">
                    <h2>
                        {marked}/{total}
                    </h2>
                    <small>Marked</small>
                </div>

                <div className="bingo-stat">
                    <h2>{stars}</h2>
                    <small>Stars</small>
                </div>

            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    marginTop: "25px",
                    flexWrap: "wrap",
                } as React.CSSProperties}
            >
                <button
                    className="bingo-button"
                    onClick={onRestart}
                >
                    🔄 Play Again
                </button>

                <button
                    className="bingo-button"
                    onClick={onExit}
                >
                    🚪 Exit
                </button>

            </div>

        </div>

    );

}
