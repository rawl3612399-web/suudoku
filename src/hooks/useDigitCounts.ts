import { useMemo } from 'react';
import { useGameStore } from '../state/gameStore';
import { countConfirmedDigits, type DigitCounts } from '../utils/digitCounts';

export const useDigitCounts = (): DigitCounts => {
  const board = useGameStore((s) => s.board);
  return useMemo(() => countConfirmedDigits(board), [board]);
};
