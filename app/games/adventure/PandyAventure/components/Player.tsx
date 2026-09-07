import React from "react";

/* ============================================================
   PLAYER
   Panda jugador
   Arquitectura 3.0
============================================================ */

interface PlayerProps {
    lane?: number;
    lanes?: number[];
    animation?: string;
}

export default function Player({
    lane = 1,
    lanes = [20, 50, 80],
    animation = "idle",
}: PlayerProps) {

    return (

        <div

            className={`pa-panda ${animation}`}

            style={{

                left: `${lanes[lane]}%`,

                transition: "left .22s ease",

            } as React.CSSProperties}

        >

            🐼

        </div>

    );

}
