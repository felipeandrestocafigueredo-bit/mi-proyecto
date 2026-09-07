import React from "react";

/* ==========================================================
   WORD RACE
   KEYBOARD
   Arquitectura 3.0
========================================================== */

const LETTERS = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z"
];

interface KeyboardProps {
    disabled?: boolean;
    usedLetters?: string[];
    onLetter?: (letter: string) => void;
    onDelete?: () => void;
    onClear?: () => void;
}

export default function Keyboard({
    disabled = false,
    usedLetters = [],
    onLetter,
    onDelete,
    onClear,
}: KeyboardProps) {

    function handleLetter(letter: string): void {

        if (disabled) return;

        if (onLetter) {

            onLetter(letter);

        }

    }

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
            } as React.CSSProperties}
        >
            <div className="wordrace-keyboard">
                {LETTERS.map((letter) => (
                    <button
                        key={letter}
                        className="wordrace-key"
                        disabled={disabled || usedLetters.includes(letter)}
                        onClick={() => handleLetter(letter)}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                } as React.CSSProperties}
            >
                <button
                    className="wordrace-button"
                    disabled={disabled}
                    onClick={onDelete}
                >
                    ⌫ Delete
                </button>

                <button
                    className="wordrace-button"
                    disabled={disabled}
                    onClick={onClear}
                >
                    🗑 Clear
                </button>

            </div>

        </div>

    );

}
