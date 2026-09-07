import React from "react";

import { formatTime } from "../utils";

/*
==========================================================

PANDY MEMORY
SCORE BOARD
Arquitectura Oficial 3.0

Responsabilidades

✓ Mostrar puntuación
✓ Mostrar vidas
✓ Mostrar tiempo
✓ Mostrar combo

==========================================================
*/

interface ScoreBoardProps {
    stats?: Record<string, unknown>;
    score?: number;
    combo?: number;
    lives?: number;
    timeLeft?: number;
    colors?: { main?: string };
}

export default function ScoreBoard({
    stats = {},
    score = 0,
    combo = 0,
    lives = 5,
    timeLeft = 90,
    colors = {},
}: ScoreBoardProps) {

    const main: string = colors.main || "#2563EB";

    return (

        <div

            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                gap: 16,
                marginBottom: 20,
            } as React.CSSProperties}
        >

            {/*==================================
                Puntuación
            ==================================*/}

            <Panel
                emoji="🏆"
                title="Puntos"
                value={score}
                color={main}
            />

            {/*==================================
                Vidas
            ==================================*/}

            <Panel
                emoji="❤️"
                title="Vidas"
                value={lives}
                color="#EF4444"
            />

            {/*==================================
                Tiempo
            ==================================*/}

            <Panel
                emoji="⏱️"
                title="Tiempo"
                value={formatTime(timeLeft)}
                color="#F59E0B"
            />

            {/*==================================
                Combo
            ==================================*/}

            <Panel
                emoji="🔥"
                title="Combo"
                value={combo}
                color="#22C55E"
            />

        </div>

    );
}

/*==========================================================

Panel reutilizable

==========================================================*/

interface PanelProps {
    emoji: string;
    title: string;
    value: string | number;
    color: string;
}

function Panel({
    emoji,
    title,
    value,
    color,
}: PanelProps) {

    return (

        <div

            style={{
                background: "#FFFFFF",
                borderRadius: 18,
                padding: 18,
                border: "2px solid rgba(36,31,26,.08)",
                boxShadow: "0 6px 14px rgba(0,0,0,.06)",
                textAlign: "center",
            } as React.CSSProperties}
        >

            <div

                style={{
                    fontSize: 34,
                    marginBottom: 8,
                } as React.CSSProperties}
            >
                {emoji}
            </div>

            <div

                style={{
                    fontSize: 13,
                    color: "#64748B",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: .5,
                } as React.CSSProperties}
            >
                {title}
            </div>

            <div

                style={{
                    marginTop: 8,
                    fontSize: 28,
                    fontWeight: 800,
                    color,
                    fontFamily: "'Fredoka', sans-serif",
                } as React.CSSProperties}
            >
                {value}
            </div>

        </div>

    );

}
