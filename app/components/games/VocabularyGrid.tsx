import VocabularyCard from "./VocabularyCard";
import { WordData } from "./VocabularyCard";

/* ==========================================================
   VOCABULARY GRID
   Arquitectura Oficial 3.0

   Responsabilidades

   ✓ Mostrar todas las palabras.
   ✓ Utilizar VocabularyCard.
   ✓ Adaptarse automáticamente.
   ✓ No valida datos.
   ✓ No conoce EmptyState.

========================================================== */

interface VocabularyGridProps {

    vocabulary: Array<Record<string, unknown>>;

    showSpanish?: boolean;

}

export default function VocabularyGrid({
    vocabulary = [],
    showSpanish = true,
}: VocabularyGridProps) {

    return (

        <div

            style={{

                display: "grid",

                gridTemplateColumns:

                    "repeat(auto-fit,minmax(260px,1fr))",

                gap: 20,

                alignItems: "stretch",

            }}

        >

            {

                vocabulary.map((word, index) => (

                    <VocabularyCard

                        key={String(word.id) || String(index)}

                        word={word as WordData}

                        showSpanish={showSpanish}

                    />

                ))

            }

        </div>

    );
}
