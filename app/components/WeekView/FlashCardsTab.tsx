import EmptyState from "../common/EmptyState";

import FlashcardsGame from "../games/FlashCardsGame";

/* ==========================================================
   FLASHCARDS TAB
   Arquitectura Oficial 3.0

   Esta pestaña solamente envía el vocabulario
   al juego Flashcards.

========================================================== */

import type { Lesson } from "../../models/LessonModel";

interface FlashCardsTabProps {
  lesson?: Lesson | null;
  colors: Record<string, string>;
  onOpenSlides?: () => void;
}

export default function FlashcardsTab({
  lesson,
  colors,
  onOpenSlides,
}: FlashCardsTabProps) {

    if (!lesson?.vocab?.length) {
 
        return (
 
            <div
                style={{
                    display: "grid",
                    gap: 16,
                }}
            >
                <EmptyState
                    text="Esta semana todavía no tiene Flashcards."
                />
            </div>
 
        );
 
    }
 
    return (
 
        <div
            style={{
                display: "grid",
                gap: 16,
            }}
        >
            <FlashcardsGame
                vocab={lesson.vocab}
                colors={colors}
            />
        </div>
 
    );

}