import { useEffect, useState } from 'react';
import { useGameStore } from '../state/gameStore';

const TICK_MS = 1000;

export const useElapsedSeconds = (): number => {
  const status = useGameStore((s) => s.status);
  const startedAt = useGameStore((s) => s.startedAt);
  const completedAt = useGameStore((s) => s.completedAt);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (status !== 'playing') return;
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [status]);

  if (startedAt === null) return 0;
  const end = completedAt ?? Date.now();
  return Math.max(0, Math.floor((end - startedAt) / 1000));
};
