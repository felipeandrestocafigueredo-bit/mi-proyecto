import React from "react";

interface MissionBarProps {
    targetWord?: string;
    progress?: number;
    time?: number;
    onSpeak?: () => void;
}

export default function MissionBar({
    targetWord,
    progress,
    time,
    onSpeak,
}: MissionBarProps) {
    return (
        <div

            style={{
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
            } as React.CSSProperties}
        >
            {/* Barra de progreso del mundo */}
            <div

                style={{
                    width: "100%",
                    height: 6,
                    background: "rgba(255,255,255,.12)",
                    borderRadius: 10,
                    overflow: "hidden",
                } as React.CSSProperties}
            >
                <div

                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                            "linear-gradient(90deg,#2EC4B6,#95E1D3)",
                        transition: "width .35s",
                    } as React.CSSProperties}
                />
            </div>

            {/* Panel de misión */}
            <div

                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,.12)",
                    backdropFilter: "blur(6px)",
                    borderRadius: 18,
                } as React.CSSProperties}
            >
                <button

                    onClick={onSpeak || (() => {})}

                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        background: "rgba(255,255,255,.15)",
                        color: "#fff",
                        fontSize: "1.15rem",
                        flexShrink: 0,
                    } as React.CSSProperties}
                >
                    🔊
                </button>

                <div

                    style={{
                        flex: 1,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1rem",
                    } as React.CSSProperties}
                >
                    Find the{" "}
                    <span

                        style={{
                            color: "#FFD93D",
                            fontWeight: 900,
                        } as React.CSSProperties}
                    >
                        {targetWord}
                    </span>
                    !
                </div>
            </div>

            {/* Barra de tiempo */}
            <div

                style={{
                    width: "100%",
                    height: 5,
                    background: "rgba(255,255,255,.12)",
                    borderRadius: 10,
                    overflow: "hidden",
                } as React.CSSProperties}
            >
                <div

                    style={{
                        width: `${time}%`,
                        height: "100%",
                        background:
                            (time ?? 0) > 70
                                ? "#FF6B6B"
                                : "#2EC4B6",
                        transition: "width .1s linear",
                    } as React.CSSProperties}
                />
            </div>
        </div>
    );
}
