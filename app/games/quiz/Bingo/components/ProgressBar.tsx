import React from "react";

/* ==========================================================
   BINGO
   PROGRESS BAR
   Arquitectura Oficial 3.0
========================================================== */

interface ProgressBarProps {
    progress?: number;
    marked?: number;
    total?: number;
}

export default function ProgressBar({
    progress = 0,
    marked = 0,
    total = 0,
}: ProgressBarProps) {

    const value = Math.max(
        0,
        Math.min(100, progress)
    );

    return (

        <div className="bingo-progress-wrapper">

            <div className="bingo-progress-info">
                <span>Progress</span>
                <span>{marked} / {total}</span>
            </div>

            <div className="bingo-progress">
                <div

                    className="bingo-progress-fill"
                    style={{ width: `${value}%` } as React.CSSProperties}
                />
            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "8px",
                    fontWeight: "700",
                    color: "#475569",
                } as React.CSSProperties}
            >
                {value}%
            </div>

        </div>

    );

}
