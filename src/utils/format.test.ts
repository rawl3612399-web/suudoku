import { describe, it, expect } from 'vitest';
import { formatElapsed } from './format';

describe('formatElapsed', () => {
  it('formats zero as 00:00', () => {
    expect(formatElapsed(0)).toBe('00:00');
  });

  it('formats seconds under one minute', () => {
    expect(formatElapsed(42)).toBe('00:42');
  });

  it('formats minute boundary', () => {
    expect(formatElapsed(60)).toBe('01:00');
  });

  it('formats minutes and seconds', () => {
    expect(formatElapsed(125)).toBe('02:05');
  });

  it('formats long durations', () => {
    expect(formatElapsed(3725)).toBe('62:05');
  });

  it('clamps negative input to 00:00', () => {
    expect(formatElapsed(-5)).toBe('00:00');
  });

  it('floors fractional seconds', () => {
    expect(formatElapsed(42.9)).toBe('00:42');
  });
});
