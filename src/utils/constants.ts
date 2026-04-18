export const BOARD_SIZE = 9;
export const BLOCK_SIZE = 3;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
export const MIN_VALUE = 1;
export const MAX_VALUE = 9;

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const EMPTY_CELLS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 35,
  medium: 45,
  hard: 55,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '初級',
  medium: '中級',
  hard: '上級',
};
