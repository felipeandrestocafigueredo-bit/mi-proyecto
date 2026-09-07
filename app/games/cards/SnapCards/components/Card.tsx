import React from "react";

/* ==========================================================
   SNAP CARDS
   CARD COMPONENT
   Arquitectura 3.0
========================================================== */

interface CardProps {
    card: {
        id?: string;
        word: string;
        emoji?: string;
        image?: string;
        correct?: boolean;
        wrong?: boolean;
    };
    selected?: boolean;
    disabled?: boolean;
    onClick?: (card: { word: string; emoji?: string; image?: string }) => void;
}

export default function Card({
    card,
    selected = false,
    disabled = false,
    onClick,
}: CardProps) {

    function handleClick(): void {

        if (disabled) return;

        if (onClick) {

            onClick(card);

        }

    }

    let className = "snap-card";

    if (selected) {

        className += " selected";

    }

    if (card.correct) {

        className += " correct";

    }

    if (card.wrong) {

        className += " wrong";

    }

    if (disabled) {

        className += " disabled";

    }

    return (

        <button

            className={className}

            onClick={handleClick}

            disabled={disabled}

        >

            {card.image ? (

                <img

                    src={card.image}

                    alt={card.word}

                    style={{

                        width: "70px",

                        height: "70px",

                        objectFit: "contain",

                        marginBottom: "10px",

                    } as React.CSSProperties}

                />

            ) : (

                <div

                    style={{

                        fontSize: "3rem",

                        marginBottom: "10px",

                    } as React.CSSProperties}

                >

                    {card.emoji || "🃏"}

                </div>

            )}

            <div

                style={{

                    fontWeight: "700",

                    fontSize: "1rem",

                    textAlign: "center",

                } as React.CSSProperties}

            >

                {card.word}

            </div>

        </button>

    );

}
