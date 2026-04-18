import { describe, it, expect } from 'vitest';
import { updateCell, toggleNote, createBoardFromNumeric } from './immutable';
import type { Board } from '../domain/sudoku/types';

const numericPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

describe('createBoardFromNumeric', () => {
  it('marks non-zero cells as fixed', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    expect(board[0][0]).toEqual({ value: 5, notes: [], isFixed: true });
    expect(board[0][2]).toEqual({ value: null, notes: [], isFixed: false });
  });

  it('produces a 9x9 board', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    expect(board).toHaveLength(9);
    board.forEach((row) => expect(row).toHaveLength(9));
  });
});

describe('updateCell (immutable)', () => {
  it('returns a new board reference', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    const next = updateCell(board, 0, 2, { value: 4 });
    expect(next).not.toBe(board);
  });

  it('does not mutate the original cell or row', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    const originalCell = board[0][2];
    const originalRow = board[0];
    updateCell(board, 0, 2, { value: 4 });
    expect(board[0][2]).toBe(originalCell);
    expect(board[0]).toBe(originalRow);
  });

  it('updates the targeted cell value', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    const next = updateCell(board, 0, 2, { value: 4 });
    expect(next[0][2].value).toBe(4);
  });

  it('preserves other cells (structural sharing on rows)', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    const next = updateCell(board, 0, 2, { value: 4 });
    expect(next[1]).toBe(board[1]);
    expect(next[0][0]).toBe(board[0][0]);
  });

  it('refuses to update a fixed cell', () => {
    const board = createBoardFromNumeric(numericPuzzle);
    expect(() => updateCell(board, 0, 0, { value: 4 })).toThrow();
  });
});

describe('toggleNote (immutable)', () => {
  it('adds a note when not present', () => {
    const board: Board = createBoardFromNumeric(numericPuzzle);
    const next = toggleNote(board, 0, 2, 5);
    expect(next[0][2].notes).toContain(5);
  });

  it('removes a note when already present', () => {
    let board: Board = createBoardFromNumeric(numericPuzzle);
    board = toggleNote(board, 0, 2, 5);
    board = toggleNote(board, 0, 2, 5);
    expect(board[0][2].notes).not.toContain(5);
  });

  it('clears value when adding a note (notes are exclusive with value)', () => {
    let board: Board = createBoardFromNumeric(numericPuzzle);
    board = updateCell(board, 0, 2, { value: 4 });
    board = toggleNote(board, 0, 2, 5);
    expect(board[0][2].value).toBeNull();
    expect(board[0][2].notes).toEqual([5]);
  });

  it('throws when toggling note on fixed cell', () => {
    const board: Board = createBoardFromNumeric(numericPuzzle);
    expect(() => toggleNote(board, 0, 0, 4)).toThrow();
  });

  it('keeps notes sorted', () => {
    let board: Board = createBoardFromNumeric(numericPuzzle);
    board = toggleNote(board, 0, 2, 7);
    board = toggleNote(board, 0, 2, 3);
    board = toggleNote(board, 0, 2, 5);
    expect(board[0][2].notes).toEqual([3, 5, 7]);
  });
});
