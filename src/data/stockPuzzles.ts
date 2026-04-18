import { DIFFICULTIES, type Difficulty } from '../utils/constants';
import {
  puzzleNumberToSeed,
  STOCK_SIZE,
  type StockPuzzleRef,
} from '../utils/puzzleId';

export interface StockPuzzleEntry extends StockPuzzleRef {
  readonly seed: number;
}

const buildList = (difficulty: Difficulty): StockPuzzleEntry[] =>
  Array.from({ length: STOCK_SIZE }, (_, i) => ({
    difficulty,
    number: i + 1,
    seed: puzzleNumberToSeed(difficulty, i + 1),
  }));

const CACHE = new Map<Difficulty, StockPuzzleEntry[]>();

export const getStockPuzzleList = (
  difficulty: Difficulty,
): ReadonlyArray<StockPuzzleEntry> => {
  let list = CACHE.get(difficulty);
  if (!list) {
    list = buildList(difficulty);
    CACHE.set(difficulty, list);
  }
  return list;
};

export const getAllStockPuzzles = (): ReadonlyArray<StockPuzzleEntry> =>
  DIFFICULTIES.flatMap((d) => getStockPuzzleList(d));
