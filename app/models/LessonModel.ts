/* ==========================================================
   LESSON MODEL
   Arquitectura Oficial 3.0
   Modelo oficial de una lección.
   Toda la plataforma trabaja con este formato.
========================================================== */

import { type GameConfig, createGameConfig } from "./GameModel";

export type { GameConfig };

export interface VocabItem extends Record<string, unknown> {
  text?: string;
  word?: string;
  translation?: string;
  emoji?: string;
  topic?: string;
  category?: string;
  categoryLabel?: string;
}

export interface PresentationItem extends Record<string, unknown> {
  objective?: string;
  rewards?: Array<{ emoji: string; title: string }>;
  tips?: string[];
  title?: string;
  url?: string;
  path?: string;
  type?: string;
  description?: string;
}

const DEFAULT_REWARDS: Array<{ emoji: string; title: string }> = [
  { emoji: "⭐", title: "+100 XP" },
  { emoji: "🏆", title: "Weekly Badge" },
  { emoji: "🎯", title: "New Achievement" },
];

const DEFAULT_TIPS = [
  "Practice the vocabulary out loud",
  "Complete every game to earn bonus XP",
  "Review this week's challenge daily",
];

export function ensurePresentation(
  presentation: PresentationItem[],
  topic: string
): PresentationItem[] {
  const current = presentation[0];
  const fallback = {
    objective: `Master "${topic || "English"}" through interactive vocabulary, games, and activities.`,
    rewards: DEFAULT_REWARDS,
    tips: DEFAULT_TIPS,
  };

  if (!current) return [fallback];

  return [
    {
      ...current,
      objective: current.objective?.trim() || fallback.objective,
      rewards: current.rewards?.length ? current.rewards : fallback.rewards,
      tips: current.tips?.length ? current.tips : fallback.tips,
    },
    ...presentation.slice(1),
  ];
}

export interface ResourceItem extends Record<string, unknown> {
  title?: string;
  desc?: string;
  url?: string;
  path?: string;
  type?: string;
}

export interface WorksheetItem extends Record<string, unknown> {
  title?: string;
  url?: string;
  description?: string;
  path?: string;
  type?: string;
}

export interface Lesson {
  id: string;
  tema: string;
  topic: string;
  fecha: string;
  progress?: number;
  month_index?: number;
  week_index?: number;
  grade_code?: string;

  vocab: VocabItem[];
  games: GameConfig[];
  resources: ResourceItem[];

  badge: string;

  presentation: PresentationItem[];
  slides?: PresentationItem[];
  worksheets: WorksheetItem[];
  worksheet?: WorksheetItem | WorksheetItem[];
}

/* ==========================================================
   FACTORY
========================================================== */

export function createLesson({
  id = "",
  tema = "",
  topic = "",
  fecha = "",
  month_index,
  week_index,
  grade_code,

  vocab = [],
  games = [],
  resources = [],

  badge = "",

  presentation = [],
  slides,
  worksheets = [],
}: Partial<Lesson> = {}): Readonly<Lesson> {
  const lesson: Lesson = {
    id,
    tema,
    topic,
    fecha,
    month_index,
    week_index,
    grade_code,

    vocab,
    games,
    resources,

    badge,

    presentation,
    slides,
    worksheets,
  };

  return Object.freeze(lesson);
}

export function normalizeLesson(row: {
  id?: string | null;
  lesson_id?: string | null;
  grade_code?: string | null;
  month_index?: number | null;
  week_index?: number | null;
  title?: string | null;
  content?: Record<string, unknown> | null;
}): Lesson {
  const content = (row.content ?? {}) as Record<string, unknown>;

  const rawVocab: unknown[] = Array.isArray((content as Record<string, unknown>).vocab)
    ? ((content as Record<string, unknown>).vocab as unknown[])
    : Array.isArray((row as Record<string, unknown>).vocab)
      ? ((row as Record<string, unknown>).vocab as unknown[])
      : [];

  const vocab: VocabItem[] = rawVocab.map((item: unknown) => {
    const obj = (item ?? {}) as Record<string, unknown>;
    return {
      topic: String(obj.topic ?? obj.categoryLabel ?? ""),
      category: String(obj.category ?? obj.cat ?? ""),
      categoryLabel: String(obj.categoryLabel ?? obj.category ?? obj.cat ?? ""),
      emoji: String(obj.emoji ?? ""),
      word: String(obj.word ?? obj.en ?? obj.text ?? ""),
      translation: String(obj.translation ?? obj.es ?? ""),
    };
  });

  const rawGames: unknown[] = Array.isArray((content as Record<string, unknown>).games)
    ? ((content as Record<string, unknown>).games as unknown[])
    : Array.isArray((row as Record<string, unknown>).games)
      ? ((row as Record<string, unknown>).games as unknown[])
      : [];

  const games: GameConfig[] = rawGames.map((game: unknown) => {
    if (typeof game === "string") {
      return createGameConfig({ id: game });
    }
    const obj = (game ?? {}) as Partial<GameConfig>;
    return createGameConfig({
      id: String(obj.id ?? ""),
      enabled: typeof obj.enabled === "boolean" ? obj.enabled : true,
      visible: typeof obj.visible === "boolean" ? obj.visible : true,
      difficulty: String(obj.difficulty ?? "normal"),
      stars: typeof obj.stars === "number" ? obj.stars : 0,
      score: typeof obj.score === "number" ? obj.score : 0,
      unlock: typeof obj.unlock === "boolean" ? obj.unlock : true,
      config: typeof obj.config === "object" && obj.config !== null ? obj.config as Record<string, unknown> : {},
      metadata: typeof obj.metadata === "object" && obj.metadata !== null ? obj.metadata as Record<string, unknown> : {},
    });
  });

  const resources: ResourceItem[] = Array.isArray((content as Record<string, unknown>).resources)
    ? ((content as Record<string, unknown>).resources as Array<Record<string, unknown>>).map((r) => ({
        title: String(r.title ?? r.name ?? ""),
        desc: String(r.desc ?? ""),
        url: String(r.url ?? ""),
        path: String(r.path ?? ""),
        type: String(r.type ?? ""),
      }))
    : Array.isArray((row as Record<string, unknown>).resources)
      ? ((row as Record<string, unknown>).resources as Array<Record<string, unknown>>).map((r) => ({
          title: String(r.title ?? r.name ?? ""),
          desc: String(r.desc ?? ""),
          url: String(r.url ?? ""),
          path: String(r.path ?? ""),
          type: String(r.type ?? ""),
        }))
      : [];

  const presentation: PresentationItem[] = Array.isArray((content as Record<string, unknown>).presentation)
    ? ((content as Record<string, unknown>).presentation as Array<Record<string, unknown>>).map((p) => {
        const rewards = Array.isArray(p.rewards)
          ? (p.rewards as Array<Record<string, unknown>>).map((r) => ({
              emoji: String(r.emoji ?? ""),
              title: String(r.title ?? ""),
            }))
          : [];
        const tips = Array.isArray(p.tips)
          ? (p.tips as unknown as string[]).map((t) => String(t))
          : [];
        return {
          objective: String(p.objective ?? ""),
          rewards,
          tips,
        };
      })
    : Array.isArray((row as Record<string, unknown>).presentation)
      ? ((row as Record<string, unknown>).presentation as Array<Record<string, unknown>>).map((p) => {
          const rewards = Array.isArray(p.rewards)
            ? (p.rewards as Array<Record<string, unknown>>).map((r) => ({
                emoji: String(r.emoji ?? ""),
                title: String(r.title ?? ""),
              }))
            : [];
          const tips = Array.isArray(p.tips)
            ? (p.tips as unknown as string[]).map((t) => String(t))
            : [];
          return {
            objective: String(p.objective ?? ""),
            rewards,
            tips,
          };
        })
      : [];

  const rawSlides: unknown[] = Array.isArray((content as Record<string, unknown>).slides)
    ? ((content as Record<string, unknown>).slides as unknown[])
    : Array.isArray((row as Record<string, unknown>).slides)
      ? ((row as Record<string, unknown>).slides as unknown[])
      : [];

  const slides: PresentationItem[] = rawSlides.map((s: unknown) => {
    const obj = s as Record<string, unknown>;
    const rewards = Array.isArray(obj.rewards)
      ? (obj.rewards as Array<Record<string, unknown>>).map((r) => ({
          emoji: String(r.emoji ?? ""),
          title: String(r.title ?? ""),
        }))
      : [];
    const tips = Array.isArray(obj.tips)
      ? (obj.tips as unknown as string[]).map((t) => String(t))
      : [];
    return {
      objective: String(obj.objective ?? ""),
      title: String(obj.title ?? obj.name ?? ""),
      url: String(obj.url ?? ""),
      path: String(obj.path ?? ""),
      type: String(obj.type ?? ""),
      description: String(obj.description ?? ""),
      rewards,
      tips,
    };
  });

  const rawWorksheets: unknown[] = Array.isArray((content as Record<string, unknown>).worksheets)
    ? ((content as Record<string, unknown>).worksheets as unknown[])
    : Array.isArray((row as Record<string, unknown>).worksheets)
      ? ((row as Record<string, unknown>).worksheets as unknown[])
      : Array.isArray((content as Record<string, unknown>).worksheet)
        ? ((content as Record<string, unknown>).worksheet as unknown[])
        : Array.isArray((row as Record<string, unknown>).worksheet)
          ? ((row as Record<string, unknown>).worksheet as unknown[])
          : [];

  const worksheets: WorksheetItem[] = rawWorksheets.map((w) => {
    const obj = w as Record<string, unknown>;
    return {
      title: String(obj.title ?? obj.name ?? ""),
      url: String(obj.url ?? ""),
      description: String(obj.description ?? obj.desc ?? ""),
      path: String(obj.path ?? ""),
      type: String(obj.type ?? ""),
    };
  });

  const progress = typeof (content as Record<string, unknown>).progress === "number"
    ? (content as Record<string, unknown>).progress as number
    : typeof (row as Record<string, unknown>).progress === "number"
      ? (row as Record<string, unknown>).progress as number
      : undefined;

  const topic = String(
    (content as Record<string, unknown>).topic ??
      (row as Record<string, unknown>).topic ??
      (content as Record<string, unknown>).tema ??
      (row as Record<string, unknown>).tema ??
      (row as Record<string, unknown>).title ??
      ""
  );

  return createLesson({
    id: String(row.lesson_id ?? row.id ?? (content as Record<string, unknown>).id ?? ""),

    tema: String((content as Record<string, unknown>).tema ?? (row as Record<string, unknown>).tema ?? (row as Record<string, unknown>).title ?? ""),

    topic,

    fecha: String((content as Record<string, unknown>).fecha ?? (row as Record<string, unknown>).fecha ?? ""),

    month_index: typeof row.month_index === "number" ? row.month_index : undefined,
    week_index: typeof row.week_index === "number" ? row.week_index : undefined,
    grade_code: typeof row.grade_code === "string" ? row.grade_code : undefined,

    badge: String((content as Record<string, unknown>).badge ?? (row as Record<string, unknown>).badge ?? ""),

    vocab,

    games,

    resources,

    presentation: ensurePresentation(presentation, topic),

    slides: slides.length > 0 ? slides : undefined,

    worksheets: worksheets.length > 0 ? worksheets : [],

    progress,
  });
}

/* ==========================================================
   VALIDACIONES
 ========================================================== */

export function hasVocabulary(lesson?: Lesson): boolean {
  return Array.isArray(lesson?.vocab) && lesson.vocab.length > 0;
}

export function hasGames(lesson?: Lesson): boolean {
  return Array.isArray(lesson?.games) && lesson.games.length > 0;
}

export function hasResources(lesson?: Lesson): boolean {
  return Array.isArray(lesson?.resources) && lesson.resources.length > 0;
}

export function hasPresentation(lesson?: Lesson): boolean {
  return Array.isArray(lesson?.presentation) &&
    lesson.presentation.length > 0;
}

export function hasSlides(lesson?: Lesson): boolean {
  return Array.isArray(lesson?.slides) && lesson.slides.length > 0;
}

export function hasWorksheets(lesson?: Lesson): boolean {
  return Array.isArray(lesson?.worksheets) &&
    lesson.worksheets.length > 0;
}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

export default createLesson;