import React from "react";

/* ==========================================================
   SNAP CARDS
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

    return (

        <div

            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            } as React.CSSProperties}
        >

            <div

                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "700",
                    fontSize: ".95rem",
                    color: "#444",
                } as React.CSSProperties}
            >

                <span>

                    Round {current} / {total}

                </span>

                <span>

                    {progress}%

                </span>

            </div>

            <div className="snap-progress">

                <div

                    className="snap-progress-fill"

                    style={{
                        width: `${progress}%`,
                    } as React.CSSProperties}

                />

            </div>

        </div>

    );

}
