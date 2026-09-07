import EmptyState from "../common/EmptyState";

/* ==========================================================
   LESSON ENGINE
   Arquitectura Oficial 3.0

   Responsabilidad:

   ✓ Localizar la lección seleccionada.
   ✓ Validar la planificación.
   ✓ Preparar la información oficial.
   ✓ Entregar lessonData mediante Render Props.

   NO renderiza:

   - Juegos
   - Flashcards
   - Recursos
   - Presentación
   - Worksheet

========================================================== */

interface LessonEngineProps {
    planner: Record<string, Record<string, unknown[]>> | null | undefined;
    grade: string;
    month: string;
    week: string;
    children: (lessonData: Record<string, unknown>) => React.ReactNode;
}

interface LessonData extends Record<string, unknown> {
    grade: string;
    month: string;
    week: string;
    vocab: Array<Record<string, unknown>>;
    games: unknown[];
    resources: unknown[];
    presentation: Record<string, unknown>;
    worksheet: Record<string, unknown>;
    pronunciation: unknown[];
    hasVocabulary: boolean;
    hasGames: boolean;
    hasResources: boolean;
    hasPresentation: boolean;
    hasWorksheet: boolean;
    hasPronunciation: boolean;
}

interface RawLesson {
    vocab?: Array<Record<string, unknown>>;
    games?: unknown[];
    resources?: unknown[];
    presentation?: Record<string, unknown>;
    worksheet?: Record<string, unknown>;
    pronunciation?: unknown[];
    id?: string;
    tema?: string;
    topic?: string;
    fecha?: string;
    badge?: string;
    [key: string]: unknown;
}

export default function LessonEngine({
    planner,
    grade,
    month,
    week,
    children,
}: LessonEngineProps) {

    /* ======================================================
       Validar planificación
    ====================================================== */

    if (!planner) {

        return (

            <EmptyState

                text="No existe planificación para este grado."

            />

        );

    }

    /* ======================================================
       Buscar mes
    ====================================================== */

    const monthLessons = planner?.[month];

    if (!monthLessons) {

        return (

            <EmptyState

                text="Este mes todavía no tiene contenido."

            />

        );

    }

    /* ======================================================
       Buscar semana
    ====================================================== */

    const lesson = monthLessons?.[week] as unknown as RawLesson | undefined;

    if (!lesson) {

        return (

            <EmptyState

                text="Esta semana aún no tiene contenido."

            />

        );

    }

    /* ======================================================
       Construcción del objeto oficial de la lección
    ====================================================== */

    const lessonData = Object.freeze({

        ...lesson,

        grade,

        month,

        week,

        vocab: (lesson.vocab ?? []).map((v, i) => {
            // If already in expected shape (word), keep it
            if (v && (v.word || v.text || v.title)) return v;
            // If bilingual shape with en/es, normalize to { word, translation }
            if (v && (v.en || v.es)) {
                return {
                    ...v,
                    id: v.id || `${lesson.id || 'lesson'}-vocab-${i}`,
                    word: v.en || v.word || '',
                    translation: v.es || v.translation || '',
                };
            }
            // Fallback: return original object with generated id
            return { ...v, id: v?.id || `${lesson.id || 'lesson'}-vocab-${i}` };
        }),

        games: lesson.games ?? [],

        resources: lesson.resources ?? [],

        presentation: lesson.presentation ?? {},

        worksheet: lesson.worksheet ?? {},

        pronunciation: lesson.pronunciation ?? [],

        /* ===============================
           Estados rápidos
        =============================== */

        hasVocabulary:

            (lesson.vocab ?? []).length > 0,

        hasGames:

            (lesson.games ?? []).length > 0,

        hasResources:

            (lesson.resources ?? []).length > 0,

        hasPresentation:

            !!lesson.presentation,

        hasWorksheet:

            !!lesson.worksheet,

        hasPronunciation:

            (lesson.pronunciation ?? []).length > 0,

    } as LessonData);

    /* ======================================================
       Render Props
    ====================================================== */

    if (typeof children === "function") {

        return children(lessonData);

    }

    /* ======================================================
       Respaldo
    ====================================================== */

    return (

        <EmptyState

            text="LessonEngine no está siendo utilizado por ningún componente."

        />

    );

}
