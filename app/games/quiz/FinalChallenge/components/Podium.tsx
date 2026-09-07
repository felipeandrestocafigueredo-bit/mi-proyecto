import React from "react";

/* ==========================================================
   PODIUM
   Final Challenge
   Arquitectura 3.0
========================================================== */

interface PodiumProps {
    stars?: number;
}

export default function Podium({
    stars = 1,
}: PodiumProps) {

    const first: boolean = stars >= 3;

    const second: boolean = stars === 2;

    const third: boolean = stars <= 1;

    return (

        <div
            className="fc-podium"
            style={{
                marginTop: 30,
                marginBottom: 30,
            } as React.CSSProperties}
        >
            {/* Segundo */}

            <div
                className={`fc-place second ${second ? "fc-pulse" : ""}`}
                style={{
                    transform: second
                        ? "scale(1.05)"
                        : "scale(.95)",
                } as React.CSSProperties}
            >
                <div style={{ fontSize: "2.5rem" }}>
                    🥈
                </div>
                <strong>2nd</strong>
                <small>Silver</small>
            </div>

            {/* Primero */}

            <div
                className={`fc-place first ${first ? "fc-pulse" : ""}`}
                style={{
                    transform: first
                        ? "scale(1.12)"
                        : "scale(1)",
                } as React.CSSProperties}
            >
                <div style={{ fontSize: "3rem" }}>
                    👑
                </div>
                <div style={{ fontSize: "3rem" }}>
                    🥇
                </div>
                <strong>1st</strong>
                <small>Champion</small>
            </div>

            {/* Tercero */}

            <div
                className={`fc-place third ${third ? "fc-pulse" : ""}`}
                style={{
                    transform: third
                        ? "scale(1.05)"
                        : "scale(.95)",
                } as React.CSSProperties}
            >
                <div style={{ fontSize: "2.5rem" }}>
                    🥉
                </div>
                <strong>3rd</strong>
                <small>Explorer</small>
            </div>

        </div>

    );

}
