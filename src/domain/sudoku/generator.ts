import {
  BLOCK_SIZE,
  BOARD_SIZE,
  EMPTY_CELLS_BY_DIFFICULTY,
  MAX_VALUE,
  MIN_VALUE,
  type Difficulty,
} from '../../utils/constants';
import { countSolutions } from './solver';
import type { NumericBoard } from './types';

type MutableBoard = number[][];

const createSeededRandom = (seed: number): (() => number) => {
  let state = (seed | 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return ((state >>> 0) % 1_000_000) / 1_000_000;
  };
};

const shuffle = <T>(arr: T[], rand: () => number): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const canPlace = (
  board: MutableBoard,
  row: number,
  col: number,
  value: number,
): boolean => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[row][i] === value) return false;
    if (board[i][col] === value) return false;
  }
  const rs = Math.floor(row / BLOCK_SIZE) * BLOCK_SIZE;
  const cs = Math.floor(col / BLOCK_SIZE) * BLOCK_SIZE;
  for (let r = rs; r < rs + BLOCK_SIZE; r++) {
    for (let c = cs; c < cs + BLOCK_SIZE; c++) {
      if (board[r][c] === value) return false;
    }
  }
  return true;
};

const fillBoard = (board: MutableBoard, rand: () => number): boolean => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) continue;
      const candidates = shuffle(
        Array.from({ length: MAX_VALUE - MIN_VALUE + 1 }, (_, i) => i + MIN_VALUE),
        rand,
      );
      for (const value of candidates) {
        if (canPlace(board, r, c, value)) {
          board[r][c] = value;
          if (fillBoard(board, rand)) return true;
          board[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
};

const generateSolvedBoard = (rand: () => number): MutableBoard => {
  const board: MutableBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0),
  );
  fillBoard(board, rand);
  return board;
};

const removeCells = (
  solved: MutableBoard,
  targetEmpty: number,
  rand: () => number,
): MutableBoard => {
  const puzzle = solved.map((r) => [...r]);
  const positions: Array<[number, number]> = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      positions.push([r, c]);
    }
  }
  const order = shuffle(positions, rand);

  let removed = 0;
  for (const [r, c] of order) {
    if (removed >= targetEmpty) break;
    const backup = puzzle[r][c];
    if (backup === 0) continue;
    puzzle[r][c] = 0;
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r][c] = backup;
    } else {
      removed++;
    }
  }

  return puzzle;
};

export interface GeneratedPuzzle {
  readonly puzzle: NumericBoard;
  readonly solution: NumericBoard;
  readonly difficulty: Difficulty;
}

export const generatePuzzle = (
  difficulty: Difficulty,
  seed: number = Date.now(),
): GeneratedPuzzle => {
  const rand = createSeededRandom(seed);
  const target = EMPTY_CELLS_BY_DIFFICULTY[difficulty];

  for (let attempt = 0; attempt < 5; attempt++) {
    const solution = generateSolvedBoard(rand);
    const puzzle = removeCells(solution, target, rand);
    let empty = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (puzzle[r][c] === 0) empty++;
      }
    }
    if (empty === target) {
      return { puzzle, solution, difficulty };
    }
  }

  const solution = generateSolvedBoard(rand);
  const puzzle = removeCells(solution, target, rand);
  return { puzzle, solution, difficulty };
};
