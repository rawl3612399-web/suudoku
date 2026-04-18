import { describe, it, expect } from 'vitest';
import {
  formatPuzzleId,
  isStockSeed,
  puzzleNumberToSeed,
  seedToPuzzleNumber,
  STOCK_SIZE,
} from './puzzleId';
import { encodeRoomCode } from './roomCode';

describe('puzzleNumberToSeed', () => {
  it('maps easy puzzles starting at offset 100000', () => {
    expect(puzzleNumberToSeed('easy', 1)).toBe(100_001);
    expect(puzzleNumberToSeed('easy', 100)).toBe(100_100);
  });

  it('maps medium puzzles starting at offset 200000', () => {
    expect(puzzleNumberToSeed('medium', 42)).toBe(200_042);
  });

  it('maps hard puzzles starting at offset 300000', () => {
    expect(puzzleNumberToSeed('hard', 100)).toBe(300_100);
  });

  it('throws on out-of-range number', () => {
    expect(() => puzzleNumberToSeed('easy', 0)).toThrow();
    expect(() => puzzleNumberToSeed('easy', 101)).toThrow();
    expect(() => puzzleNumberToSeed('easy', 1.5)).toThrow();
  });
});

describe('seedToPuzzleNumber', () => {
  it('inverts puzzleNumberToSeed', () => {
    expect(seedToPuzzleNumber('easy', 100_042)).toBe(42);
    expect(seedToPuzzleNumber('medium', 200_001)).toBe(1);
    expect(seedToPuzzleNumber('hard', 300_100)).toBe(100);
  });

  it('returns null for non-stock seeds', () => {
    expect(seedToPuzzleNumber('easy', 999)).toBeNull();
    expect(seedToPuzzleNumber('easy', 200_001)).toBeNull();
  });
});

describe('isStockSeed', () => {
  it('detects stock seeds', () => {
    expect(isStockSeed('easy', 100_001)).toBe(true);
    expect(isStockSeed('easy', 999)).toBe(false);
  });
});

describe('formatPuzzleId', () => {
  it('formats with zero-padded number', () => {
    expect(formatPuzzleId('easy', 1)).toBe('初級 #001');
    expect(formatPuzzleId('medium', 42)).toBe('中級 #042');
    expect(formatPuzzleId('hard', 100)).toBe('上級 #100');
  });
});

describe('integration: STOCK_SIZE puzzles round-trip with roomCode', () => {
  it('all 100 easy puzzles encode to E-1000xx room codes', () => {
    for (let n = 1; n <= STOCK_SIZE; n++) {
      const seed = puzzleNumberToSeed('easy', n);
      const code = encodeRoomCode('easy', seed);
      expect(code).toMatch(/^E-\d{6}$/);
      expect(seedToPuzzleNumber('easy', seed)).toBe(n);
    }
  });
});
