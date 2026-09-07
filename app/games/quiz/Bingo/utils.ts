/* ==========================================================
   BINGO
   UTILS
   Arquitectura Oficial 3.0
========================================================== */

import {

    BINGO_CONFIG,

    BINGO_MESSAGES,

} from "./data";

/* ==========================================================
   RANDOM
========================================================== */

export function randomItem<T>(array: T[]): T {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}

export function shuffle<T>(array: T[]): T[] {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            copy[i],
            copy[j],
        ] = [
            copy[j],
            copy[i],
        ];

    }

    return copy;

}

/* ==========================================================
   BUILD BOARD
========================================================== */

export interface VocabItem {
    word: string;
    emoji?: string;
    image?: string;
}

export interface BoardCell {
    id: number;
    marked: boolean;
    word: string;
    emoji?: string;
    image?: string;
}

export function createBoard(vocabulary: VocabItem[] = []): BoardCell[] {

    const total: number =
        BINGO_CONFIG.GRID_SIZE *
        BINGO_CONFIG.GRID_SIZE;

    return shuffle(vocabulary)
        .slice(0, total)
        .map((item, index) => ({
            id: index,
            marked: false,
            ...item,
        }));

}

/* ==========================================================
   CHECK PATTERNS
========================================================== */

export function checkRows(board: BoardCell[]): boolean {

    const size: number =
        BINGO_CONFIG.GRID_SIZE;

    for (
        let r = 0;
        r < size;
        r++
    ) {
        let ok = true;

        for (
            let c = 0;
            c < size;
            c++
        ) {
            if (
                !board[r * size + c]?.marked
            ) {
                ok = false;
                break;
            }
        }

        if (ok) return true;

    }

    return false;

}

export function checkColumns(board: BoardCell[]): boolean {

    const size: number =
        BINGO_CONFIG.GRID_SIZE;

    for (
        let c = 0;
        c < size;
        c++
    ) {
        let ok = true;

        for (
            let r = 0;
            r < size;
            r++
        ) {
            if (
                !board[r * size + c]?.marked
            ) {
                ok = false;
                break;
            }
        }

        if (ok) return true;

    }

    return false;

}

export function checkDiagonal(board: BoardCell[]): boolean {

    const size: number =
        BINGO_CONFIG.GRID_SIZE;

    let left = true;

    let right = true;

    for (
        let i = 0;
        i < size;
        i++
    ) {
        if (
            !board[i * size + i]?.marked
        ) {
            left = false;
        }
        if (
            !board[i * size + (size - i - 1)]?.marked
        ) {
            right = false;
        }
    }

    return left || right;

}

export function hasBingo(board: BoardCell[]): boolean {

    return (
        checkRows(board) ||
        checkColumns(board) ||
        checkDiagonal(board)
    );

}

/* ==========================================================
   SCORE
========================================================== */

export function calculateStars(score: number): number {

    if (score >= 120) return 3;

    if (score >= 80) return 2;

    if (score >= 40) return 1;

    return 0;

}

export function calculateProgress(
    marked: number,
    total: number
): number {

    if (!total) return 0;

    return Math.round(
        (marked / total) * 100
    );

}

/* ==========================================================
   MESSAGES
========================================================== */

export function successMessage(): string {

    return randomItem(
        BINGO_MESSAGES.MARK
    );

}

export function failMessage(): string {

    return randomItem(
        BINGO_MESSAGES.WRONG
    );

}
