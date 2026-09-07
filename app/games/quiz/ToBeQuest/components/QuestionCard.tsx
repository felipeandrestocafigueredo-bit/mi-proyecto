import React from "react";

/* ==========================================================
   TO BE QUEST
   QUESTION CARD
   Arquitectura 3.0
========================================================== */

interface Question {
    question: string;
    options: string[];
    correct: string;
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

        <div className="tobe-card tobe-pop">

            {/*==============================================
                Encabezado
            ==============================================*/}

            <div

                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                } as React.CSSProperties}
            >
                <div

                    style={{
                        background: "#DBEAFE",
                        color: "#1D4ED8",
                        padding: "6px 14px",
                        borderRadius: 50,
                        fontWeight: 700,
                    } as React.CSSProperties}
                >
                    📘 Question {current}
                </div>

                <div

                    style={{
                        color: "#64748B",
                        fontWeight: 700,
                    } as React.CSSProperties}
                >
                    {current} / {total}
                </div>

            </div>

            {/*==============================================
                Barra de progreso
            ==============================================*/}

            <div
                className="tobe-progress"
                style={{ marginBottom: 24 }}
            >
                <div

                    className="tobe-progress-fill"
                    style={{ width: `${progress}%` } as React.CSSProperties}
                />
            </div>

            {/*==============================================
                Icono principal
            ==============================================*/}

            <div

                style={{
                    textAlign: "center",
                    fontSize: "3.5rem",
                    marginBottom: 20,
                } as React.CSSProperties}
            >
                👨‍🏫
            </div>

            {/*==============================================
                Pregunta
            ==============================================*/}

            <h2

                style={{
                    textAlign: "center",
                    color: "#1E293B",
                    fontFamily: "'Fredoka',sans-serif",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    marginBottom: 18,
                } as React.CSSProperties}
            >
                {question.question}
            </h2>

            {/*==============================================
                Instrucción
            ==============================================*/}

            <p

                style={{
                    textAlign: "center",
                    color: "#64748B",
                    fontSize: ".95rem",
                    margin: 0,
                } as React.CSSProperties}
            >
                Choose the correct answer.
            </p>

        </div>

    );

}
