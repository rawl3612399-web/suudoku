import { describe, it, expect } from 'vitest';
import {
  decodeRoomCode,
  encodeRoomCode,
  generateSeed,
} from './roomCode';

describe('encodeRoomCode', () => {
  it('produces prefix + 6-digit seed', () => {
    expect(encodeRoomCode('easy', 123456)).toBe('E-123456');
    expect(encodeRoomCode('medium', 999999)).toBe('M-999999');
    expect(encodeRoomCode('hard', 100000)).toBe('H-100000');
  });

  it('pads short seeds with zeros', () => {
    expect(encodeRoomCode('easy', 42)).toBe('E-000042');
  });

  it('truncates seeds longer than 6 digits to last 6', () => {
    expect(encodeRoomCode('easy', 1234567)).toBe('E-234567');
  });
});

describe('decodeRoomCode', () => {
  it('decodes a canonical code', () => {
    expect(decodeRoomCode('E-123456')).toEqual({
      difficulty: 'easy',
      seed: 123456,
    });
  });

  it('accepts lowercase and mixed case', () => {
    expect(decodeRoomCode('m-000042')).toEqual({
      difficulty: 'medium',
      seed: 42,
    });
  });

  it('accepts code without separators', () => {
    expect(decodeRoomCode('H123456')).toEqual({
      difficulty: 'hard',
      seed: 123456,
    });
  });

  it('returns null for invalid codes', () => {
    expect(decodeRoomCode('X-123456')).toBeNull();
    expect(decodeRoomCode('E-12345')).toBeNull();
    expect(decodeRoomCode('garbage')).toBeNull();
    expect(decodeRoomCode('')).toBeNull();
  });

  it('roundtrips encode → decode', () => {
    const code = encodeRoomCode('hard', 567890);
    expect(decodeRoomCode(code)).toEqual({ difficulty: 'hard', seed: 567890 });
  });
});

describe('generateSeed', () => {
  it('produces a 6-digit number', () => {
    for (let i = 0; i < 50; i++) {
      const seed = generateSeed();
      expect(seed).toBeGreaterThanOrEqual(100_000);
      expect(seed).toBeLessThanOrEqual(999_999);
    }
  });
});
