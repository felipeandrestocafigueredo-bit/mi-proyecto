import React from "react";

/* ==========================================================
   WORD RACE
   LETTER BOX
   Arquitectura 3.0
========================================================== */

interface LetterBoxProps {
    value?: string;
    state?: string;
    index?: number;
    expected?: string;
}

export default function LetterBox({
    value = "",
    state = "normal",
    index = 0,
}: LetterBoxProps) {

    let className = "wordrace-letter";

    if (state === "correct") {
        className += " correct";
    }

    if (state === "wrong") {
        className += " wrong";
    }

    return (
        <div
            className={className}
            data-index={index}
        >
            {value
                ? value.toUpperCase()
                : ""}
        </div>
    );

}
