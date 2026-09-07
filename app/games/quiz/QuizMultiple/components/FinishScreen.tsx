import React from "react";

/* ==========================================================
   FINISH SCREEN
   Quiz Multiple
   Arquitectura 3.0
========================================================== */

interface FinishScreenProps {
    result?: QuizResult;
    onRestart?: () => void;
    onWorlds?: () => void;
    onBack: () => void;
}

interface QuizResult {
    score: number;
    correct: number;
    total: number;
    accuracy: number;
    stars: number;
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

    /*=========================================================
        Datos
    =========================================================*/

    const {
        score = 0,
        correct = 0,
        total = 0,
        accuracy = 0,
        stars = 0,
        coins = 0,
    } = result;

    /*=========================================================
        Mensaje
    =========================================================*/

    let title = "Keep Practicing! 📚";

    let color = "#EF4444";

    let emoji = "📚";

    if (stars === 2) {
        title = "Great Job! 🎉";
        color = "#F59E0B";
        emoji = "🥈";
    }

    if (stars === 3) {
        title = "Excellent! 🏆";
        color = "#22C55E";
        emoji = "🥇";
    }

    /*=========================================================
        Render
    =========================================================*/

    return (

        <div

            className="quiz-card"
            style={{
                background: "#FFFFFF",
                borderRadius: 22,
                padding: 28,
                boxShadow: "0 12px 35px rgba(0,0,0,.12)",
                textAlign: "center",
            } as React.CSSProperties}
        >

            {/*==============================================
                Cabecera
            ==============================================*/}

            <div
                style={{
                    fontSize: "3.5rem",
                    marginBottom: 10,
                } as React.CSSProperties}
            >
                {emoji}
            </div>

            <h2
                style={{
                    color,
                    marginBottom: 8,
                    fontFamily: "'Fredoka',sans-serif",
                } as React.CSSProperties}
            >
                {title}
            </h2>

            {/*==============================================
                Estrellas
            ==============================================*/}

            <div
                className="quiz-stars"
                style={{
                    fontSize: "2rem",
                    letterSpacing: 6,
                    marginBottom: 20,
                } as React.CSSProperties}
            >
                {"⭐".repeat(stars)}
                {"☆".repeat(3 - stars)}
            </div>

            {/*==============================================
                Estadísticas
            ==============================================*/}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: 12,
                    marginBottom: 28,
                } as React.CSSProperties}
            >
                <Card title="Score" value={score} />

                <Card
                    title="Correct"
                    value={`${correct}/${total}`}
                />

                <Card
                    title="Accuracy"
                    value={`${accuracy}%`}
                />

                <Card
                    title="Coins"
                    value={`🪙 ${coins}`}
                />
            </div>

            {/*==============================================
                Botones
            ==============================================*/}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                } as React.CSSProperties}
            >
                <button
                    className="quiz-btn"
                    style={{
                        background: "#4F46E5",
                        color: "#FFFFFF",
                    } as React.CSSProperties}
                    onClick={onRestart}
                >
                    🔄 Play Again
                </button>

                {onWorlds && (
                    <button
                        className="quiz-btn"
                        style={{
                            background: "#2EC4B6",
                            color: "#FFFFFF",
                        } as React.CSSProperties}
                        onClick={onWorlds}
                    >
                        🌍 Select World
                    </button>
                )}

                <button
                    className="quiz-btn"
                    style={{
                        background: "#E5E7EB",
                        color: "#374151",
                    } as React.CSSProperties}
                    onClick={onBack}
                >
                    ← Back to Menu
                </button>

            </div>

        </div>

    );

}

/* ==========================================================
   Tarjeta Estadística
========================================================== */

interface CardProps {
    title: string;
    value: string | number;
}

function Card({ title, value }: CardProps) {
    return (
        <div
            style={{
                background: "#F8FAFC",
                borderRadius: 16,
                padding: 16,
                border: "1px solid #E5E7EB",
            } as React.CSSProperties}
        >
            <div
                style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#4F46E5",
                    marginBottom: 6,
                } as React.CSSProperties}
            >
                {value}
            </div>

            <div
                style={{
                    fontSize: ".75rem",
                    color: "#64748B",
                    fontWeight: 700,
                    textTransform: "uppercase",
                } as React.CSSProperties}
            >
                {title}
            </div>
        </div>
    );
}
