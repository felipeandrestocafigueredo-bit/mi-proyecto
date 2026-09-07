import React from "react";

/* ==========================================================
   TO BE QUEST
   OPTION BUTTON
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

    let className = "tobe-option";

    if (disabled) {
        if (option === correct) {
            className += " correct";
        }
        else if (
            option === selected &&
            selected !== correct
        ) {
            className += " wrong";
        }
    }

    /*=========================================================
        Letras A B C D
    =========================================================*/

    const letters = [
        "A",
        "B",
        "C",
        "D",
    ];

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
                textAlign: "left",
                transition: ".25s",
            } as React.CSSProperties}
        >

            {/*==============================================
                Letra
            ==============================================*/}

            <div

                style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: disabled && option === correct
                        ? "#22C55E"
                        : disabled && selected === option && selected !== correct
                        ? "#EF4444"
                        : "#3B82F6",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1rem",
                    flexShrink: 0,
                } as React.CSSProperties}
            >
                {letters[index]}
            </div>

            {/*==============================================
                Texto
            ==============================================*/}

            <div

                style={{
                    flex: 1,
                    fontWeight: 700,
                    fontSize: "1rem",
                } as React.CSSProperties}
            >
                {option}
            </div>

            {/*==============================================
                Icono resultado
            ==============================================*/}

            {disabled && option === correct && (
                <div style={{ fontSize: "1.3rem" }}>
                    ✅
                </div>
            )}

            {disabled &&
                option === selected &&
                selected !== correct && (
                <div style={{ fontSize: "1.3rem" }}>
                    ❌
                </div>
            )}
        </button>

    );

}
