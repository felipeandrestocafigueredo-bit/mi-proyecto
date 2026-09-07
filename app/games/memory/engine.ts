/*
=========================================================

PANDY MEMORY
ENGINE
Arquitectura Oficial 3.0

Toda la lógica del juego vive aquí.

Responsabilidades

✓ Voltear cartas
✓ Comparar parejas
✓ Actualizar puntuación
✓ Controlar vidas
✓ Finalizar partida
✓ Reiniciar

=========================================================
*/

import {
    MEMORY_CONFIG,
    SUCCESS_MESSAGES,
    FAIL_MESSAGES,
} from "./data";

import { MemoryGameState, CardItem } from "./types";

interface MemoryEngineProps {
    game: MemoryGameState;
}

interface MemoryEngineReturn {
    restart: () => void;
    timeout: () => void;
    flipCard: (cardId: string) => void;
}

export default function MemoryEngine({
    game,
}: MemoryEngineProps): MemoryEngineReturn {

    /*======================================================
        Reiniciar juego
    ======================================================*/

    function restart(): void {

        game.restart();

    }

    /*======================================================
        Tiempo agotado
    ======================================================*/

    function timeout(): void {

        game.finish(false);

    }

    /*======================================================
        Voltear carta
    ======================================================*/

    function flipCard(cardId: string): void {

        if (!game.playing) return;

        if (game.finished) return;

        if (game.flipped.includes(cardId)) return;

        if (game.matched.includes(cardId)) return;

        if (game.flipped.length === 2) return;

        game.flip(cardId);

        const nextFlipped = [...game.flipped, cardId];

        if (nextFlipped.length !== 2) return;

        const first = game.cards.find((c: CardItem) => c.id === nextFlipped[0]);
        const second = game.cards.find((c: CardItem) => c.id === nextFlipped[1]);

        if (!first || !second) return;

        game.addAttempt();

        /*==============================================
            Pareja correcta
        ==============================================*/

        if (first.word === second.word) {

            setTimeout(() => {

                game.match(first.id, second.id);

                game.addScore(
                    MEMORY_CONFIG.pairPoints
                );

                game.addCombo();

                game.showMessage(
                    randomSuccess()
                );

                if (
                    game.stats.matches + 1 >= game.totalPairs
                ) {
                    game.finish(true);
                }

            }, 350);

        }

        /*==============================================
            Pareja incorrecta
        ==============================================*/

        else {

            setTimeout(() => {

                game.unflip();

                game.removeLife();

                game.resetCombo();

                game.showMessage(
                    randomFail()
                );

                if (game.lives <= 1) {
                    game.finish(false);
                }

            }, MEMORY_CONFIG.flipDelay);

        }

    }

    /*======================================================
        Mensajes
    ======================================================*/

    function randomSuccess(): string {

        return SUCCESS_MESSAGES[
            Math.floor(
                Math.random() *
                SUCCESS_MESSAGES.length
            )
        ];

    }

    function randomFail(): string {

        return FAIL_MESSAGES[
            Math.floor(
                Math.random() *
                FAIL_MESSAGES.length
            )
        ];

    }

    /*======================================================
        API pública
    ======================================================*/

    return {

        flipCard,

        timeout,

        restart,

    };

}
