import { useCallback } from "react";
import AudioEngine from "../engine/AudioEngine";

/*
=========================================================

USE AUDIO
Arquitectura Oficial 3.0

Hook para controlar el AudioEngine.

Responsabilidades

✓ reproducir sonidos
✓ reproducir música
✓ detener música
✓ activar/desactivar audio
✓ cambiar volumen

=========================================================
*/

export interface UseAudioReturn {
    play: (sound: any) => void;
    playMusic: (src: string, loop?: boolean) => void;
    stopMusic: () => void;
    pauseMusic: () => void;
    resumeMusic: () => void;
    toggle: () => boolean;
    setVolume: (value: any) => void;
    enabled: boolean;
    volume: number;
}

export default function useAudio(): UseAudioReturn {

    const play = useCallback((sound: any): void => {
        AudioEngine.play(sound);
    }, []);

    const playMusic = useCallback((src: string, loop: boolean = true): void => {
        AudioEngine.playMusic(src, loop);
    }, []);

    const stopMusic = useCallback((): void => {
        AudioEngine.stopMusic();
    }, []);

    const pauseMusic = useCallback((): void => {
        AudioEngine.pauseMusic();
    }, []);

    const resumeMusic = useCallback((): void => {
        AudioEngine.resumeMusic();
    }, []);

    const toggle = useCallback((): boolean => {
        return AudioEngine.toggle();
    }, []);

    const setVolume = useCallback((value: any): void => {
        AudioEngine.setVolume(value);
    }, []);

    return {

        play,

        playMusic,

        stopMusic,

        pauseMusic,

        resumeMusic,

        toggle,

        setVolume,

        enabled: AudioEngine.isEnabled(),

        volume: AudioEngine.getVolume(),

    };

}
