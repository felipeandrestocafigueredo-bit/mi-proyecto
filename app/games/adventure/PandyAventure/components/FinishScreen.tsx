import React from "react";

interface FinishScreenProps {
    world: {
        id: string;
        name: string;
        grad: [string, string];
    };
    result: ResultData;
    onReplay: () => void;
    onNext: (() => void) | null;
    onWorlds: () => void;
    onBack: () => void;
}

interface ResultData {
    correct: number;
    total: number;
    stars: number;
    worldIndex: number;
    score?: number;
}

export default function FinishScreen({
    world,
    result,
    onReplay,
    onNext,
    onWorlds,
    onBack,
}: FinishScreenProps) {
    if (!world || !result) return null;

    const accuracy = result.total
        ? Math.round((result.correct / result.total) * 100)
        : 0;

    const trophy =
        result.stars === 3
            ? "🥇"
            : result.stars === 2
            ? "🥈"
            : "📖";

    return (
        <div

            style={{
                fontFamily: "'Nunito',sans-serif",
                textAlign: "center",
            } as React.CSSProperties}
        >
            <div

                style={{
                    background: `linear-gradient(135deg,${world.grad[0]},${world.grad[1]})`,
                    borderRadius: 20,
                    padding: 24,
                    color: "#fff",
                    marginBottom: 20,
                    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
                } as React.CSSProperties}
            >
                <div

                    style={{
                        fontSize: "3.5rem",
                        marginBottom: 10,
                    } as React.CSSProperties}
                >
                    {trophy}
                </div>

                <h2

                    style={{
                        margin: 0,
                        marginBottom: 8,
                    } as React.CSSProperties}
                >
                    ¡Misión Completada!
                </h2>

                <p

                    style={{
                        margin: 0,
                        opacity: .9,
                    } as React.CSSProperties}
                >
                    Mundo:
                    <strong> {world.name}</strong>
                </p>

                <div

                    style={{
                        fontSize: "1.8rem",
                        marginTop: 14,
                        letterSpacing: 5,
                    } as React.CSSProperties}
                >
                    {"⭐".repeat(result.stars)}
                    {"☆".repeat(3 - result.stars)}
                </div>
            </div>

            {/* Estadísticas */}

            <div

                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10,
                    marginBottom: 22,
                } as React.CSSProperties}
            >
                <StatCard
                    value={result.score}
                    label="Score"
                />

                <StatCard
                    value={`${result.correct}/${result.total}`}
                    label="Correctas"
                />

                <StatCard
                    value={`${accuracy}%`}
                    label="Precisión"
                />
            </div>

            {/* Botones */}

            <div

                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                } as React.CSSProperties}
            >
                {onNext && (
                    <button

                        onClick={onNext}

                        style={buttonGreen}
                    >
                        ▶ Siguiente Mundo
                    </button>
                )}

                <button

                    onClick={onReplay}

                    style={buttonBlue}
                >
                    🔄 Jugar nuevamente
                </button>

                <button

                    onClick={onWorlds}

                    style={buttonGray}
                >
                    🗺 Elegir Mundo
                </button>

                <button

                    onClick={onBack}

                    style={buttonTransparent}
                >
                    ← Volver al Panel
                </button>
            </div>
        </div>
    );
}

/* =====================================================
    Tarjeta estadística
===================================================== */

interface StatCardProps {
    value: string | number | undefined;
    label: string;
}

function StatCard({ value, label }: StatCardProps) {
    return (
        <div

            style={{
                background: "#fff",
                borderRadius: 14,
                padding: 14,
                boxShadow: "0 4px 10px rgba(0,0,0,.08)",
            } as React.CSSProperties}
        >
            <h2

                style={{
                    margin: 0,
                    color: "#2D3047",
                } as React.CSSProperties}
            >
                {value}
            </h2>

            <small

                style={{
                    color: "#666",
                    fontWeight: 700,
                    textTransform: "uppercase",
                } as React.CSSProperties}
            >
                {label}
            </small>
        </div>
    );
}

/* =====================================================
    Botones reutilizables
===================================================== */

const buttonGreen: React.CSSProperties = {
    background: "linear-gradient(135deg,#2EC4B6,#18A999)",
    color: "#fff",
    border: "none",
    borderRadius: 40,
    padding: "14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "1rem",
};

const buttonBlue: React.CSSProperties = {
    background: "linear-gradient(135deg,#6C5CE7,#4A3FC4)",
    color: "#fff",
    border: "none",
    borderRadius: 40,
    padding: "14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "1rem",
};

const buttonGray: React.CSSProperties = {
    background: "#F4F4F4",
    color: "#333",
    border: "2px solid #DDD",
    borderRadius: 40,
    padding: "14px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "1rem",
};

const buttonTransparent: React.CSSProperties = {
    background: "transparent",
    color: "#666",
    border: "2px solid rgba(0,0,0,.12)",
    borderRadius: 40,
    padding: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: ".9rem",
};
