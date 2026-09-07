import React from "react";

import BingoCell from "./BingoCell";

/* ==========================================================
   BINGO
   BOARD COMPONENT
   Arquitectura Oficial 3.0
========================================================== */

interface BoardCell {
    id: number;
    word: string;
    image?: string;
    marked: boolean;
}

interface BingoBoardProps {
    board?: BoardCell[];
    disabled?: boolean;
    onCellClick?: (cell: BoardCell) => void;
}

export default function BingoBoard({
    board = [],
    disabled = false,
    onCellClick,
}: BingoBoardProps) {

    if (!board.length) {

        return (
            <div
                className="bingo-board"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "220px",
                } as React.CSSProperties}
            >
                <h3
                    style={{
                        color: "#64748B",
                    } as React.CSSProperties}
                >
                    Loading board...
                </h3>
            </div>
        );

    }

    return (

        <div className="bingo-board">
            {board.map((cell) => (
                <BingoCell
                    key={cell.id}
                    cell={cell}
                    disabled={disabled}
                    onClick={onCellClick}
                />
            ))}
        </div>

    );

}
