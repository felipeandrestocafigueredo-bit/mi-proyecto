/* ==========================================================
   VOCABULARY CARD
   Arquitectura Oficial 3.0
========================================================== */

export interface WordData {
    id?: string | number;
    word: string;
    translation?: string;
    image?: string;
    emoji?: string;
    pronunciation?: string;
    sentence?: string;
    category?: string;
    unit?: string | number;
    [key: string]: unknown;
}

interface VocabularyCardProps {

    word: WordData;

    showSpanish?: boolean;

}

export default function VocabularyCard({
    word,
    showSpanish = true,
}: VocabularyCardProps) {

    if (!word) return null;

    const hasImage =
        typeof word.image === "string" &&
        (
            word.image.startsWith("http") ||
            word.image.includes("/") ||
            /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(word.image)
        );

    return (

        <div

            style={{

                background: "#fff",

                borderRadius: 18,

                padding: 22,

                border: "2px solid rgba(36,31,26,.08)",

                boxShadow: "0 8px 18px rgba(0,0,0,.06)",

                textAlign: "center",

                display: "flex",

                flexDirection: "column",

                height: "100%",

            }}

        >

            {/* ======================================
               Imagen o Emoji
            ====================================== */}

            <div

                style={{

                    height: 150,

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    marginBottom: 18,

                }}

            >

                {

                    hasImage ? (

                        <img

                            src={word.image}

                            alt={word.word}

                            loading="lazy"

                            style={{

                                maxWidth: "100%",

                                maxHeight: 140,

                                objectFit: "contain",

                            }}

                        />

                    ) : (

                        <div

                            style={{

                                fontSize: 90,

                                lineHeight: 1,

                            }}

                        >

                            {word.image || "📘"}

                        </div>

                    )

                }

            </div>

            {/* ======================================
               Palabra
            ====================================== */}

            <h2

                style={{

                    margin: 0,

                    color: "#243B53",

                    fontFamily: "Fredoka",

                    fontWeight: 700,

                }}

            >

                {word.word}

            </h2>

            {/* ======================================
               Traducción
            ====================================== */}

            {

                showSpanish && word.translation && (

                    <div

                        style={{

                            marginTop: 8,

                            color: "#2563EB",

                            fontSize: 18,

                            fontWeight: 700,

                        }}

                    >

                        {word.translation}

                    </div>

                )

            }

            {/* ======================================
               Pronunciación
            ====================================== */}

            {

                word.pronunciation && (

                    <div

                        style={{

                            marginTop: 12,

                            color: "#6B7280",

                            fontStyle: "italic",

                        }}

                    >

                        {word.pronunciation}

                    </div>

                )

            }

            {/* ======================================
               Oración
            ====================================== */}

            {

                word.sentence && (

                    <div

                        style={{

                            marginTop: 18,

                            color: "#374151",

                            lineHeight: 1.5,

                            fontSize: 15,

                            flex: 1,

                        }}

                    >

                        {word.sentence}

                    </div>

                )

            }

            {/* ======================================
               Información adicional
            ====================================== */}

            <div

                style={{

                    marginTop: 20,

                    display: "flex",

                    justifyContent: "center",

                    flexWrap: "wrap",

                    gap: 8,

                }}

            >

                {

                    word.category && (

                        <span

                            style={{

                                background: "#EEF2FF",

                                color: "#4338CA",

                                padding: "5px 12px",

                                borderRadius: 30,

                                fontSize: 12,

                                fontWeight: 700,

                            }}

                        >

                            {word.category}

                        </span>

                    )

                }

                {

                    word.unit && (

                        <span

                            style={{

                                background: "#DCFCE7",

                                color: "#166534",

                                padding: "5px 12px",

                                borderRadius: 30,

                                fontSize: 12,

                                fontWeight: 700,

                            }}

                        >

                            Unit {word.unit}

                        </span>

                    )

                }

            </div>

        </div>

    );
}
