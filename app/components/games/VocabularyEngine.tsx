import { Vocabulary } from "../../data/vocabulary";

/* ==========================================================
   VOCABULARY ENGINE
   Arquitectura Oficial 3.0

   Responsabilidades

   ✓ Buscar el vocabulario del tema.
   ✓ Validar si existe.
   ✓ Entregar los datos mediante Render Props.
   ✓ NO renderiza interfaz.
   ✓ NO conoce Flashcards.
   ✓ NO conoce Juegos.

========================================================== */

interface VocabularyEngineProps {

    topic: string;

    children: (data: {

        topic: string;

        vocabulary: Array<Record<string, unknown>>;

        exists: boolean;

        total: number;

    }) => React.ReactNode;

}

interface VocabularyData {
    topic: string;
    vocabulary: Array<Record<string, unknown>>;
    exists: boolean;
    total: number;
}

export default function VocabularyEngine({
    topic,
    children,
}: VocabularyEngineProps) {

    /* ======================================================
       Buscar vocabulario
    ====================================================== */

    const vocabulary = (Vocabulary?.[topic] ?? []) as Array<Record<string, unknown>>;

    /* ======================================================
       Información entregada al Viewer
    ====================================================== */

    const data: VocabularyData = {

        topic,

        vocabulary,

        exists: vocabulary.length > 0,

        total: vocabulary.length,

    };

    /* ======================================================
       Render Props
    ====================================================== */

    if (typeof children === "function") {

        return children(data);

    }

    return null;

}
