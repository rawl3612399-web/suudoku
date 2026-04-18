import { describe, it, expect } from 'vitest';
import { solve, countSolutions } from './solver';
import { isBoardComplete } from './validator';
import type { NumericBoard } from './types';

const fromRows = (rows: string[]): NumericBoard =>
  rows.map((r) => r.split('').map((c) => (c === '.' ? 0 : Number(c))));

const easyPuzzle = fromRows([
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

const expectedSolution = fromRows([
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

describe('solve', () => {
  it('returns a complete valid solution for a solvable puzzle', () => {
    const result = solve(easyPuzzle);
    expect(result).not.toBeNull();
    expect(isBoardComplete(result!)).toBe(true);
  });

  it('matches the expected solution for known puzzle', () => {
    const result = solve(easyPuzzle);
    expect(result).toEqual(expectedSolution);
  });

  it('returns null for unsolvable puzzle', () => {
    const unsolvable = fromRows([
      '55.......',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
    ]);
    expect(solve(unsolvable)).toBeNull();
  });

  it('does not mutate the input board', () => {
    const snapshot = easyPuzzle.map((r) => [...r]);
    solve(easyPuzzle);
    expect(easyPuzzle).toEqual(snapshot);
  });

  it('returns the board itself when already complete', () => {
    const result = solve(expectedSolution);
    expect(result).toEqual(expectedSolution);
  });
});

describe('countSolutions', () => {
  it('returns 1 for puzzle with unique solution', () => {
    expect(countSolutions(easyPuzzle, 2)).toBe(1);
  });

  it('returns 0 for unsolvable puzzle', () => {
    const unsolvable = fromRows([
      '55.......',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
    ]);
    expect(countSolutions(unsolvable, 2)).toBe(0);
  });

  it('stops counting after limit (returns at least 2 for ambiguous)', () => {
    const empty: NumericBoard = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 0),
    );
    expect(countSolutions(empty, 2)).toBeGreaterThanOrEqual(2);
  });
});
