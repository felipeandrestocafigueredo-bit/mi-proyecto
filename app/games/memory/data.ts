/*
=========================================================

PANDY MEMORY
DATA
Arquitectura Oficial 3.0

Este archivo únicamente contiene la configuración
global del juego.

Todo el vocabulario proviene de lesson.vocab.

=========================================================
*/

/*==========================================================
CONFIGURACIÓN GENERAL
==========================================================*/

export interface MemoryConfig {
    time: number;
    lives: number;
    pairPoints: number;
    comboBonus: number;
    flipDelay: number;
    maxStars: number;
}

export const MEMORY_CONFIG: MemoryConfig = {
    time: 90,
    lives: 5,
    pairPoints: 100,
    comboBonus: 50,
    flipDelay: 700,
    maxStars: 3,
};

/*==========================================================
MENSAJES DEL JUEGO
==========================================================*/

export const SUCCESS_MESSAGES: string[] = [
    "Excellent!",
    "Great!",
    "Awesome!",
    "Fantastic!",
    "Perfect!",
    "Well done!",
];

export const FAIL_MESSAGES: string[] = [
    "Try again!",
    "Keep going!",
    "Almost!",
    "Don't give up!",
    "You can do it!",
];

/*==========================================================
PUNTOS PARA ESTRELLAS
==========================================================*/

export interface StarLimits {
    three: number;
    two: number;
    one: number;
}

export const STAR_LIMITS: StarLimits = {
    three: 1.00,
    two: 0.70,
    one: 0.40,
};

/*==========================================================
CONFIGURACIÓN DEL TABLERO
==========================================================*/

export interface BoardConfig {
    minPairs: number;
    maxPairs: number;
}

export const BOARD_CONFIG: BoardConfig = {
    minPairs: 4,
    maxPairs: 12,
};

/*==========================================================
EXPORTACIÓN
==========================================================*/

export default MEMORY_CONFIG;
