import { useEffect, useRef, useState } from "react";

/*
========================================================

HOOK OFICIAL
COUNTDOWN

Arquitectura 3.0

Responsabilidades

✓ Cronómetro regresivo
✓ Iniciar
✓ Pausar
✓ Reanudar
✓ Reiniciar
✓ Detener
✓ Detectar cuando llega a cero

========================================================
*/

export interface UseCountdownReturn {
    time: number;
    formatted: string;
    running: boolean;
    finished: boolean;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: (seconds?: number) => void;
    stop: () => void;
}

export default function useCountdown(
    initialSeconds: number = 60,
    autoStart: boolean = false
): UseCountdownReturn {

    const [time, setTime] = useState<number>(initialSeconds);

    const [running, setRunning] = useState<boolean>(autoStart);

    const timerRef = useRef<number | undefined>(undefined);

    /*
    =========================================================
    Iniciar intervalo
    =========================================================
    */

    useEffect((): (() => void) | void => {

        if (!running) return;

        timerRef.current = window.setInterval(() => {

            setTime((value: number) => {

                if (value <= 1) {

                    clearInterval(timerRef.current);

                    setRunning(false);

                    return 0;

                }

                return value - 1;

            });

        }, 1000);

        return () => clearInterval(timerRef.current);

    }, [running]);

    /*
    =========================================================
    Iniciar
    =========================================================
    */

    const start = (): void => {

        setRunning(true);

    };

    /*
    =========================================================
    Pausar
    =========================================================
    */

    const pause = (): void => {

        setRunning(false);

    };

    /*
    =========================================================
    Reanudar
    =========================================================
    */

    const resume = (): void => {

        if (time > 0) {

            setRunning(true);

        }

    };

    /*
    =========================================================
    Reiniciar
    =========================================================
    */

    const reset = (seconds: number = initialSeconds): void => {

        clearInterval(timerRef.current);

        setRunning(false);

        setTime(seconds);

    };

    /*
    =========================================================
    Detener completamente
    =========================================================
    */

    const stop = (): void => {

        clearInterval(timerRef.current);

        setRunning(false);

    };

    /*
    =========================================================
    Formato mm:ss
    =========================================================
    */

    const minutes: number = Math.floor(time / 60);

    const seconds: number = time % 60;

    const formatted: string =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return {

        time,

        formatted,

        running,

        finished: time === 0,

        start,

        pause,

        resume,

        reset,

        stop,

    };

}
