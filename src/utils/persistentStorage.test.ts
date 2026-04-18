import { describe, it, expect, vi, afterEach } from 'vitest';
import { requestPersistentStorage } from './persistentStorage';

describe('requestPersistentStorage', () => {
  const originalStorage = navigator.storage;

  afterEach(() => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: originalStorage,
    });
  });

  it('returns supported=false when API missing', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: undefined,
    });
    const result = await requestPersistentStorage();
    expect(result.supported).toBe(false);
    expect(result.granted).toBe(false);
  });

  it('skips request when already persisted', async () => {
    const persist = vi.fn();
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        persisted: vi.fn().mockResolvedValue(true),
        persist,
      },
    });
    const result = await requestPersistentStorage();
    expect(result).toEqual({ supported: true, granted: true });
    expect(persist).not.toHaveBeenCalled();
  });

  it('requests persist when not yet persisted', async () => {
    const persist = vi.fn().mockResolvedValue(true);
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        persisted: vi.fn().mockResolvedValue(false),
        persist,
      },
    });
    const result = await requestPersistentStorage();
    expect(result).toEqual({ supported: true, granted: true });
    expect(persist).toHaveBeenCalled();
  });

  it('returns granted=false when persist is denied', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn().mockResolvedValue(false),
      },
    });
    const result = await requestPersistentStorage();
    expect(result.granted).toBe(false);
  });

  it('returns granted=false on thrown error', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn().mockRejectedValue(new Error('blocked')),
      },
    });
    const result = await requestPersistentStorage();
    expect(result).toEqual({ supported: true, granted: false });
  });
});
