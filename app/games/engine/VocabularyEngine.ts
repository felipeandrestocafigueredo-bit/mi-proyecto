export function getVocabularyById(items: any[] = [], id: string = ""): any | null {
    if (!Array.isArray(items)) return null;
    return items.find((item) => (item.id || item.word || item.en || "") === id) || null;
}

export function filterVocabularyByDifficulty(items: any[] = [], difficulty: string = "easy"): any[] {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => (item.difficulty || "easy") === difficulty);
}

export function sortVocabularyByLevel(items: any[] = []): any[] {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => (a.level || 0) - (b.level || 0));
}

export default {
    getVocabularyById,
    filterVocabularyByDifficulty,
    sortVocabularyByLevel,
};
