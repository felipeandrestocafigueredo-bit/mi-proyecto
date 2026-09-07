import React from "react";

/* ==========================================================
   QUESTION CARD
   Quiz Multiple
   Arquitectura 3.0
========================================================== */

interface Question {
    question: string;
    options: string[];
    correct: string;
    image?: string;
    category?: string;
}

interface QuestionCardProps {
    question: Question;
    current: number;
    total: number;
    progress: number;
}

export default function QuestionCard({
    question,
    current,
    total,
    progress,
}: QuestionCardProps) {

    if (!question) return null;

    return (
        <div
            className="quiz-card"
            style={{
                background: "#FFFFFF",
                borderRadius: 22,
                padding: 24,
                boxShadow: "0 10px 30px rgba(0,0,0,.10)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
            } as React.CSSProperties}
        >
            {/* ==========================================
                Cabecera
            ========================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                } as React.CSSProperties}
            >
                <div
                    style={{
                        background: "#EEF2FF",
                        color: "#4F46E5",
                        padding: "6px 14px",
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: ".85rem",
                    } as React.CSSProperties}
                >
                    Question {current} / {total}
                </div>

                <div
                    style={{
                        fontWeight: 700,
                        color: "#64748B",
                        fontSize: ".85rem",
                    } as React.CSSProperties}
                >
                    {progress}%
                </div>

            </div>

            {/* ==========================================
                Barra progreso
            ========================================== */}

            <div
                className="quiz-progress"
            >
                <div
                    className="quiz-progress-fill"
                    style={{ width: `${progress}%` } as React.CSSProperties}
                />
            </div>

            {/* ==========================================
                Pregunta
            ========================================== */}

            <div
                className="quiz-question"
            >
                {question.question}
            </div>

            {/* ==========================================
                Imagen opcional
            ========================================== */}

            {question.image && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    } as React.CSSProperties}
                >
                    <img
                        src={question.image}
                        alt={question.question}
                        style={{
                            maxWidth: 260,
                            width: "100%",
                            borderRadius: 18,
                            objectFit: "cover",
                        } as React.CSSProperties}
                    />
                </div>
            )}

            {/* ==========================================
                Categoría
            ========================================== */}

            {question.category && (
                <div
                    style={{
                        textAlign: "center",
                        color: "#94A3B8",
                        fontSize: ".80rem",
                        fontWeight: 700,
                    } as React.CSSProperties}
                >
                    {question.category}
                </div>
            )}

        </div>

    );

}
