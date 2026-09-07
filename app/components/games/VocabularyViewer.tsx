import VocabularyEngine from "./VocabularyEngine";
import VocabularyGrid from "./VocabularyGrid";
import EmptyState from "../common/EmptyState";

/* ==========================================================
   VOCABULARY VIEWER
   Arquitectura Oficial 3.0

   Responsabilidades

   ✓ Conectar VocabularyEngine.
   ✓ Validar existencia del vocabulario.
   ✓ Mostrar EmptyState cuando no exista.
   ✓ Enviar los datos al VocabularyGrid.

========================================================== */

interface VocabularyViewerProps {

    topic: string;

    showSpanish?: boolean;

}

export default function VocabularyViewer({
    topic,
    showSpanish = true,
}: VocabularyViewerProps) {

    return (

        <VocabularyEngine

            topic={topic}

        >

            {

                ({
                    vocabulary,
                    exists,
                }: {

                    vocabulary: Array<Record<string, unknown>>;

                    exists: boolean;

                }) => {

                    if (!exists) {

                        return (

                            <EmptyState

                                text={`No existe vocabulario para "${topic}".`}

                            />

                        );

                    }

                    return (

                        <VocabularyGrid

                            vocabulary={vocabulary}

                            showSpanish={showSpanish}

                        />

                    );

                }

            }

        </VocabularyEngine>

    );
}
