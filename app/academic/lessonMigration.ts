/* ==========================================================
   LESSON MIGRATION
   Arquitectura Oficial 3.0

   Convierte automáticamente las lecciones del formato
   antiguo al LessonModel oficial.

   De esta forma NO es necesario modificar cientos
   de semanas manualmente.
========================================================== */

import { createLesson, type Lesson, type VocabItem, type PresentationItem, type ResourceItem, type WorksheetItem } from "../models/LessonModel";
import { createGameConfig, type GameConfig } from "../models/GameModel";

/* ==========================================================
   TIPOS AUXILIARES
========================================================== */

type OldGame =
  | string
  | Partial<GameConfig>;

interface OldResource {
  title?: string;
  desc?: string;
  url?: string;
}

interface OldLesson {
  id?: string;
  tema?: string;
  topic?: string;
  fecha?: string;
  progress?: number;

  badge?: string;

  vocab?: VocabItem[];
  vocabulary?: VocabItem[];

  games?: OldGame[];

  resources?: ResourceItem[];

  presentation?: PresentationItem[];

  slides?: PresentationItem[];

  worksheets?: WorksheetItem[];
  worksheet?: WorksheetItem | WorksheetItem[];
}

/* ==========================================================
   Convierte un arreglo de juegos antiguos

   ["memory","quiz","bingo"]

   ↓

   [
      GameModel,
      GameModel,
      GameModel
   ]
========================================================== */

export function migrateGames(games: OldGame[] = []): Readonly<GameConfig>[] {
  if (!Array.isArray(games)) return [];

  const configs = games.map((game) => {
    if (typeof game === "string") {
      return createGameConfig({
        id: game,
      });
    }

    return createGameConfig({
      id: game.id ?? "",
      ...game,
    });
  });

  const seen = new Set<string>();
  const unique = configs.filter((config) => {
    if (!config.id || seen.has(config.id)) return false;
    seen.add(config.id);
    return true;
  });

  return unique.slice(0, 3);
}

/* ==========================================================
   Recursos
========================================================== */

export function migrateResources(resources: OldResource[] = []) {
  if (!Array.isArray(resources)) return [];

  return resources.map((resource) => ({
    title: resource.title ?? "",
    desc: resource.desc ?? "",
    url: resource.url ?? "",
  }));
}

/* ==========================================================
    Presentaciones
================================================== */

export function migratePresentation(
  presentation: PresentationItem[] = []
): PresentationItem[] {
  if (!Array.isArray(presentation)) return [];

  return presentation;
}

/* ==========================================================
    Auto-generate presentation data when missing
    Sincroniza objetivo, recompensas y consejos con el tema
    de la lección para mantener coherencia con los juegos.
================================================== */

export function generatePresentation(
  topic: string,
  tema?: string
): PresentationItem[] {
  const topicText = topic || tema || "English";

  const objective = `Master "${topicText}" through interactive vocabulary, games, and activities.`;

  const rewards = [
    { emoji: "⭐", title: "+100 XP" },
    { emoji: "🏆", title: "Weekly Badge" },
    { emoji: "🎯", title: "New Achievement" },
  ];

  const tips: string[] = [];

  if (/present simple/i.test(topicText) || /presente simple/i.test(topicText)) {
    tips.push(
      "Add -s for he/she/it in affirmative sentences",
      "Use 'do/does' for questions and negatives",
      "Practice with time expressions: always, usually, never"
    );
  } else if (/to be/i.test(topicText) || /to be/i.test(tema || "")) {
    tips.push(
      "Memorize: I am, you are, he/she is, we are, they are",
      "Practice negations: I am not, she is not",
      "Turn statements into questions"
    );
  } else if (/can/i.test(topicText) || /ability/i.test(topicText)) {
    tips.push(
      "Use 'can' for abilities: 'I can swim'",
      "Use 'can't' for negations: 'I can't fly'",
      "Ask 'Can you...?' to check abilities"
    );
  } else if (/preposition/i.test(topicText)) {
    tips.push(
      "Memorize: in, on, under, next to, behind, in front of",
      "Practice 'The book is on the table'",
      "Use 'Where is...?' to ask about location"
    );
  } else if (/greeting/i.test(topicText) || /saludo/i.test(topicText)) {
    tips.push(
      "Practice 'Good morning' with family (formal)",
      "Use 'Hi!' and 'Hey!' with friends (informal)",
      "Memorize both formal and informal forms"
    );
  } else if (/number/i.test(topicText) || /número/i.test(topicText)) {
    tips.push(
      "Count objects to practice cardinal numbers",
      "Learn ordinal numbers: first, second, third",
      "Practice spelling numbers out loud"
    );
  } else if (/weather/i.test(topicText) || /clima/i.test(topicText)) {
    tips.push(
      "Memorize: sunny, rainy, cloudy, windy, foggy, hot, cold",
      "Practice 'It is sunny today'",
      "Use 'What is the weather like?'"
    );
  } else if (/family/i.test(topicText) || /familia/i.test(topicText)) {
    tips.push(
      "Learn family member names: mother, father, brother, sister",
      "Practice 'I have a sister'",
      "Ask 'Do you have...?' and 'Does she have...?'"
    );
  } else if (/celebration/i.test(topicText) || /celebración/i.test(topicText)) {
    tips.push(
      "Memorize holidays: Halloween, Christmas, Valentine's Day",
      "Practice traditions: 'We exchange gifts'",
      "Use 'It is a special tradition'"
    );
  } else if (
    /day/i.test(topicText) ||
    /present/i.test(topicText) ||
    /presentation/i.test(topicText.toLowerCase())
  ) {
    tips.push(
      "Prepare your opening: 'Good morning everyone'",
      "Use connectors: 'First of all', 'In conclusion'",
      "Practice eye contact and clear pronunciation"
    );
  } else if (/review/i.test(topicText) || /revis/i.test(topicText)) {
    tips.push(
      "Review all grammar and vocabulary from this period",
      "Complete all games for maximum XP",
      "Check your mistakes carefully"
    );
  } else {
    tips.push(
      "Practice the vocabulary daily",
      "Complete all games for bonus XP",
      "Review your mistakes"
    );
  }

  return [
    {
      objective,
      rewards,
      tips,
    },
  ];
}

/* ==========================================================
   Worksheets
========================================================== */

export function migrateWorksheets(
  worksheets: WorksheetItem[] = []
): WorksheetItem[] {
  if (!Array.isArray(worksheets)) return [];

  return worksheets;
}

/* ==========================================================
   Convierte UNA lección
========================================================== */

export function migrateLesson(
  oldLesson: OldLesson = {}
): Readonly<Lesson> {
  const rawVocab = oldLesson.vocab ?? oldLesson.vocabulary ?? [];

  const normalizedVocab = rawVocab.map((item) => ({
    topic: item.topic ?? "",
    category: item.category ?? "",
    categoryLabel: item.categoryLabel ?? item.category ?? "",
    emoji: item.emoji ?? "",
    word: String(item.word ?? item.en ?? item.text ?? ""),
    translation: String(item.translation ?? item.es ?? ""),
  }));

  const rawWorksheets = oldLesson.worksheets ??
    (oldLesson.worksheet
      ? Array.isArray(oldLesson.worksheet)
        ? oldLesson.worksheet
        : [oldLesson.worksheet]
      : []);

  const normalizedWorksheets = migrateWorksheets(rawWorksheets);

  const rawSlides = oldLesson.slides ?? [];

  return createLesson({
    id: oldLesson.id ?? "",

    tema: oldLesson.tema ?? "",

    topic: oldLesson.topic ?? oldLesson.tema ?? "",

    fecha: oldLesson.fecha ?? "",

    badge: oldLesson.badge ?? "",

    vocab: normalizedVocab,

    games: migrateGames(oldLesson.games),

    resources: migrateResources(oldLesson.resources),

    presentation:
      oldLesson.presentation && oldLesson.presentation.length > 0
        ? migratePresentation(oldLesson.presentation)
        : generatePresentation(
            oldLesson.topic ?? oldLesson.tema ?? "",
            oldLesson.tema
          ),

    slides: rawSlides.length > 0 ? migratePresentation(rawSlides) : undefined,

    worksheets: normalizedWorksheets,

    progress: typeof oldLesson.progress === "number" ? oldLesson.progress : undefined,
  });
}

/* ==========================================================
   Convierte TODAS las semanas de un mes
========================================================== */

export function migrateMonth(
  weeks: OldLesson[] = []
): Readonly<Lesson>[] {
  if (!Array.isArray(weeks)) return [];

  return weeks.map(migrateLesson);
}

/* ==========================================================
   Convierte TODO un grado

   Ejemplo:

   {
      0:[...],
      1:[...],
      2:[...]
   }
========================================================== */

export function migrateAcademicGrade(
  data: Record<string, OldLesson[]> = {}
): Record<string, Readonly<Lesson>[]> {
  const result: Record<string, Readonly<Lesson>[]> = {};

  Object.keys(data).forEach((month) => {
    result[month] = migrateMonth(data[month]);
  });

  return result;
}

export default migrateAcademicGrade;