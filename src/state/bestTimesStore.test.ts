import { describe, it, expect, beforeEach } from 'vitest';
import { useBestTimesStore } from './bestTimesStore';

describe('bestTimesStore', () => {
  beforeEach(() => {
    useBestTimesStore.getState().resetAll();
  });

  it('records a new time', () => {
    useBestTimesStore.getState().recordTime('easy', 100_001, 60);
    const r = useBestTimesStore.getState().getRecord('easy', 100_001);
    expect(r?.bestSeconds).toBe(60);
    expect(r?.attempts).toBe(1);
  });

  it('keeps the fastest across multiple recordings', () => {
    useBestTimesStore.getState().recordTime('easy', 100_001, 100);
    useBestTimesStore.getState().recordTime('easy', 100_001, 50);
    useBestTimesStore.getState().recordTime('easy', 100_001, 70);
    expect(
      useBestTimesStore.getState().getRecord('easy', 100_001)?.bestSeconds,
    ).toBe(50);
    expect(
      useBestTimesStore.getState().getRecord('easy', 100_001)?.attempts,
    ).toBe(3);
  });

  it('returns null for unrecorded puzzles', () => {
    expect(useBestTimesStore.getState().getRecord('hard', 999_999)).toBeNull();
  });
});
