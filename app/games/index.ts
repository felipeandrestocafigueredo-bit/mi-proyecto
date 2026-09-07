/* ==========================================================
   GAMES INDEX
   Arquitectura Oficial 3.0

   Registro central de todos los juegos.
========================================================== */

/* ==========================================================
   ADVENTURE
========================================================== */

import PandyAdventure from "./adventure/PandyAventure/PandyAdventure";

/* ==========================================================
   MEMORY
========================================================== */

import PandyMemory from "./memory/PandyMemory";

/* ==========================================================
   CARDS
========================================================== */

import SnapCards from "./cards/SnapCards/SnapCards";

/* ==========================================================
   QUIZ
========================================================== */

import QuizMultiple from "./quiz/QuizMultiple/QuizMultiple";
import Bingo from "./quiz/Bingo/Bingo";
import FinalChallenge from "./quiz/FinalChallenge/FinalChallenge";
import ToBeQuest from "./quiz/ToBeQuest/ToBeQuest";

/* ==========================================================
   RACE
========================================================== */

import WordRace from "./race/WordRace/WordRace";

/* ==========================================================
   GAME ENGINES
========================================================== */

import AudioEngine from "./engine/AudioEngine";
import GameEngine from "./engine/GameEngine";
import ProgressEngine from "./engine/ProgressEngine";
import ScoreEngine from "./engine/ScoreEngine";
import StorageEngine from "./engine/StorageEngine";

/* ==========================================================
   HOOKS
========================================================== */

import useAudio from "./hooks/useAudio";
import useCountdown from "./hooks/useCountdown";
import useGameState from "./hooks/useGameState";
import useScore from "./hooks/useScore";

/* ==========================================================
   EXPORTACIONES
========================================================== */

export {
    PandyAdventure,
    PandyMemory,
    SnapCards,
    QuizMultiple,
    Bingo,
    FinalChallenge,
    ToBeQuest,
    WordRace,

    AudioEngine,
    GameEngine,
    ProgressEngine,
    ScoreEngine,
    StorageEngine,

    useAudio,
    useCountdown,
    useGameState,
    useScore,
};

/* ==========================================================
   GAME REGISTRY
   Único lugar donde se registran los juegos.
========================================================== */

export const GAME_REGISTRY = {

    pandyAdventure: PandyAdventure,

    pandyMemory: PandyMemory,

    snapCards: SnapCards,

    quizMultiple: QuizMultiple,

    bingo: Bingo,

    finalChallenge: FinalChallenge,

    toBeQuest: ToBeQuest,

    wordRace: WordRace,

};

/* ==========================================================
   Obtener componente del juego
========================================================== */

const GAME_COMPONENT_ALIASES: Record<string, string> = {
    memory: "pandyMemory",
    pandymemory: "pandyMemory",
    wordsearch: "pandyMemory",
    flashcards: "pandyMemory",
    matching: "snapCards",
    snapcards: "snapCards",
    wordrace: "wordRace",
    wordracegame: "wordRace",
    scramble: "wordRace",
    hangman: "wordRace",
    truefalsegame: "quizMultiple",
    fillblank: "quizMultiple",
    quiz: "quizMultiple",
    quizmultiple: "quizMultiple",
    finalchallenge: "finalChallenge",
    finalchallange: "finalChallenge",
    tobequest: "toBeQuest",
    adventure: "pandyAdventure",
    pandyadventure: "pandyAdventure",
    bingo: "bingo",
};

export function getGameComponent(gameId: string): React.ComponentType | null {
    if (!gameId || typeof gameId !== "string") {
        return null;
    }

    const normalized = GAME_COMPONENT_ALIASES[gameId.toLowerCase()] ?? gameId;
    return (GAME_REGISTRY as any)[normalized] || null;
}

/* ==========================================================
   Obtener lista de juegos registrados
========================================================== */

export function getRegisteredGames(): string[] {

    return Object.keys(GAME_REGISTRY);

}

/* ==========================================================
   Validar si un juego existe
========================================================== */

export function hasGame(gameId: string): boolean {

    return gameId in GAME_REGISTRY;

}
