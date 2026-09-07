import React from "react";

import MemoryCard from "./MemoryCard";

/*
==========================================================

PANDY MEMORY
MEMORY BOARD
Arquitectura Oficial 3.0

Responsabilidades

✓ Mostrar todas las cartas
✓ Organizar automáticamente la cuadrícula
✓ Adaptarse al número de cartas
✓ Delegar los clics al Engine

==========================================================
*/

interface MemoryBoardProps {
    cards?: CardItem[];
    flipped?: string[];
    matched?: string[];
    onCardClick?: (cardId: string) => void;
    colors?: Record<string, string>;
}

interface CardItem {
    id: string;
    word: string;
    translation?: string;
    image?: string;
    audio?: string;
}

export default function MemoryBoard({
    cards = [],
    flipped = [],
    matched = [],
    onCardClick,
    colors = {},
}: MemoryBoardProps) {

    if (!cards.length) {

        return (

            <div

                style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#64748B",
                    fontSize: 18,
                    fontWeight: 600,
                } as React.CSSProperties}
            >
                No hay cartas disponibles.
            </div>

        );

    }

    /*======================================================
        Número de columnas automático
    ======================================================*/

    let columns = 4;

    if (cards.length <= 8) columns = 4;

    else if (cards.length <= 12) columns = 4;

    else if (cards.length <= 16) columns = 4;

    else if (cards.length <= 20) columns = 5;

    else columns = 6;

    return (

        <div

            style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(110px,1fr))`,
                gap: 16,
                justifyContent: "center",
                alignItems: "stretch",
            } as React.CSSProperties}
        >
            {cards.map((card) => (
                <MemoryCard
                    key={card.id}
                    card={card}
                    flipped={flipped.includes(card.id)}
                    matched={matched.includes(card.id)}
                    colors={colors}
                    onClick={onCardClick}
                />
            ))}
        </div>

    );

}
