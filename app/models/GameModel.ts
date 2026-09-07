/* ==========================================================
   GAME MODEL
   Arquitectura Oficial 3.0
   Modelo oficial utilizado por todos los juegos
========================================================== */

export interface GameConfig {
  id: string;
  enabled: boolean;
  visible: boolean;
  difficulty: string;
  stars: number;
  score: number;
  unlock: boolean;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

/* ==========================================================
   FACTORY
========================================================== */

export function createGameConfig({
  id = "",
  enabled = true,
  visible = true,
  difficulty = "normal",
  stars = 0,
  score = 0,
  unlock = true,
  config = {},
  metadata = {},
}: Partial<GameConfig> = {}): Readonly<GameConfig> {
  const game: GameConfig = {
    id,
    enabled,
    visible,
    difficulty,
    stars,
    score,
    unlock,
    config,
    metadata,
  };

  return Object.freeze(game);
}

/* ==========================================================
   VALIDACIONES
========================================================== */

export function isGameEnabled(game?: GameConfig): boolean {
  return game?.enabled === true;
}

export function isGameVisible(game?: GameConfig): boolean {
  return game?.visible === true;
}

export function isGameUnlocked(game?: GameConfig): boolean {
  return game?.unlock === true;
}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

export default createGameConfig;