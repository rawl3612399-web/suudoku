import { DIFFICULTIES, type Difficulty } from './constants';

const PREFIX_BY_DIFFICULTY: Record<Difficulty, string> = {
  easy: 'E',
  medium: 'M',
  hard: 'H',
};

const DIFFICULTY_BY_PREFIX: Record<string, Difficulty> = {
  E: 'easy',
  M: 'medium',
  H: 'hard',
};

const SEED_DIGITS = 6;
const SEED_MIN = 100_000;
const SEED_MAX = 999_999;

export const generateSeed = (): number =>
  Math.floor(SEED_MIN + Math.random() * (SEED_MAX - SEED_MIN + 1));

export const encodeRoomCode = (difficulty: Difficulty, seed: number): string => {
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new RangeError(`Unknown difficulty: ${difficulty}`);
  }
  const padded = Math.abs(Math.trunc(seed))
    .toString()
    .padStart(SEED_DIGITS, '0')
    .slice(-SEED_DIGITS);
  return `${PREFIX_BY_DIFFICULTY[difficulty]}-${padded}`;
};

export interface DecodedRoomCode {
  readonly difficulty: Difficulty;
  readonly seed: number;
}

export const decodeRoomCode = (raw: string): DecodedRoomCode | null => {
  const cleaned = raw.trim().toUpperCase().replace(/[\s\-_]/g, '');
  const match = /^([EMH])(\d{6})$/.exec(cleaned);
  if (!match) return null;
  const difficulty = DIFFICULTY_BY_PREFIX[match[1]];
  const seed = Number.parseInt(match[2], 10);
  return { difficulty, seed };
};
