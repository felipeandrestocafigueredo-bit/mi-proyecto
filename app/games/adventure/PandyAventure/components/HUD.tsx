import React from "react";

interface HUDProps {
    playerName: string;
    lives: number;
    coins: number;
    score: number;
    onBack: () => void;
}

export default function HUD({
    playerName,
    lives,
    coins,
    score,
    onBack,
}: HUDProps) {
    return (
        <div

            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "rgba(255,255,255,.08)",
                borderBottom: "1px solid rgba(255,255,255,.12)",
            } as React.CSSProperties}
        >
            <button

                onClick={onBack}

                style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: "rgba(255,255,255,.15)",
                    color: "#fff",
                    fontSize: "1rem",
                } as React.CSSProperties}
            >
                ←
            </button>

            <div

                style={{
                    flex: 1,
                    fontWeight: 800,
                    color: "#fff",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                } as React.CSSProperties}
            >
                🐼 {playerName}
            </div>

            <div

                style={{
                    background: "rgba(255,255,255,.12)",
                    padding: "6px 10px",
                    borderRadius: 20,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: ".8rem",
                } as React.CSSProperties}
            >
                ❤️ {lives}
            </div>

            <div

                style={{
                    background: "rgba(255,255,255,.12)",
                    padding: "6px 10px",
                    borderRadius: 20,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: ".8rem",
                } as React.CSSProperties}
            >
                🪙 {coins}
            </div>

            <div

                style={{
                    background: "rgba(255,255,255,.12)",
                    padding: "6px 10px",
                    borderRadius: 20,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: ".8rem",
                } as React.CSSProperties}
            >
                ⭐ {score}
            </div>
        </div>
    );
}
