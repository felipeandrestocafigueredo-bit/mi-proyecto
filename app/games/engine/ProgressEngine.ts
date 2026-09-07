import { getGameResults, saveGameResult, saveStudentResultToSupabase, type StudentGameResult } from "./playerProfile";

interface GameProgress {
    id: string;
    bestScore: number;
    attempts: number;
    lastPlayed: string | null;
}

const STORAGE_KEY = "lesson-game-progress-v1";

function normalizeGameKey(gameId = ""): string {
    return String(gameId || "").trim().toLowerCase();
}

const ProgressEngine = {
    _state: {} as Record<string, GameProgress>,

    load(): Record<string, GameProgress> {
        if (typeof window === "undefined") {
            return this._state;
        }

        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return this._state;
            }

            const parsed = JSON.parse(raw) as Record<string, Partial<GameProgress>>;
            const nextState: Record<string, GameProgress> = {};

            Object.entries(parsed).forEach(([key, value]) => {
                if (!key || typeof value !== "object") return;
                nextState[key] = {
                    id: String(value.id || key),
                    bestScore: Number(value.bestScore || 0),
                    attempts: Number(value.attempts || 0),
                    lastPlayed: typeof value.lastPlayed === "string" ? value.lastPlayed : null,
                };
            });

            this._state = nextState;
        } catch {
            this._state = {};
        }

        return this._state;
    },

    persist(): void {
        if (typeof window === "undefined") {
            return;
        }

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
        } catch {
            // Ignore storage failures silently to avoid breaking the game flow.
        }
    },

    getGame(gameId: string = ""): GameProgress {
        const key = normalizeGameKey(gameId);
        const stored = this._state[key] || this.load()[key];
        if (stored) return stored;

        return {
            id: gameId,
            bestScore: 0,
            attempts: 0,
            lastPlayed: null,
        };
    },

    setGame(gameId: string = "", data: Partial<GameProgress> = {}): void {
        const key = normalizeGameKey(gameId);
        const current = this.getGame(gameId);
        this._state[key] = {
            ...current,
            ...data,
            id: String(gameId || current.id || key),
        };
        this.persist();
    },

    registerResult(gameId: string = "", score: number = 0, attempts: number = 0): void {
        const key = normalizeGameKey(gameId);
        const current = this.getGame(gameId);
        const bestScore = Math.max(current.bestScore || 0, Number(score) || 0);

        this.setGame(gameId, {
            id: String(gameId || key),
            bestScore,
            attempts: Math.max(current.attempts || 0, Number(attempts) || 0),
            lastPlayed: new Date().toISOString(),
        });
    },

    syncLessonGames(lesson?: { games?: Array<{ id?: string; score?: number; stars?: number } | string> } | null): void {
        if (!lesson || !Array.isArray(lesson.games)) {
            return;
        }

        lesson.games.forEach((game) => {
            const id = typeof game === "string" ? game : game?.id;
            if (!id) return;

            const record = this.getGame(id);
            const currentScore = typeof game === "string" ? 0 : Number(game.score || 0);
            const currentStars = typeof game === "string" ? 0 : Number(game.stars || 0);

            if (record.bestScore > 0 || currentScore > 0 || currentStars > 0) {
                this.setGame(id, {
                    ...record,
                    bestScore: Math.max(record.bestScore || 0, currentScore || 0, Number(currentStars || 0) * 10),
                    lastPlayed: record.lastPlayed || new Date().toISOString(),
                });
            }
        });
    },

    recordStudentResult(payload: Omit<StudentGameResult, "savedAt"> & { savedAt?: string }): StudentGameResult {
        const result = saveGameResult({
            ...payload,
            savedAt: payload.savedAt || new Date().toISOString(),
        });

        void saveStudentResultToSupabase(result).catch((error) => {
            console.error("No se pudo guardar el resultado del estudiante en Supabase:", error);
        });

        return result;
    },

    getResults(): StudentGameResult[] {
        return getGameResults();
    },

    getMonthSummary(): Array<{ label: string; value: number; percentage: number }> {
        const results = getGameResults();
        const byMonth = new Map<string, { total: number; count: number; score: number }>();

        results.forEach((entry) => {
            const monthLabel = typeof entry.monthIndex === "number" ? `Mes ${entry.monthIndex + 1}` : "Mes";
            const current = byMonth.get(monthLabel) || { total: 0, count: 0, score: 0 };
            current.total += entry.percentage || 0;
            current.count += 1;
            current.score += entry.score || 0;
            byMonth.set(monthLabel, current);
        });

        return Array.from(byMonth.entries()).map(([label, value]) => ({
            label,
            value: value.count ? Math.round(value.total / value.count) : 0,
            percentage: value.count ? Math.round(value.score / value.count) : 0,
        }));
    },

    reset(): void {
        this._state = {};
        this.persist();
    },
};

export default ProgressEngine;
