export function addScore(state: Record<string, any> = {}, points: number = 0): Record<string, any> {
    return {
        ...state,
        score: (state.score || 0) + points,
    };
}

export function addStars(state: Record<string, any> = {}, stars: number = 0): Record<string, any> {
    return {
        ...state,
        stars: (state.stars || 0) + stars,
    };
}

export function calculateBestScore(current: number = 0, best: number = 0): number {
    return Math.max(current, best);
}

export default {
    addScore,
    addStars,
    calculateBestScore,
};
