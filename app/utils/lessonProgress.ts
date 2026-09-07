import { type Lesson, type GameConfig } from "../models/LessonModel";
import ProgressEngine from "../games/engine/ProgressEngine";

export function summarizeLessonProgress(lesson?: Lesson) {
  const safeLesson = lesson ?? {
    id: "",
    tema: "",
    topic: "",
    fecha: "",
    vocab: [],
    games: [],
    resources: [],
    badge: "",
    presentation: [],
    worksheets: [],
  } as Lesson;

  const vocab = Array.isArray(safeLesson?.vocab) ? safeLesson.vocab : [];
  const games: GameConfig[] = Array.isArray(safeLesson?.games) ? safeLesson.games : [];

  ProgressEngine.syncLessonGames(safeLesson as { games?: Array<{ id?: string; score?: number; stars?: number } | string> });

  const totalGames = games.length;
  const completedGames = games.filter((game: GameConfig) => {
    const synced = ProgressEngine.getGame(game.id);
    const score = Number(game.score || 0) || synced.bestScore || 0;
    const stars = Number(game.stars || 0) || 0;
    return score > 0 || stars > 0 || synced.bestScore > 0;
  }).length;

  const totalXP = completedGames * 100;
  const maxScore = games.reduce((acc: number, game: GameConfig) => {
    const synced = ProgressEngine.getGame(game.id);
    return acc + Math.max(Number(game.score || 0), synced.bestScore || 0);
  }, 0);

  const progress =
    vocab.length > 0 || totalGames > 0
      ? Math.min(100, Math.round(((completedGames + (vocab.length > 0 ? 1 : 0)) / (totalGames + (vocab.length > 0 ? 1 : 0))) * 100))
      : 0;

  const gameSummaries = games.map((game: GameConfig) => {
    const id = game.id || "Juego";
    const title = id;
    const synced = ProgressEngine.getGame(id);
    const score = Math.max(Number(game.score || 0), synced.bestScore || 0);
    const xp = score > 0 ? 100 : 0;
    const completed = score > 0 || (game.stars ?? 0) > 0 || synced.bestScore > 0;

    return {
      id,
      title,
      category: "Game",
      completed,
      score,
      xp,
    };
  });

  return {
    totalGames,
    completedGames,
    totalXP,
    maxScore,
    progress: Number.isFinite(progress) ? progress : 0,
    gameSummaries,
  };
}

export default summarizeLessonProgress;
