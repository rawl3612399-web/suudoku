import { describe, it, expect } from 'vitest';
import { countConfirmedDigits, isDigitFullyPlaced } from './digitCounts';
import { createBoardFromNumeric } from './immutable';
import type { NumericBoard } from '../domain/sudoku/types';

const empty: NumericBoard = Array.from({ length: 9 }, () =>
  Array.from({ length: 9 }, () => 0),
);

describe('countConfirmedDigits', () => {
  it('returns zero for empty board', () => {
    const counts = countConfirmedDigits(createBoardFromNumeric(empty));
    for (let n = 1; n <= 9; n++) expect(counts[n]).toBe(0);
  });

  it('counts fixed cells', () => {
    const numeric = empty.map((r) => [...r]);
    numeric[0][0] = 5;
    numeric[0][1] = 5;
    numeric[0][2] = 7;
    const counts = countConfirmedDigits(createBoardFromNumeric(numeric));
    expect(counts[5]).toBe(2);
    expect(counts[7]).toBe(1);
    expect(counts[1]).toBe(0);
  });

  it('counts user-input cells alongside fixed cells', () => {
    const numeric = empty.map((r) => [...r]);
    numeric[0][0] = 3;
    let board = createBoardFromNumeric(numeric);
    board = board.map((row, r) =>
      row.map((cell, c) => {
        if (r === 1 && c === 0) return { ...cell, value: 3 };
        return cell;
      }),
    );
    const counts = countConfirmedDigits(board);
    expect(counts[3]).toBe(2);
  });

  it('ignores notes', () => {
    let board = createBoardFromNumeric(empty);
    board = board.map((row, r) =>
      row.map((cell, c) => {
        if (r === 0 && c === 0) return { ...cell, notes: [4, 5, 6] };
        return cell;
      }),
    );
    const counts = countConfirmedDigits(board);
    expect(counts[4]).toBe(0);
    expect(counts[5]).toBe(0);
    expect(counts[6]).toBe(0);
  });

  it('returns 9 for fully completed digit', () => {
    const numeric = empty.map((r) => [...r]);
    for (let i = 0; i < 9; i++) numeric[i][i] = 9;
    const counts = countConfirmedDigits(createBoardFromNumeric(numeric));
    expect(counts[9]).toBe(9);
  });
});

describe('isDigitFullyPlaced', () => {
  it('returns false for incomplete digit', () => {
    expect(isDigitFullyPlaced({ 1: 5 } as Record<number, number>, 1)).toBe(false);
  });

  it('returns true when count reaches 9', () => {
    expect(isDigitFullyPlaced({ 1: 9 } as Record<number, number>, 1)).toBe(true);
  });

  it('returns false for missing digit', () => {
    expect(isDigitFullyPlaced({} as Record<number, number>, 1)).toBe(false);
  });
});
