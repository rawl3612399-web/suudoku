import { describe, it, expect } from 'vitest';
import {
  getBestTime,
  makePuzzleKey,
  recordBestTime,
  type BestTimes,
} from './bestTimes';

describe('makePuzzleKey', () => {
  it('combines difficulty and seed', () => {
    expect(makePuzzleKey('easy', 100_001)).toBe('easy:100001');
    expect(makePuzzleKey('hard', 300_100)).toBe('hard:300100');
  });
});

describe('recordBestTime', () => {
  it('inserts a new record on first solve', () => {
    const records = recordBestTime({}, 'easy', 100_001, 120, 1_000);
    expect(records['easy:100001']).toEqual({
      bestSeconds: 120,
      achievedAt: 1_000,
      attempts: 1,
    });
  });

  it('updates when faster', () => {
    let records: BestTimes = {};
    records = recordBestTime(records, 'easy', 100_001, 120, 1_000);
    records = recordBestTime(records, 'easy', 100_001, 90, 2_000);
    expect(records['easy:100001'].bestSeconds).toBe(90);
    expect(records['easy:100001'].achievedAt).toBe(2_000);
    expect(records['easy:100001'].attempts).toBe(2);
  });

  it('keeps best when slower but increments attempts', () => {
    let records: BestTimes = {};
    records = recordBestTime(records, 'easy', 100_001, 90, 1_000);
    records = recordBestTime(records, 'easy', 100_001, 200, 2_000);
    expect(records['easy:100001'].bestSeconds).toBe(90);
    expect(records['easy:100001'].achievedAt).toBe(1_000);
    expect(records['easy:100001'].attempts).toBe(2);
  });

  it('keeps records of different puzzles independently', () => {
    let records: BestTimes = {};
    records = recordBestTime(records, 'easy', 100_001, 90, 1_000);
    records = recordBestTime(records, 'hard', 300_100, 600, 2_000);
    expect(records['easy:100001'].bestSeconds).toBe(90);
    expect(records['hard:300100'].bestSeconds).toBe(600);
  });

  it('returns same records when seconds invalid', () => {
    const before: BestTimes = {};
    const after = recordBestTime(before, 'easy', 1, NaN, 0);
    expect(after).toBe(before);
  });

  it('produces a new object reference (immutable)', () => {
    const before: BestTimes = {};
    const after = recordBestTime(before, 'easy', 1, 10, 0);
    expect(after).not.toBe(before);
  });
});

describe('getBestTime', () => {
  it('returns null for missing record', () => {
    expect(getBestTime({}, 'easy', 1)).toBeNull();
  });

  it('returns the record when present', () => {
    const records = recordBestTime({}, 'easy', 1, 30, 100);
    expect(getBestTime(records, 'easy', 1)?.bestSeconds).toBe(30);
  });
});
