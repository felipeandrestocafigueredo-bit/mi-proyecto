const GAME_CATALOG = {
  pandyMemory: {
    id: "pandyMemory",
    title: "Pandy Memory",
    description: "Encuentra los pares de vocabulario.",
    color: "#2563EB",
    icon: "🧠",
  },
  snapCards: {
    id: "snapCards",
    title: "Snap Cards",
    description: "Compara tarjetas y gana puntos.",
    color: "#7C3AED",
    icon: "🃏",
  },
  quizMultiple: {
    id: "quizMultiple",
    title: "Quiz Multiple",
    description: "Responde preguntas de selección múltiple.",
    color: "#059669",
    icon: "❓",
  },
  wordRace: {
    id: "wordRace",
    title: "Word Race",
    description: "Escribe las palabras antes que se acabe el tiempo.",
    color: "#DC2626",
    icon: "🏁",
  },
  bingo: {
    id: "bingo",
    title: "Bingo",
    description: "Juego de bingo con vocabulario.",
    color: "#D97706",
    icon: "🎱",
  },
  finalChallenge: {
    id: "finalChallenge",
    title: "Final Challenge",
    description: "Desafío final de la semana.",
    color: "#4F46E5",
    icon: "🏆",
  },
  toBeQuest: {
    id: "toBeQuest",
    title: "To Be Quest",
    description: "Aventura con el verbo to be.",
    color: "#0891B2",
    icon: "🗺️",
  },
  pandyAdventure: {
    id: "pandyAdventure",
    title: "Pandy Adventure",
    description: "Aventura interactiva de Pandy.",
    color: "#BE185D",
    icon: "🚀",
  },
};

export function getGameInfo(gameId = "") {
  if (!gameId || typeof gameId !== "string") return null;

  const normalized = gameId.trim();
  const key = Object.keys(GAME_CATALOG).find(
    (catalogKey) => catalogKey.toLowerCase() === normalized.toLowerCase()
  );

  return key ? GAME_CATALOG[key as keyof typeof GAME_CATALOG] : null;
}

export default getGameInfo;
