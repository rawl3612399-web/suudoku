import { DIFFICULTIES, type Difficulty } from './constants';

export const STOCK_SIZE = 100;

export const SEED_OFFSET_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 100_000,
  medium: 200_000,
  hard: 300_000,
};

export const puzzleNumberToSeed = (
  difficulty: Difficulty,
  number: number,
): number => {
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new RangeError(`Unknown difficulty: ${difficulty}`);
  }
  if (!Number.isInteger(number) || number < 1 || number > STOCK_SIZE) {
    throw new RangeError(`Puzzle number out of range: ${number}`);
  }
  return SEED_OFFSET_BY_DIFFICULTY[difficulty] + number;
};

export interface StockPuzzleRef {
  readonly difficulty: Difficulty;
  readonly number: number;
}

export const seedToPuzzleNumber = (
  difficulty: Difficulty,
  seed: number,
): number | null => {
  const offset = SEED_OFFSET_BY_DIFFICULTY[difficulty];
  const candidate = seed - offset;
  if (
    Number.isInteger(candidate) &&
    candidate >= 1 &&
    candidate <= STOCK_SIZE
  ) {
    return candidate;
  }
  return null;
};

export const isStockSeed = (
  difficulty: Difficulty,
  seed: number,
): boolean => seedToPuzzleNumber(difficulty, seed) !== null;

const DIFFICULTY_LABEL_SHORT: Record<Difficulty, string> = {
  easy: '初級',
  medium: '中級',
  hard: '上級',
};

export const formatPuzzleId = (
  difficulty: Difficulty,
  number: number,
): string =>
  `${DIFFICULTY_LABEL_SHORT[difficulty]} #${number.toString().padStart(3, '0')}`;
