import { describe, it, expect } from 'vitest';
import { generatePuzzle } from './generator';
import { solve, countSolutions } from './solver';
import { isBoardComplete, isBoardValid } from './validator';
import { BOARD_SIZE, EMPTY_CELLS_BY_DIFFICULTY } from '../../utils/constants';

const countEmpty = (board: ReadonlyArray<ReadonlyArray<number>>): number => {
  let n = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) n++;
    }
  }
  return n;
};

describe('generatePuzzle', () => {
  it('produces a valid puzzle for easy difficulty', () => {
    const { puzzle, solution } = generatePuzzle('easy', 42);
    expect(isBoardValid(puzzle)).toBe(true);
    expect(isBoardComplete(solution)).toBe(true);
  });

  it('puzzle has the configured number of empty cells (within tolerance)', () => {
    const { puzzle } = generatePuzzle('easy', 42);
    expect(countEmpty(puzzle)).toBe(EMPTY_CELLS_BY_DIFFICULTY.easy);
  });

  it('puzzle has unique solution', () => {
    const { puzzle } = generatePuzzle('easy', 42);
    expect(countSolutions(puzzle, 2)).toBe(1);
  });

  it('puzzle solves to the provided solution', () => {
    const { puzzle, solution } = generatePuzzle('easy', 42);
    const solved = solve(puzzle);
    expect(solved).toEqual(solution);
  });

  it('produces different puzzles for different seeds', () => {
    const a = generatePuzzle('easy', 1);
    const b = generatePuzzle('easy', 2);
    expect(a.puzzle).not.toEqual(b.puzzle);
  });

  it('produces same puzzle for same seed (deterministic)', () => {
    const a = generatePuzzle('medium', 99);
    const b = generatePuzzle('medium', 99);
    expect(a.puzzle).toEqual(b.puzzle);
    expect(a.solution).toEqual(b.solution);
  });

  it('respects difficulty: harder = more empty cells', () => {
    const easy = generatePuzzle('easy', 7);
    const hard = generatePuzzle('hard', 7);
    expect(countEmpty(hard.puzzle)).toBeGreaterThan(countEmpty(easy.puzzle));
  });
});
