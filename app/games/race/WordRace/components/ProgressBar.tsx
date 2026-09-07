import React from "react";

/* ==========================================================
   WORD RACE
   PROGRESS BAR
   Arquitectura 3.0
========================================================== */

interface ProgressBarProps {
    progress?: number;
    current?: number;
    total?: number;
}

export default function ProgressBar({
    progress = 0,
    current = 0,
    total = 0,
}: ProgressBarProps) {

    const value = Math.min(
        100,
        Math.max(0, progress)
    );

    return (
        <div
            style={{
                width: "100%",
                marginBottom: "20px",
            } as React.CSSProperties}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontWeight: "700",
                    color: "#334155",
                } as React.CSSProperties}
            >
                <span>Progress</span>
                <span>{current} / {total}</span>
            </div>

            <div className="wordrace-progress">
                <div

                    className="wordrace-progress-fill"
                    style={{ width: `${value}%` } as React.CSSProperties}
                />
            </div>

        </div>
    );

}
