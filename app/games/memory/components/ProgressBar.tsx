import React from "react";

/*
==========================================================

PANDY MEMORY
PROGRESS BAR
Arquitectura Oficial 3.0

Responsabilidades

✓ Mostrar progreso
✓ Mostrar porcentaje
✓ Mostrar parejas encontradas
✓ Barra animada

==========================================================
*/

interface ProgressBarProps {
    progress?: number;
    matched?: number;
    total?: number;
    colors?: { main?: string; dark?: string };
}

export default function ProgressBar({
    progress = 0,
    matched = 0,
    total = 0,
    colors = {},
}: ProgressBarProps) {

    const main: string = colors.main || "#2563EB";

    const dark: string = colors.dark || "#1E3A8A";

    return (

        <div

            style={{
                background: "#FFFFFF",
                borderRadius: 18,
                padding: 18,
                border: "2px solid rgba(36,31,26,.08)",
                boxShadow: "0 6px 14px rgba(0,0,0,.06)",
                marginBottom: 20,
            } as React.CSSProperties}
        >

            {/*==============================
                Encabezado
            ==============================*/}

            <div

                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                } as React.CSSProperties}
            >

                <div>

                    <div

                        style={{
                            fontFamily: "'Fredoka', sans-serif",
                            fontWeight: 700,
                            fontSize: 18,
                            color: "#243B53",
                        } as React.CSSProperties}
                    >
                        📈 Progreso
                    </div>

                    <div

                        style={{
                            marginTop: 4,
                            color: "#64748B",
                            fontSize: 13,
                        } as React.CSSProperties}
                    >
                        Parejas encontradas
                    </div>

                </div>

                <div

                    style={{
                        textAlign: "right",
                    } as React.CSSProperties}
                >
                    <div

                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            fontFamily: "'Fredoka', sans-serif",
                            color: main,
                        } as React.CSSProperties}
                    >
                        {progress}%
                    </div>

                    <div

                        style={{
                            color: "#64748B",
                            fontSize: 13,
                        } as React.CSSProperties}
                    >
                        {matched} / {total}
                    </div>

                </div>

            </div>

            {/*==============================
                Barra
            ==============================*/}

            <div

                style={{
                    width: "100%",
                    height: 18,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "#E5E7EB",
                } as React.CSSProperties}
            >

                <div

                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        transition: ".45s",
                        borderRadius: 999,
                        background: `linear-gradient(90deg,
                            ${main},
                            ${dark})`,
                    } as React.CSSProperties}
                />

            </div>

        </div>

    );

}
