interface GameEngine {
    start?: () => void;
    stop?: () => void;
    reset?: () => void;
}

export function startGame(engine: GameEngine | null): void {
    if (engine && typeof engine.start === "function") {
        engine.start();
    }
}

export function stopGame(engine: GameEngine | null): void {
    if (engine && typeof engine.stop === "function") {
        engine.stop();
    }
}

export function resetGame(engine: GameEngine | null): void {
    if (engine && typeof engine.reset === "function") {
        engine.reset();
    }
}

export default {
    start: startGame,
    stop: stopGame,
    reset: resetGame,
};
