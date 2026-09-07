import LessonGames from "../LessonEngine/LessonGames";

/* ==========================================================
   GAMES TAB
   Arquitectura Oficial 3.0

   Responsabilidades

   ✓ Mostrar el panel de juegos.
   ✓ Delegar toda la lógica en LessonGames.
   ✓ No contiene lógica de juegos.
========================================================== */

import type { Lesson } from "../../models/LessonModel";

interface GamesTabProps {
  lesson?: Lesson | null;
  colors: Record<string, string>;
  onPlay?: (gameId: string) => void;
}

export default function GamesTab({
  lesson,
  colors,
  onPlay,
}: GamesTabProps) {

    return (
        <LessonGames
            lesson={((lesson ?? {}) as unknown) as Record<string, unknown>}
            colors={colors}
            onPlay={onPlay}
        />
    );

}