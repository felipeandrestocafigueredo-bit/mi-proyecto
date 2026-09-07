/* ==========================================================
   LESSON HEADER
   Arquitectura Oficial 3.0
========================================================== */

interface LessonHeaderProps {
    title: string;
    subtitle?: string;
    total?: number;
    label?: string;
}

export default function LessonHeader({
    title,
    subtitle = "English Lesson",
    total = 0,
    label = "Vocabulary Words",
}: LessonHeaderProps) {

    return (

        <div

            style={{

                background: "#fff",

                borderRadius: 18,

                padding: 24,

                marginBottom: 24,

                border: "2px solid rgba(36,31,26,.08)",

            }}

        >

            {/* Subtítulo */}

            <div

                style={{

                    fontSize: 14,

                    opacity: 0.6,

                    marginBottom: 8,

                    fontWeight: 600,

                }}

            >

                {subtitle}

            </div>

            {/* Título */}

            <h1

                style={{

                    margin: 0,

                    fontSize: 30,

                    fontWeight: 800,

                    color: "#243B53",

                }}

            >

                {title}

            </h1>

            {/* Información */}

            <p

                style={{

                    marginTop: 10,

                    marginBottom: 0,

                    opacity: 0.75,

                    color: "#64748B",

                    fontSize: 15,

                }}

            >

                {total} {label}

            </p>

        </div>

    );

}
