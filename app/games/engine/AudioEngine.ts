export function playGameTone(): void {
    if (typeof window === "undefined") return;
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext || function() {})();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.value = 0.0001;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.stop(ctx.currentTime + 0.05);
    } catch {
        // noop
    }
}

export function speakGame(text: string): void {
    if (typeof window === "undefined") return;
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    } catch {
        // noop
    }
}

export const AudioContext = typeof window !== "undefined" ? (window.AudioContext || (window as any).webkitAudioContext || null) : null;

interface AudioEngineInterface {
    play: (sound: any) => void;
    playMusic: (src?: string, loop?: boolean) => void;
    stopMusic: () => void;
    pauseMusic: () => void;
    resumeMusic: () => void;
    toggle: () => boolean;
    setVolume: (value: any) => void;
    isEnabled: () => boolean;
    getVolume: () => number;
}

const AudioEngine: AudioEngineInterface = {
    play(sound: any): void {
        if (!sound) return;
        if (typeof sound === "string") {
            speakGame(sound);
            return;
        }
        if (typeof sound === "object") {
            if (sound.tone) playGameTone();
            if (sound.text) speakGame(sound.text);
            return;
        }
    },
    playMusic(src?: string, loop = true): void {
        // placeholder - no bloquea
    },
    stopMusic(): void {
        // placeholder - no bloquea
    },
    pauseMusic(): void {
        // placeholder - no bloquea
    },
    resumeMusic(): void {
        // placeholder - no bloquea
    },
    toggle(): boolean {
        return true;
    },
    setVolume(value: any): void {
        // placeholder - no bloquea
    },
    isEnabled(): boolean {
        return true;
    },
    getVolume(): number {
        return 1;
    },
};

export default AudioEngine;
