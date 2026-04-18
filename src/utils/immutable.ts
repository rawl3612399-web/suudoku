import type { Board, Cell, NumericBoard } from '../domain/sudoku/types';
import { BOARD_SIZE } from './constants';

export const createBoardFromNumeric = (numeric: NumericBoard): Board => {
  const board: Cell[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = numeric[r][c];
      row.push({
        value: value === 0 ? null : value,
        notes: [],
        isFixed: value !== 0,
      });
    }
    board.push(row);
  }
  return board;
};

export const updateCell = (
  board: Board,
  row: number,
  col: number,
  patch: Partial<Pick<Cell, 'value' | 'notes'>>,
): Board => {
  const target = board[row][col];
  if (target.isFixed) {
    throw new Error(`Cannot modify fixed cell at (${row}, ${col})`);
  }
  const nextCell: Cell = { ...target, ...patch };
  return board.map((r, ri) =>
    ri !== row ? r : r.map((cell, ci) => (ci !== col ? cell : nextCell)),
  );
};

export const toggleNote = (
  board: Board,
  row: number,
  col: number,
  note: number,
): Board => {
  const target = board[row][col];
  if (target.isFixed) {
    throw new Error(`Cannot toggle note on fixed cell at (${row}, ${col})`);
  }
  const exists = target.notes.includes(note);
  const nextNotes = exists
    ? target.notes.filter((n) => n !== note)
    : [...target.notes, note].sort((a, b) => a - b);
  return updateCell(board, row, col, { value: null, notes: nextNotes });
};
