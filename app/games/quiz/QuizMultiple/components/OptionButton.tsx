import React from "react";

/* ==========================================================
   OPTION BUTTON
   Quiz Multiple
   Arquitectura 3.0
========================================================== */

interface OptionButtonProps {
    option: string;
    index: number;
    selected?: string | null;
    correct: string;
    disabled?: boolean;
    onSelect?: (option: string) => void;
}

export default function OptionButton({
    option,
    index,
    selected,
    correct,
    disabled,
    onSelect,
}: OptionButtonProps) {

    /*=========================================================
        Estado visual
    =========================================================*/

    let className = "quiz-option";

    if (disabled) {
        className += " disabled";
    }

    if (selected !== null) {
        if (option === correct) {
            className += " correct";
        } else if (option === selected) {
            className += " wrong";
        }
    }

    /*=========================================================
        Letras A B C D
    =========================================================*/

    const letter: string = ["A", "B", "C", "D"][index] || "";

    /*=========================================================
        Render
    =========================================================*/

    return (

        <button
            className={className}
            disabled={disabled}
            onClick={() => onSelect && onSelect(option)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
                padding: "16px",
                borderRadius: 18,
                border: "none",
                cursor: disabled ? "default" : "pointer",
            } as React.CSSProperties}
        >
            {/*==============================================
                Letra
            ==============================================*/}

            <div
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: selected !== null && option === correct
                        ? "#16A34A"
                        : selected !== null && option === selected
                        ? "#DC2626"
                        : "#6366F1",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: ".95rem",
                    flexShrink: 0,
                } as React.CSSProperties}
            >
                {letter}
            </div>

            {/*==============================================
                Texto
            ==============================================*/}

            <div
                style={{
                    flex: 1,
                    textAlign: "left",
                    fontSize: "1rem",
                    fontWeight: 700,
                    fontFamily: "'Nunito',sans-serif",
                } as React.CSSProperties}
            >
                {option}
            </div>

            {/*==============================================
                Iconos
            ==============================================*/}

            {selected !== null && option === correct && (
                <div style={{ fontSize: "1.3rem" }}>
                    ✅
                </div>
            )}

            {selected !== null &&
                option === selected &&
                option !== correct && (
                <div style={{ fontSize: "1.3rem" }}>
                    ❌
                </div>
            )}
        </button>

    );

}
