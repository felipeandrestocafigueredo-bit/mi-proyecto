/* ==========================================================
   GAME LAUNCHER
   Arquitectura Oficial 3.0

   Única puerta de entrada para todos los juegos.

   Responsabilidades

   ✓ Buscar el juego registrado.
   ✓ Renderizar el juego.
   ✓ Mostrar errores.
   ✓ Pasar la información de la lección.
========================================================== */

import { getGameComponent } from "../../games";

import Button from "../common/Button";
import EmptyState from "../common/EmptyState";

/* ======================================================
   Normalizar vocabulario académico al formato de juegos
   El academic data usa: en, es, emoji
   Los juegos esperan: word, translation, image, emoji
   ====================================================== */

function normalizeVocab(vocab: unknown[]): Array<Record<string, unknown>> {
    if (!Array.isArray(vocab)) return [];

    return vocab.map((item) => {
        const itemObj = item as Record<string, unknown>;
        return {
            ...itemObj,
            word: itemObj.word ?? itemObj.en ?? itemObj.text ?? "",
            translation: itemObj.translation ?? itemObj.es ?? "",
            image: itemObj.image ?? itemObj.img ?? "",
            emoji: itemObj.emoji ?? "🎮",
            id: itemObj.id ?? itemObj.en ?? itemObj.word ?? "",
        };
    });
}

interface GameLauncherProps {
    lesson: Record<string, unknown>;
    gameId: string;
    colors: {
        main?: string;
        [key: string]: unknown;
    };
    onBack: () => void;
}

export default function GameLauncher({
    lesson,
    gameId,
    colors,
    onBack,
}: GameLauncherProps) {

    /* ======================================================
       Buscar juego registrado
    ====================================================== */

    const GameComponent = getGameComponent(gameId);

    if (!GameComponent) {
        return (
            <div
                style={{
                    padding: 40,
                    display: "grid",
                    gap: 20,
                    justifyItems: "center",
                    alignContent: "center",
                }}
            >
                <EmptyState
                    text={`El juego "${gameId}" no está registrado en la plataforma.`}
                />

                <Button onClick={onBack}>
                    ← Volver
                </Button>
            </div>
        );
    }

    /* ======================================================
       Ejecutar juego
    ====================================================== */

    const Component = GameComponent as React.ComponentType<{
        lesson: Record<string, unknown>;
        vocab: Record<string, unknown>[];
        colors: { main?: string; [key: string]: unknown };
        onBack: () => void;
        onExit: () => void;
    }>;

    return (
        <Component
            lesson={lesson}
            vocab={normalizeVocab(
                Array.isArray(lesson?.vocab) ? lesson.vocab : []
            )}
            colors={colors}
            onBack={onBack}
            onExit={onBack}
        />
    );
}
