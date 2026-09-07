import { useState } from "react";

/* ==========================================================
   MONTH PREMIACIÓN
   Arquitectura Oficial 3.0

   Podio editable del mes.

========================================================== */

interface MonthPremiacionProps {

    mesIdx: number;

    colors: {

        text: string;

        [key: string]: unknown;

    };

}

interface PodioState {

    primero: string;

    segundo: string;

    tercero: string;

}

interface PlaceConfig {

    key: keyof PodioState;

    title: string;

    height: number;

    color: string;

}

export default function MonthPremiacion({
    mesIdx,
    colors,
}: MonthPremiacionProps) {

    const [podio, setPodio] = useState<PodioState>({

        primero: "",

        segundo: "",

        tercero: "",

    });

    function update(position: keyof PodioState, value: string): void {

        setPodio((old) => ({

            ...old,

            [position]: value,

        }));

    }

    const places: PlaceConfig[] = [

        {

            key: "segundo",

            title: "🥈 Segundo",

            height: 130,

            color: "#CBD5E1",

        },

        {

            key: "primero",

            title: "🥇 Primero",

            height: 180,

            color: "#FACC15",

        },

        {

            key: "tercero",

            title: "🥉 Tercero",

            height: 110,

            color: "#D97706",

        },

    ];

    return (

        <div

            style={{

                marginTop: 26,

                background: "#fff",

                borderRadius: 22,

                padding: 26,

                border: "2px solid rgba(36,31,26,.08)",

                boxShadow: "0 10px 22px rgba(0,0,0,.06)",

            }}

        >

            <h2

                style={{

                    marginTop: 0,

                    marginBottom: 8,

                    fontFamily: "Fredoka",

                    color: colors.text,

                }}

            >

                🏆 Premiación del Mes

            </h2>

            <div

                style={{

                    color: "#64748B",

                    marginBottom: 24,

                    lineHeight: 1.6,

                }}

            >

                Registra los estudiantes que obtuvieron el mejor
                desempeño durante el juego mensual.

            </div>

            {/* =========================
               PODIO
            ========================= */}

            <div

                style={{

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "flex-end",

                    gap: 18,

                    flexWrap: "wrap",

                }}

            >

                {

                    places.map((place) => (

                        <div

                            key={place.key}

                            style={{

                                width: 180,

                                textAlign: "center",

                            }}

                        >

                            <input

                                value={podio[place.key]}

                                onChange={(e) =>

                                    update(

                                        place.key,

                                        e.target.value

                                    )

                                }

                                placeholder="Nombre"

                                style={{

                                    width: "100%",

                                    marginBottom: 10,

                                    padding: 10,

                                    borderRadius: 10,

                                    border: "2px solid rgba(36,31,26,.10)",

                                    textAlign: "center",

                                    fontWeight: 700,

                                    fontSize: 15,

                                }}

                            />

                            <div

                                style={{

                                    height: place.height,

                                    borderRadius: "18px 18px 0 0",

                                    background: place.color,

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    flexDirection: "column",

                                    color: "#fff",

                                    fontWeight: 800,

                                    fontFamily: "Fredoka",

                                    fontSize: 18,

                                }}

                            >

                                <div

                                    style={{

                                        fontSize: 42,

                                    }}

                                >

                                    {

                                        place.key === "primero"

                                            ? "👑"

                                            : place.key === "segundo"

                                            ? "🥈"

                                            : "🥉"

                                    }

                                </div>

                                {place.title}
                            </div>

                        </div>

                    ))

                }

            </div>

            {/* =========================
               MES
            ========================= */}

            <div

                style={{

                    marginTop: 22,

                    textAlign: "center",

                    color: colors.text,

                    fontWeight: 700,

                    fontSize: 14,

                }}

            >

                📅 Premiación correspondiente al mes #{mesIdx + 1}

            </div>

        </div>

    );
}
