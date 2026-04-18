import type { Board } from '../domain/sudoku/types';
import { BOARD_SIZE, MAX_VALUE, MIN_VALUE } from './constants';

export type DigitCounts = Readonly<Record<number, number>>;

const emptyCounts = (): Record<number, number> => {
  const counts: Record<number, number> = {};
  for (let n = MIN_VALUE; n <= MAX_VALUE; n++) counts[n] = 0;
  return counts;
};

export const countConfirmedDigits = (board: Board): DigitCounts => {
  const counts = emptyCounts();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = board[r][c].value;
      if (value !== null && value >= MIN_VALUE && value <= MAX_VALUE) {
        counts[value]++;
      }
    }
  }
  return counts;
};

export const isDigitFullyPlaced = (counts: DigitCounts, digit: number): boolean =>
  (counts[digit] ?? 0) >= MAX_VALUE;
