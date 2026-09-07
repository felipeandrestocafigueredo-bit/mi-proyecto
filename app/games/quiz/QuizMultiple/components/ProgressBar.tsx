import React from "react";

/* ==========================================================
   PROGRESS BAR
   Quiz Multiple
   Arquitectura 3.0
========================================================== */

interface ProgressBarProps {
    current?: number;
    total?: number;
    progress?: number;
    time?: number;
}

export default function ProgressBar({
    current = 1,
    total = 1,
    progress = 0,
    time = 20,
}: ProgressBarProps) {

    /*=========================================================
        Color del tiempo
    =========================================================*/

    let timerColor = "#22C55E";

    if (time <= 10) timerColor = "#F59E0B";

    if (time <= 5) timerColor = "#EF4444";

    /*=========================================================
        Render
    =========================================================*/

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 20,
            } as React.CSSProperties}
        >
            {/*==============================================
                Información superior
            ==============================================*/}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 700,
                } as React.CSSProperties}
            >
                <div>
                    Question {current} / {total}
                </div>
                <div>
                    {progress}%
                </div>
            </div>

            {/*==============================================
                Barra progreso
            ==============================================*/}

            <div
                style={{
                    width: "100%",
                    height: 14,
                    borderRadius: 50,
                    background: "#E5E7EB",
                    overflow: "hidden",
                } as React.CSSProperties}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        borderRadius: 50,
                        background: "linear-gradient(90deg,#6366F1,#3B82F6)",
                        transition: ".35s",
                    } as React.CSSProperties}
                />
            </div>

            {/*==============================================
                Tiempo restante
            ==============================================*/}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 4,
                } as React.CSSProperties}
            >
                <span
                    style={{
                        fontSize: ".90rem",
                        color: "#64748B",
                        fontWeight: 700,
                    } as React.CSSProperties}
                >
                    Remaining Time
                </span>

                <span
                    style={{
                        background: timerColor,
                        color: "#fff",
                        padding: "5px 14px",
                        borderRadius: 50,
                        fontWeight: 800,
                        minWidth: 60,
                        textAlign: "center",
                    } as React.CSSProperties}
                >
                    ⏱ {time}s
                </span>

            </div>

        </div>

    );

}
