import React from "react";

/*
==========================================================

PANDY MEMORY
MEMORY CARD
Arquitectura Oficial 3.0

Responsabilidades

✓ Mostrar carta cerrada
✓ Mostrar carta abierta
✓ Mostrar imagen
✓ Mostrar palabra
✓ Mostrar estado correcto
✓ Animación Flip

==========================================================
*/

interface CardItem {
    id: string;
    word: string;
    translation?: string;
    image?: string;
    audio?: string;
}

interface MemoryCardProps {
    card: CardItem;
    flipped?: boolean;
    matched?: boolean;
    onClick?: (cardId: string) => void;
    colors?: { main?: string; dark?: string };
}

export default function MemoryCard({
    card,
    flipped = false,
    matched = false,
    onClick,
    colors = {},
}: MemoryCardProps) {

    const accent: string = colors.main || "#2563EB";

    const disabled: boolean = flipped || matched;

    return (

        <div

            onClick={() => {

                if (!disabled) {

                    onClick && onClick(card.id);

                }

            }}

            style={{
                perspective: 1000,
                cursor: disabled
                    ? "default"
                    : "pointer",
                userSelect: "none",
            } as React.CSSProperties}
        >

            <div

                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1",
                    transformStyle: "preserve-3d",
                    transition: "transform .45s",
                    transform: flipped || matched
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                } as React.CSSProperties}
            >

                {/*==========================================
                    PARTE TRASERA
                ==========================================*/}

                <div

                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        background: `linear-gradient(135deg,
                            ${accent},
                            ${colors.dark || "#1E3A8A"})`,
                        border: "3px solid rgba(255,255,255,.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 46,
                        color: "#FFFFFF",
                        backfaceVisibility: "hidden",
                        boxShadow: "0 8px 18px rgba(0,0,0,.15)",
                    } as React.CSSProperties}
                >
                    🧠
                </div>

                {/*==========================================
                    PARTE DELANTERA
                ==========================================*/}

                <div

                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        background: "#FFFFFF",
                        border: matched
                            ? "3px solid #22C55E"
                            : "2px solid rgba(36,31,26,.10)",
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden",
                        boxShadow: "0 8px 18px rgba(0,0,0,.12)",
                    } as React.CSSProperties}
                >

                    {/* Imagen */}

                    <div

                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 12,
                        } as React.CSSProperties}
                    >
                        {card.image ? (

                            <img

                                src={card.image}

                                alt={card.word}

                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                } as React.CSSProperties}
                            />
                        ) : (
                            <div style={{ fontSize: 52 }}>
                                📘
                            </div>
                        )}
                    </div>

                    {/* Palabra */}

                    <div

                        style={{
                            padding: 12,
                            textAlign: "center",
                            borderTop: "1px solid rgba(36,31,26,.08)",
                        } as React.CSSProperties}
                    >
                        <div

                            style={{
                                fontFamily: "'Fredoka', sans-serif",
                                fontWeight: 700,
                                fontSize: 17,
                                color: "#243B53",
                            } as React.CSSProperties}
                        >
                            {card.word}
                        </div>

                        {card.translation && (
                            <div

                                style={{
                                    marginTop: 4,
                                    fontSize: 13,
                                    color: "#64748B",
                                } as React.CSSProperties}
                            >
                                {card.translation}
                            </div>
                        )}
                    </div>

                    {matched && (
                        <div

                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                fontSize: 24,
                            } as React.CSSProperties}
                        >
                            ✅
                        </div>
                    )}

                </div>

            </div>

        </div>

    );

}
