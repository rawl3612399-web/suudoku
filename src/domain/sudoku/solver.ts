import { BLOCK_SIZE, BOARD_SIZE, MAX_VALUE, MIN_VALUE } from '../../utils/constants';
import type { NumericBoard } from './types';

type MutableBoard = number[][];

const cloneBoard = (board: NumericBoard): MutableBoard =>
  board.map((row) => [...row]);

const findEmptyCell = (board: MutableBoard): [number, number] | null => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
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
  const rowStart = Math.floor(row / BLOCK_SIZE) * BLOCK_SIZE;
  const colStart = Math.floor(col / BLOCK_SIZE) * BLOCK_SIZE;
  for (let r = rowStart; r < rowStart + BLOCK_SIZE; r++) {
    for (let c = colStart; c < colStart + BLOCK_SIZE; c++) {
      if (board[r][c] === value) return false;
    }
  }
  return true;
};

const isInitiallyValid = (board: MutableBoard): boolean => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const v = board[r][c];
      if (v === 0) continue;
      board[r][c] = 0;
      const ok = canPlace(board, r, c, v);
      board[r][c] = v;
      if (!ok) return false;
    }
  }
  return true;
};

const backtrack = (board: MutableBoard): boolean => {
  const empty = findEmptyCell(board);
  if (!empty) return true;
  const [row, col] = empty;
  for (let value = MIN_VALUE; value <= MAX_VALUE; value++) {
    if (canPlace(board, row, col, value)) {
      board[row][col] = value;
      if (backtrack(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
};

export const solve = (board: NumericBoard): NumericBoard | null => {
  const working = cloneBoard(board);
  if (!isInitiallyValid(working)) return null;
  if (!backtrack(working)) return null;
  return working;
};

const countBacktrack = (board: MutableBoard, limit: number): number => {
  const empty = findEmptyCell(board);
  if (!empty) return 1;
  const [row, col] = empty;
  let count = 0;
  for (let value = MIN_VALUE; value <= MAX_VALUE; value++) {
    if (canPlace(board, row, col, value)) {
      board[row][col] = value;
      count += countBacktrack(board, limit - count);
      board[row][col] = 0;
      if (count >= limit) return count;
    }
  }
  return count;
};

export const countSolutions = (board: NumericBoard, limit = 2): number => {
  const working = cloneBoard(board);
  if (!isInitiallyValid(working)) return 0;
  return countBacktrack(working, limit);
};
