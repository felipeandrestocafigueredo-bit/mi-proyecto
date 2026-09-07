import React from "react";
import Player from "./Player";

/* ============================================================
   WORLD
   Escenario de Pandy Adventure
   Arquitectura 3.0
============================================================ */

interface WorldProps {
    world?: { id: string; name: string; grad: [string, string]; words: { word: string; emoji: string }[] };
    engine?: { target?: { word: string } | null; progress: number; time: number; playerLane: number; playerAnimation: string; speakWord: () => void };
    options?: { word: string; emoji: string }[];
    lane?: number;
    lanes?: number[];
    animation?: string;
    progress?: number;
    feedback?: { ok: boolean; msg: string; hint?: string } | null;
    unlocked?: boolean;
    stars?: number;
    onClick?: () => void;
    onLaneClick?: (index: number) => void;
}

export default function World({
    options = [],
    lane = 1,
    lanes = [20, 50, 80],
    animation = "idle",
    progress = 0,
    feedback = null,
    onLaneClick,
}: WorldProps) {

    return (

        <>

            {/* ==========================
                Barra de tiempo
            =========================== */}

            <div

                style={{
                    padding: "4px 10px 0",
                    flexShrink: 0,
                } as React.CSSProperties}
            >

                <div

                    className="pa-progress"
                >

                    <div

                        className="pa-progress-fill"

                        style={{
                            width: `${progress}%`,
                            background:
                                progress > 70
                                    ? "#FF6B6B"
                                    : "#2EC4B6",
                        } as React.CSSProperties}
                    />

                </div>

            </div>


            {/* ==========================
                Escenario
            =========================== */}

            <div className="pa-stage">

                {/* Carriles */}

                {[33.33, 66.66].map((left) => (

                    <div

                        key={left}

                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: left + "%",
                            borderLeft:
                                "2px dashed rgba(255,255,255,.15)",
                        } as React.CSSProperties}
                    />

                ))}


                {/* Objetos */}

                {options.map((item, index) => (

                    <div

                        key={item.word + index}

                        className="pa-item"

                        style={{
                            left: lanes[index] + "%",
                            top: (progress * 0.58) + "%",
                            transform: "translate(-50%,0)",
                            animationDelay: (index * .35) + "s",
                        } as React.CSSProperties}

                    >

                        <div className="pa-item-emoji">

                            {item.emoji}

                        </div>

                        <div className="pa-item-label">

                            {item.word}

                        </div>

                    </div>

                ))}


                {/* Panda */}

                <Player

                    lane={lane}

                    lanes={lanes}

                    animation={animation}

                />

            </div>


            {/* ==========================
                Botones inferiores
            =========================== */}

            <div className="pa-lanes">

                {options.map((item, index) => (

                    <button

                        key={item.word}

                        className={
                            lane === index
                                ? "pa-lane active"
                                : "pa-lane"
                        }

                        onClick={() => onLaneClick && onLaneClick(index)}

                    >

                        <div

                            style={{
                                fontSize: "1.8rem",
                            } as React.CSSProperties}
                        >

                            {item.emoji}

                        </div>

                        <div

                            style={{
                                marginTop: 4,
                                fontWeight: 800,
                                fontSize: ".70rem",
                            } as React.CSSProperties}
                        >

                            {item.word}

                        </div>

                    </button>

                ))}

            </div>


            {/* ==========================
                Feedback
            =========================== */}

            {feedback && (

                <div className="pa-feedback">

                    <div className="pa-feedback-card">

                        <div

                            style={{
                                fontSize: "2.6rem",
                                marginBottom: 8,
                            } as React.CSSProperties}
                        >

                            {feedback.ok ? "✅" : "❌"}

                        </div>

                        <div

                            style={{
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                color: feedback.ok
                                    ? "#95E1D3"
                                    : "#FF6B6B",
                            } as React.CSSProperties}
                        >

                            {feedback.msg}

                        </div>

                        {feedback.hint && (

                            <div

                                style={{
                                    marginTop: 10,
                                    fontSize: ".8rem",
                                    opacity: .75,
                                } as React.CSSProperties}
                            >

                                💡 {feedback.hint}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </>

    );

}
