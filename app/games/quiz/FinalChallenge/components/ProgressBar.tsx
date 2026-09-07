import React from "react";

/* ==========================================================
   PROGRESS BAR
   Final Challenge
========================================================== */

interface ProgressBarProps {
    current?: number;
    total?: number;
}

export default function ProgressBar({
    current = 0,
    total = 0,
}: ProgressBarProps) {

    const percentage: number =
        total > 0
            ? Math.round(
                  ((current + 1) / total) * 100
              )
            : 0;

    return (

        <div
            style={{
                width: "100%",
                marginBottom: 20,
            } as React.CSSProperties}
        >
            {/* Encabezado */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: ".9rem",
                } as React.CSSProperties}
            >
                <span>
                    Question {current + 1} of {total}
                </span>

                <span>
                    {percentage}%
                </span>

            </div>

            {/* Barra */}

            <div className="fc-progress">
                <div

                    className="fc-progress-fill"
                    style={{ width: `${percentage}%` } as React.CSSProperties}
                />
            </div>

        </div>

    );

}
