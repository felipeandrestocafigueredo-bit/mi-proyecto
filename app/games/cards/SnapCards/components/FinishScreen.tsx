import React from "react";

/* ==========================================================
   SNAP CARDS
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

    function getMessage(): string {

        if (stars === 3)
            return "🏆 Outstanding!";

        if (stars === 2)
            return "🎉 Great Job!";

        return "👏 Keep Practicing!";

    }

    return (

        <div className="snap-finish">

            <div

                style={{
                    fontSize: "4rem",
                    marginBottom: "10px",
                } as React.CSSProperties}
            >
                🎊
            </div>

            <h1

                style={{
                    color: "#6C5CE7",
                    marginBottom: "5px",
                } as React.CSSProperties}
            >
                Game Finished
            </h1>

            <h2

                style={{
                    color: "#444",
                    marginTop: 0,
                } as React.CSSProperties}
            >
                {getMessage()}
            </h2>

            <div

                style={{
                    fontSize: "2rem",
                    margin: "15px 0",
                } as React.CSSProperties}
            >
                {"⭐".repeat(stars)}
                {"☆".repeat(Math.max(0, 3 - stars))}
            </div>

            <div className="snap-stats">

                <div className="snap-stat">

                    <h2>{score}</h2>

                    <small>Final Score</small>

                </div>

                <div className="snap-stat">

                    <h2>

                        {correct} / {total}

                    </h2>

                    <small>Correct Cards</small>

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

                    className="snap-btn"

                    onClick={onRestart}

                >

                    🔄 Play Again

                </button>

                <button

                    className="snap-btn"

                    onClick={onExit}

                >

                    🏠 Exit

                </button>

            </div>

        </div>

    );

}
