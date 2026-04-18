import { BLOCK_SIZE, BOARD_SIZE, MAX_VALUE, MIN_VALUE } from '../../utils/constants';
import type { NumericBoard, Position } from './types';

const assertCoord = (row: number, col: number): void => {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    throw new RangeError(`Invalid cell coordinates: (${row}, ${col})`);
  }
};

const assertValue = (value: number): void => {
  if (value < MIN_VALUE || value > MAX_VALUE || !Number.isInteger(value)) {
    throw new RangeError(`Invalid value: ${value}`);
  }
};

const blockOrigin = (index: number): number =>
  Math.floor(index / BLOCK_SIZE) * BLOCK_SIZE;

export const isValidPlacement = (
  board: NumericBoard,
  row: number,
  col: number,
  value: number,
): boolean => {
  assertCoord(row, col);
  assertValue(value);

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i !== col && board[row][i] === value) return false;
    if (i !== row && board[i][col] === value) return false;
  }

  const rowStart = blockOrigin(row);
  const colStart = blockOrigin(col);
  for (let r = rowStart; r < rowStart + BLOCK_SIZE; r++) {
    for (let c = colStart; c < colStart + BLOCK_SIZE; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) return false;
    }
  }

  return true;
};

export const isBoardValid = (board: NumericBoard): boolean => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = board[r][c];
      if (value === 0) continue;
      if (!isValidPlacement(board, r, c, value)) return false;
    }
  }
  return true;
};

export const isBoardComplete = (board: NumericBoard): boolean => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return isBoardValid(board);
};

export const findConflicts = (board: NumericBoard): Position[] => {
  const conflicts: Position[] = [];
  const seen = new Set<string>();

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = board[r][c];
      if (value === 0) continue;
      if (!isValidPlacement(board, r, c, value)) {
        const key = `${r},${c}`;
        if (!seen.has(key)) {
          seen.add(key);
          conflicts.push({ row: r, col: c });
        }
      }
    }
  }

  return conflicts;
};
