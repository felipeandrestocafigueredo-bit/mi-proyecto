import React from "react";

/*
==========================================================

PANDY MEMORY
FINISH SCREEN
Arquitectura Oficial 3.0

Responsabilidades

✓ Mostrar resultado final
✓ Mostrar puntuación
✓ Mostrar estrellas
✓ Mostrar estadísticas
✓ Repetir juego
✓ Volver a mundos
✓ Salir

==========================================================
*/

interface FinishScreenProps {
    stats?: {
        matches?: number;
        attempts?: number;
        combo?: number;
    };
    stars?: number;
    score?: number;
    onReplay?: () => void;
    onWorlds?: () => void;
    onBack?: () => void;
}

export default function FinishScreen({
    stats = {},
    stars = 0,
    score = 0,
    onReplay,
    onWorlds,
    onBack,
}: FinishScreenProps) {

    const {
        matches = 0,
        attempts = 0,
        combo = 0,
    } = stats;

    return (

        <div

            style={{
                maxWidth: 760,
                margin: "40px auto",
                background: "#FFFFFF",
                borderRadius: 24,
                padding: 36,
                border: "2px solid rgba(36,31,26,.08)",
                boxShadow: "0 12px 28px rgba(0,0,0,.12)",
                textAlign: "center",
            } as React.CSSProperties}
        >

            {/*======================================
                Título
            ======================================*/}

            <div

                style={{
                    fontSize: 70,
                } as React.CSSProperties}
            >
                🎉
            </div>

            <h1

                style={{
                    marginTop: 12,
                    marginBottom: 10,
                    fontFamily: "'Fredoka', sans-serif",
                    color: "#243B53",
                    fontSize: 36,
                } as React.CSSProperties}
            >
                ¡Juego terminado!
            </h1>

            <p

                style={{
                    color: "#64748B",
                    lineHeight: 1.7,
                    marginBottom: 30,
                } as React.CSSProperties}
            >
                Excelente trabajo.
                Has completado todas las parejas del tablero.
            </p>

            {/*======================================
                Estrellas
            ======================================*/}

            <div

                style={{
                    fontSize: 48,
                    marginBottom: 28,
                } as React.CSSProperties}
            >
                {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i}>
                        {i < stars ? "⭐" : "☆"}
                    </span>
                ))}
            </div>

            {/*======================================
                Estadísticas
            ======================================*/}

            <div

                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                    gap: 18,
                    marginBottom: 32,
                } as React.CSSProperties}
            >
                <StatCard
                    emoji="🏆"
                    title="Puntos"
                    value={score}
                    color="#2563EB"
                />
                <StatCard
                    emoji="✅"
                    title="Parejas"
                    value={matches}
                    color="#22C55E"
                />
                <StatCard
                    emoji="🎯"
                    title="Intentos"
                    value={attempts}
                    color="#F59E0B"
                />
                <StatCard
                    emoji="🔥"
                    title="Combo"
                    value={combo}
                    color="#EF4444"
                />
            </div>

            {/*======================================
                Botones
            ======================================*/}

            <div

                style={{
                    display: "flex",
                    gap: 14,
                    justifyContent: "center",
                    flexWrap: "wrap",
                } as React.CSSProperties}
            >
                <button

                    onClick={onReplay}

                    style={button("#22C55E")}
                >
                    🔄 Jugar otra vez
                </button>

                <button

                    onClick={onWorlds}

                    style={button("#2563EB")}
                >
                    🌍 Cambiar mundo
                </button>

                <button

                    onClick={onBack}

                    style={button("#64748B")}
                >
                    ⬅ Salir
                </button>
            </div>

        </div>

    );

}

/*==========================================================

Tarjeta estadística

==========================================================*/

interface StatCardProps {
    emoji: string;
    title: string;
    value: string | number;
    color: string;
}

function StatCard({ emoji, title, value, color }: StatCardProps) {
    return (
        <div

            style={{
                background: "#F8FAFC",
                borderRadius: 18,
                padding: 20,
                border: "2px solid rgba(36,31,26,.06)",
            } as React.CSSProperties}
        >
            <div

                style={{
                    fontSize: 34,
                } as React.CSSProperties}
            >
                {emoji}
            </div>

            <div

                style={{
                    marginTop: 10,
                    fontWeight: 700,
                    color: "#64748B",
                    fontSize: 13,
                    textTransform: "uppercase",
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

/*==========================================================

Estilo botones

==========================================================*/

function button(background: string): React.CSSProperties {
    return {
        border: "none",
        borderRadius: 14,
        padding: "14px 24px",
        background,
        color: "#FFFFFF",
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer",
        transition: ".25s",
        boxShadow: "0 6px 14px rgba(0,0,0,.12)",
    };
}
