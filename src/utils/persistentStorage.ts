export interface PersistResult {
  readonly supported: boolean;
  readonly granted: boolean;
}

export const requestPersistentStorage = async (): Promise<PersistResult> => {
  if (
    typeof navigator === 'undefined' ||
    !navigator.storage ||
    typeof navigator.storage.persist !== 'function'
  ) {
    return { supported: false, granted: false };
  }
  try {
    if (typeof navigator.storage.persisted === 'function') {
      const already = await navigator.storage.persisted();
      if (already) return { supported: true, granted: true };
    }
    const granted = await navigator.storage.persist();
    return { supported: true, granted };
  } catch {
    return { supported: true, granted: false };
  }
};
