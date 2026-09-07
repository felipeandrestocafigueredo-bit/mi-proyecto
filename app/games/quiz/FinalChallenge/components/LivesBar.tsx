import React from "react";

/* ==========================================================
   LIVES BAR
   Final Challenge
   Arquitectura 3.0
========================================================== */

interface LivesBarProps {
    lives?: number;
    maxLives?: number;
}

export default function LivesBar({
    lives = 3,
    maxLives = 3,
}: LivesBarProps) {

    return (

        <div

            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                marginBottom: 18,
            } as React.CSSProperties}
        >
            {Array.from({ length: maxLives }).map((_, index) => (
                <span
                    key={index}
                    style={{
                        fontSize: "2rem",
                        transition: "all .25s ease",
                        transform: index < lives
                            ? "scale(1)"
                            : "scale(.9)",
                        opacity: index < lives
                            ? 1
                            : 0.35,
                        filter: index < lives
                            ? "drop-shadow(0 2px 4px rgba(255,0,0,.35))"
                            : "grayscale(100%)",
                    } as React.CSSProperties}
                >
                    {index < lives ? "❤️" : "🩶"}
                </span>
            ))}
        </div>

    );

}
