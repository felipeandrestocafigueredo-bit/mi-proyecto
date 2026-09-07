/* ==========================================================
   BINGO
   ENGINE
   Arquitectura Oficial 3.0
========================================================== */

import {

    BINGO_CONFIG,

    BINGO_MESSAGES,

} from "./data";

import {

    createBoard,

    shuffle,

    hasBingo,

    calculateProgress,

    successMessage,

    failMessage,

    BoardCell,

    VocabItem,

} from "./utils";

export interface BingoEngineReturn {
    start: () => void;
    markCell: (cell: BoardCell) => void;
    nextWord: () => void;
    timeout: () => void;
    finish: (win: boolean) => void;
    restart: () => void;
    getResults: () => {
        score: number;
        marked: number;
        total: number;
        progress: number;
    };
}

export interface BingoEngineProps {
    vocabulary: VocabItem[];
    game: BingoState & BingoActions;
}

interface BingoState {
    board: BoardCell[];
    currentWord: VocabItem | null;
    score: number;
    progress: number;
    marked: number;
    total: number;
    timeLeft: number;
    lives: number;
    playing: boolean;
    finished: boolean;
    message: string;
}

interface BingoActions {
    setBoard: React.Dispatch<React.SetStateAction<BoardCell[]>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentWord: React.Dispatch<React.SetStateAction<VocabItem | null>>;
    setMarked: React.Dispatch<React.SetStateAction<number>>;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setLives: React.Dispatch<React.SetStateAction<number>>;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    resetGame: () => void;
}

export default function BingoEngine({
    vocabulary = [],
    game,
}: BingoEngineProps): BingoEngineReturn {

    function start(): void {

        const board = createBoard(
            vocabulary
        );

        const words = shuffle(
            vocabulary
        );

        game.resetGame();

        game.setBoard(board);

        game.setTotal(board.length);

        game.setPlaying(true);

        game.setCurrentWord(
            words[0] || null
        );

        (game as any)._words = words;

        (game as any)._index = 0;

    }

    function markCell(cell: BoardCell): void {

        if (
            game.finished ||
            !game.playing ||
            !game.currentWord
        ) {
            return;
        }

        const correct: boolean =
            cell.word ===
            game.currentWord.word;

        if (correct) {

            const updated: BoardCell[] =
                game.board.map(
                    (item) =>
                        item.id === cell.id
                            ? {
                                  ...item,
                                  marked: true,
                              }
                            : item
                );

            game.setBoard(updated);

            game.setMarked(
                (value: number) => {
                    const next =
                        value + 1;
                    game.setProgress(
                        calculateProgress(
                            next,
                            game.total
                        )
                    );
                    return next;
                }
            );

            game.setScore(
                (value: number) =>
                    value +
                    BINGO_CONFIG.POINTS_PER_MATCH
            );

            game.setMessage(
                successMessage()
            );

            if (
                hasBingo(
                    updated
                )
            ) {
                finish(true);
                return;
            }

            nextWord();

        } else {

            game.setLives(
                (value: number) =>
                    Math.max(
                        0,
                        value - 1
                    )
            );

            game.setMessage(
                failMessage()
            );

            if (
                game.lives <= 1
            ) {
                finish(false);
            }

        }

    }

    function nextWord(): void {

        (game as any)._index += 1;

        if (
            (game as any)._index >=
            (game as any)._words.length
        ) {
            finish(true);
            return;
        }

        game.setCurrentWord(
            (game as any)._words[
                (game as any)._index
            ]
        );

    }

    function timeout(): void {

        game.setLives(
            (value: number) =>
                Math.max(
                    0,
                    value - 1
                )
        );

        game.setTimeLeft(
            BINGO_CONFIG.ROUND_TIME
        );

        game.setMessage(
            BINGO_MESSAGES.TIME
        );

        if (
            game.lives <= 1
        ) {
            finish(false);
        }

    }

    function finish(win: boolean = false): void {

        game.setPlaying(false);

        game.setFinished(true);

        game.setMessage(
            win
                ? BINGO_MESSAGES.BINGO
                : BINGO_MESSAGES.GAME_OVER
        );

    }

    function restart(): void {

        start();

    }

    function getResults() {

        return {
            score: game.score,
            marked: game.marked,
            total: game.total,
            progress: game.progress,
        };

    }

    return {

        start,

        markCell,

        nextWord,

        timeout,

        finish,

        restart,

        getResults,

    };

}
