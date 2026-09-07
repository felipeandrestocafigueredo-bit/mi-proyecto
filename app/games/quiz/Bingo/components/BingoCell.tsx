import React from "react";

/* ==========================================================
   BINGO
   CELL COMPONENT
   Arquitectura Oficial 3.0
========================================================== */

interface CellData {
    id: number;
    word: string;
    image?: string;
    marked: boolean;
}

interface BingoCellProps {
    cell: CellData;
    disabled?: boolean;
    onClick?: (cell: CellData) => void;
}

export default function BingoCell({
    cell,
    disabled = false,
    onClick,
}: BingoCellProps) {

    function handleClick(): void {

        if (disabled) return;

        if (cell.marked) return;

        if (onClick) {

            onClick(cell);

        }

    }

    const className: string = [
        "bingo-cell",
        cell.marked ? "marked correct" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (

        <button
            className={className}
            onClick={handleClick}
            disabled={disabled || cell.marked}
        >
            {cell.image ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                    } as React.CSSProperties}
                >
                    <img
                        src={cell.image}
                        alt={cell.word}
                        style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                        } as React.CSSProperties}
                    />
                    <strong>{cell.word}</strong>
                </div>
            ) : (
                <span
                    style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        textAlign: "center",
                    } as React.CSSProperties}
                >
                    {cell.word}
                </span>
            )}
        </button>

    );

}
