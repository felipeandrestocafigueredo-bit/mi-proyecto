import React from "react";

/* ==========================================================
   TO BE QUEST
   PROGRESS BAR
   Arquitectura 3.0
========================================================== */

interface ProgressBarProps {
    current: number;
    total: number;
    progress: number;
    time?: number;
}

export default function ProgressBar({
    current,
    total,
    progress,
    time,
}: ProgressBarProps) {

    /*=========================================================
        Color del temporizador
    =========================================================*/

    const timerColor: string =
        time !== undefined && time > 10
            ? "#22C55E"
            : time !== undefined && time > 5
            ? "#F59E0B"
            : "#EF4444";

    return (

        <div
            className="tobe-card"
            style={{ marginBottom: 20, padding: 18 }}
        >

            {/*==============================================
                Encabezado
            ==============================================*/}

            <div

                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                } as React.CSSProperties}
            >
                <div

                    style={{
                        fontWeight: 800,
                        color: "#1E3A8A",
                        fontSize: ".95rem",
                    } as React.CSSProperties}
                >
                    📘 Question {current} of {total}
                </div>

                <div
                    className="tobe-timer"
                    style={{ background: timerColor } as React.CSSProperties}
                >
                    ⏱ {time}s
                </div>

            </div>

            {/*==============================================
                Barra progreso
            ==============================================*/}

            <div className="tobe-progress">
                <div

                    className="tobe-progress-fill"
                    style={{ width: `${progress}%` } as React.CSSProperties}
                />
            </div>

            {/*==============================================
                Porcentaje
            ==============================================*/}

            <div

                style={{
                    marginTop: 10,
                    textAlign: "right",
                    fontSize: ".85rem",
                    fontWeight: 700,
                    color: "#64748B",
                } as React.CSSProperties}
            >
                {progress}%
            </div>

        </div>

    );

}
