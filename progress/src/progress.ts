import { LEVELS } from '../../content/src/kana.js';
import { isLevelUnlocked } from '../../learning/src/game.js';

export interface Progress {
  readonly formatVersion: 1;
  readonly completedLevelIds: readonly string[];
  readonly bestScores: Readonly<Record<string, number>>;
}

export function emptyProgress(): Progress {
  return { formatVersion: 1, completedLevelIds: [], bestScores: {} };
}

export function parseProgress(raw: unknown): Progress {
  if (raw === null || raw === undefined) return emptyProgress();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Progress data is not an object');
  }
  const value = raw as Record<string, unknown>;
  if (value.formatVersion !== 1) {
    throw new Error('Unsupported progress format version');
  }
  const known = new Set(LEVELS.map((level) => level.id));
  const completed = value.completedLevelIds;
  const scores = value.bestScores;
  if (!Array.isArray(completed) || !completed.every((id) => typeof id === 'string' && known.has(id)) ||
      new Set(completed).size !== completed.length || !scores || typeof scores !== 'object' || Array.isArray(scores)) {
    throw new Error('Invalid progress structure');
  }
  for (let index = 1; index < completed.length; index += 1) {
    if (LEVELS.findIndex((level) => level.id === completed[index]) !== index) {
      throw new Error('Completed levels are not sequential');
    }
  }
  if (completed.length && completed[0] !== LEVELS[0]?.id) {
    throw new Error('Completed levels must start with the first level');
  }
  const parsedScores: Record<string, number> = {};
  for (const [id, score] of Object.entries(scores)) {
    if (!known.has(id) || typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 100) {
      throw new Error('Invalid best score');
    }
    parsedScores[id] = score;
  }
  for (const id of completed) {
    if ((parsedScores[id] ?? -1) < 80) {
      throw new Error('Completed level lacks a passing score');
    }
  }
  return { formatVersion: 1, completedLevelIds: [...completed] as string[], bestScores: parsedScores };
}

export function recordResult(progress: Progress, levelId: string, score: number): Progress {
  if (!LEVELS.some((level) => level.id === levelId) || !isLevelUnlocked(levelId, progress.completedLevelIds)) {
    throw new Error('Level not found or locked');
  }
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error('Invalid score');
  }
  const previouslyCompleted = progress.completedLevelIds.includes(levelId);
  const completedLevelIds = !previouslyCompleted && score >= 80
    ? [...progress.completedLevelIds, levelId]
    : [...progress.completedLevelIds];
  return parseProgress({
    formatVersion: 1,
    completedLevelIds,
    bestScores: { ...progress.bestScores, [levelId]: Math.max(score, progress.bestScores[levelId] ?? 0) }
  });
}
