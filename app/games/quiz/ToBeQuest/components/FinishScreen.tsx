import React from "react";

/* ==========================================================
   TO BE QUEST
   FINISH SCREEN
   Arquitectura 3.0
========================================================== */

interface FinishScreenProps {
    result?: ResultData;
    onRestart?: () => void;
    onWorlds?: () => void;
    onBack: () => void;
}

interface ResultData {
    stars: number;
    score: number;
    correct: number;
    total: number;
    accuracy: number;
    coins: number;
    wrong?: number;
    streak?: number;
}

export default function FinishScreen({
    result,
    onRestart,
    onWorlds,
    onBack,
}: FinishScreenProps) {

    if (!result) return null;

    const trophy =
        result.stars === 3
            ? "🏆"
            : result.stars === 2
            ? "🥈"
            : result.stars === 1
            ? "🥉"
            : "📘";

    return (

        <div className="tobe-container">
            <div className="tobe-card tobe-pop">

                {/*==========================================
                    Trofeo
                ==========================================*/}

                <div

                    style={{
                        fontSize: "4rem",
                        marginBottom: 10,
                    } as React.CSSProperties}
                >
                    {trophy}
                </div>

                <h1

                    style={{
                        color: "#1E3A8A",
                        marginBottom: 5,
                    } as React.CSSProperties}
                >
                    Quiz Finished!
                </h1>

                <p

                    style={{
                        color: "#64748B",
                        marginBottom: 25,
                    } as React.CSSProperties}
                >
                    Congratulations!
                </p>

                {/*==========================================
                    Estrellas
                ==========================================*/}

                <div
                    className="tobe-stars"
                    style={{ marginBottom: 25 }}
                >
                    {"⭐".repeat(result.stars)}
                    {"☆".repeat(3 - result.stars)}
                </div>

                {/*==========================================
                    Estadísticas
                ==========================================*/}

                <div className="tobe-stats">

                    <div className="tobe-stat">
                        <h2>{result.score}</h2>
                        <small>Score</small>
                    </div>

                    <div className="tobe-stat">
                        <h2>
                            {result.correct}/{result.total}
                        </h2>
                        <small>Correct</small>
                    </div>

                    <div className="tobe-stat">
                        <h2>{result.accuracy}%</h2>
                        <small>Accuracy</small>
                    </div>

                    <div className="tobe-stat">
                        <h2>{result.coins}</h2>
                        <small>Coins</small>
                    </div>

                </div>

                {/*==========================================
                    Botones
                ==========================================*/}

                <div

                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    } as React.CSSProperties}
                >
                    <button
                        className="tobe-btn"
                        style={{
                            background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                            color: "#FFF",
                        } as React.CSSProperties}
                        onClick={onRestart}
                    >
                        🔄 Play Again
                    </button>

                    <button
                        className="tobe-btn"
                        style={{
                            background: "linear-gradient(135deg,#10B981,#059669)",
                            color: "#FFF",
                        } as React.CSSProperties}
                        onClick={onWorlds}
                    >
                        🗺 Choose World
                    </button>

                    <button
                        className="tobe-btn"
                        style={{
                            background: "linear-gradient(135deg,#64748B,#475569)",
                            color: "#FFF",
                        } as React.CSSProperties}
                        onClick={onBack}
                    >
                        ← Back to Panel
                    </button>

                </div>

            </div>

        </div>

    );

}
