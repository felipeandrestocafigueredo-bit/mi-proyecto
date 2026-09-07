import React from "react";

/* ==========================================================
   OPTION BUTTON
   Final Challenge
========================================================== */

interface OptionButtonProps {
    text: string;
    onClick?: () => void;
    selected?: boolean;
    correct?: boolean;
    wrong?: boolean;
    disabled?: boolean;
}

export default function OptionButton({
    text,
    onClick,
    selected = false,
    correct = false,
    wrong = false,
    disabled = false,
}: OptionButtonProps) {

    let className = "fc-option";

    if (correct) {
        className += " correct";
    }
    else if (wrong) {
        className += " wrong";
    }

    return (

        <button
            className={className}
            disabled={disabled}
            onClick={onClick}

            style={{
                opacity: disabled ? 0.75 : 1,
                cursor: disabled
                    ? "default"
                    : "pointer",
                transform: selected
                    ? "scale(1.02)"
                    : "scale(1)",
                boxShadow: selected
                    ? "0 0 0 3px rgba(37,99,235,.20)"
                    : "none",
                transition: "all .20s ease",
            } as React.CSSProperties}
        >

            <div

                style={{
                    width: 34,
                    height: 34,
                    minWidth: 34,
                    borderRadius: "50%",
                    background: correct
                        ? "#22C55E"
                        : wrong
                        ? "#EF4444"
                        : selected
                        ? "#2563EB"
                        : "#CBD5E1",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1rem",
                } as React.CSSProperties}
            >
                {correct ? "✓" : wrong ? "✕" : "•"}
            </div>

            <div

                style={{
                    flex: 1,
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0F172A",
                    lineHeight: 1.4,
                } as React.CSSProperties}
            >
                {text}
            </div>

        </button>

    );

}
