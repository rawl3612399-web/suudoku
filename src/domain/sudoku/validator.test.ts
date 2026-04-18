import { describe, it, expect } from 'vitest';
import {
  isValidPlacement,
  isBoardValid,
  isBoardComplete,
  findConflicts,
} from './validator';
import type { NumericBoard } from './types';

const emptyBoard = (): NumericBoard =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

const fromRows = (rows: string[]): NumericBoard =>
  rows.map((r) => r.split('').map((c) => (c === '.' ? 0 : Number(c))));

const completedSolution: NumericBoard = fromRows([
  '534678912',
  '672195348',
  '198342567',
  '859761423',
  '426853791',
  '713924856',
  '961537284',
  '287419635',
  '345286179',
]);

const partialBoard: NumericBoard = fromRows([
  '53..7....',
  '6..195...',
  '.98....6.',
  '8...6...3',
  '4..8.3..1',
  '7...2...6',
  '.6....28.',
  '...419..5',
  '....8..79',
]);

describe('isValidPlacement', () => {
  it('returns true when value can be placed without conflict', () => {
    expect(isValidPlacement(partialBoard, 0, 2, 1)).toBe(true);
  });

  it('returns false when value conflicts with row', () => {
    expect(isValidPlacement(partialBoard, 0, 2, 5)).toBe(false);
  });

  it('returns false when value conflicts with column', () => {
    expect(isValidPlacement(partialBoard, 1, 0, 5)).toBe(false);
  });

  it('returns false when value conflicts with 3x3 block', () => {
    expect(isValidPlacement(partialBoard, 1, 1, 5)).toBe(false);
  });

  it('ignores the same cell when checking', () => {
    const board = emptyBoard().map((r) => [...r]);
    board[0][0] = 5;
    expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
  });

  it('throws on invalid value out of range', () => {
    expect(() => isValidPlacement(emptyBoard(), 0, 0, 10)).toThrow();
    expect(() => isValidPlacement(emptyBoard(), 0, 0, 0)).toThrow();
  });

  it('throws on invalid coordinates', () => {
    expect(() => isValidPlacement(emptyBoard(), -1, 0, 5)).toThrow();
    expect(() => isValidPlacement(emptyBoard(), 0, 9, 5)).toThrow();
  });
});

describe('isBoardValid', () => {
  it('returns true for empty board', () => {
    expect(isBoardValid(emptyBoard())).toBe(true);
  });

  it('returns true for partial valid board', () => {
    expect(isBoardValid(partialBoard)).toBe(true);
  });

  it('returns true for completed valid solution', () => {
    expect(isBoardValid(completedSolution)).toBe(true);
  });

  it('returns false when row has duplicate', () => {
    const bad = partialBoard.map((r) => [...r]);
    bad[0][2] = 5;
    expect(isBoardValid(bad)).toBe(false);
  });

  it('returns false when column has duplicate', () => {
    const bad = partialBoard.map((r) => [...r]);
    bad[2][0] = 5;
    expect(isBoardValid(bad)).toBe(false);
  });

  it('returns false when block has duplicate', () => {
    const bad = partialBoard.map((r) => [...r]);
    bad[1][1] = 5;
    expect(isBoardValid(bad)).toBe(false);
  });
});

describe('isBoardComplete', () => {
  it('returns false for board with empty cells', () => {
    expect(isBoardComplete(partialBoard)).toBe(false);
  });

  it('returns true for fully solved board', () => {
    expect(isBoardComplete(completedSolution)).toBe(true);
  });

  it('returns false for full but invalid board', () => {
    const bad = completedSolution.map((r) => [...r]);
    bad[0][0] = bad[0][1];
    expect(isBoardComplete(bad)).toBe(false);
  });
});

describe('findConflicts', () => {
  it('returns empty array for valid board', () => {
    expect(findConflicts(partialBoard)).toEqual([]);
  });

  it('finds duplicates in row', () => {
    const bad = emptyBoard().map((r) => [...r]);
    bad[0][0] = 5;
    bad[0][3] = 5;
    const conflicts = findConflicts(bad);
    expect(conflicts).toHaveLength(2);
    expect(conflicts).toContainEqual({ row: 0, col: 0 });
    expect(conflicts).toContainEqual({ row: 0, col: 3 });
  });

  it('finds duplicates across row and block', () => {
    const bad = emptyBoard().map((r) => [...r]);
    bad[0][0] = 5;
    bad[0][1] = 5;
    const conflicts = findConflicts(bad);
    expect(conflicts.length).toBeGreaterThanOrEqual(2);
  });
});
