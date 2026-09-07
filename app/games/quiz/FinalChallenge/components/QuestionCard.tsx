import React from "react";

/* ==========================================================
   QUESTION CARD
   Final Challenge
========================================================== */

interface Question {
    question: string;
    options: string[];
    correct: string;
    category?: string;
    image?: string;
    audio?: string;
}

interface QuestionCardProps {
    question: Question;
    current: number;
    total: number;
    category?: string;
}

export default function QuestionCard({
    question,
    current,
    total,
    category,
}: QuestionCardProps) {

    if (!question) return null;

    return (

        <div className="fc-card fc-pop">

            {/* Categoría */}

            {category && (
                <div
                    style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        borderRadius: 30,
                        background: "#DBEAFE",
                        color: "#1D4ED8",
                        fontWeight: 800,
                        fontSize: ".80rem",
                        marginBottom: 16,
                    } as React.CSSProperties}
                >
                    📘 {category}
                </div>
            )}

            {/* Número */}

            <div
                style={{
                    fontSize: ".9rem",
                    color: "#64748B",
                    fontWeight: 700,
                    marginBottom: 10,
                } as React.CSSProperties}
            >
                Question {current + 1} / {total}
            </div>

            {/* Pregunta */}

            <h2
                style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1.5,
                } as React.CSSProperties}
            >
                {question.question}
            </h2>

            {/* Imagen opcional */}

            {question.image && (
                <div
                    style={{
                        marginTop: 20,
                        textAlign: "center",
                    } as React.CSSProperties}
                >
                    <img
                        src={question.image}
                        alt={question.question}
                        style={{
                            maxWidth: "100%",
                            maxHeight: 240,
                            borderRadius: 18,
                            objectFit: "cover",
                            boxShadow: "0 6px 20px rgba(0,0,0,.15)",
                        } as React.CSSProperties}
                    />
                </div>
            )}

            {/* Audio opcional */}

            {question.audio && (
                <div
                    style={{
                        marginTop: 18,
                        textAlign: "center",
                    } as React.CSSProperties}
                >
                    <audio controls>
                        <source
                            src={question.audio}
                        />
                    </audio>
                </div>
            )}

        </div>

    );

}
