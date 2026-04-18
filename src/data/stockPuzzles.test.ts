import { describe, it, expect } from 'vitest';
import { getAllStockPuzzles, getStockPuzzleList } from './stockPuzzles';
import { STOCK_SIZE } from '../utils/puzzleId';

describe('getStockPuzzleList', () => {
  it('returns 100 puzzles per difficulty', () => {
    expect(getStockPuzzleList('easy')).toHaveLength(STOCK_SIZE);
    expect(getStockPuzzleList('medium')).toHaveLength(STOCK_SIZE);
    expect(getStockPuzzleList('hard')).toHaveLength(STOCK_SIZE);
  });

  it('numbers are 1..100', () => {
    const list = getStockPuzzleList('easy');
    expect(list[0].number).toBe(1);
    expect(list[STOCK_SIZE - 1].number).toBe(STOCK_SIZE);
  });

  it('seeds are unique across all difficulties', () => {
    const all = getAllStockPuzzles();
    const seeds = new Set(all.map((p) => p.seed));
    expect(seeds.size).toBe(all.length);
  });
});
