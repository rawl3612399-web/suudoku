import type { Difficulty } from './constants';

export type PuzzleKey = string;

export interface BestTimeRecord {
  readonly bestSeconds: number;
  readonly achievedAt: number;
  readonly attempts: number;
}

export type BestTimes = Readonly<Record<PuzzleKey, BestTimeRecord>>;

export const makePuzzleKey = (difficulty: Difficulty, seed: number): PuzzleKey =>
  `${difficulty}:${seed}`;

export const getBestTime = (
  records: BestTimes,
  difficulty: Difficulty,
  seed: number,
): BestTimeRecord | null => records[makePuzzleKey(difficulty, seed)] ?? null;

export const recordBestTime = (
  records: BestTimes,
  difficulty: Difficulty,
  seed: number,
  seconds: number,
  now: number,
): BestTimes => {
  if (!Number.isFinite(seconds) || seconds < 0) return records;
  const key = makePuzzleKey(difficulty, seed);
  const previous = records[key];
  const attempts = (previous?.attempts ?? 0) + 1;
  const isBetter = !previous || seconds < previous.bestSeconds;
  const next: BestTimeRecord = isBetter
    ? { bestSeconds: seconds, achievedAt: now, attempts }
    : { ...previous, attempts };
  return { ...records, [key]: next };
};
