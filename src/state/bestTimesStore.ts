import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  getBestTime,
  recordBestTime,
  type BestTimeRecord,
  type BestTimes,
} from '../utils/bestTimes';
import type { Difficulty } from '../utils/constants';

interface BestTimesState {
  records: BestTimes;
  recordTime: (difficulty: Difficulty, seed: number, seconds: number) => void;
  getRecord: (difficulty: Difficulty, seed: number) => BestTimeRecord | null;
  resetAll: () => void;
}

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const storage = isBrowser
  ? createJSONStorage(() => window.localStorage)
  : createJSONStorage(() => ({
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }));

export const useBestTimesStore = create<BestTimesState>()(
  persist(
    (set, get) => ({
      records: {},
      recordTime: (difficulty, seed, seconds) => {
        set({
          records: recordBestTime(
            get().records,
            difficulty,
            seed,
            seconds,
            Date.now(),
          ),
        });
      },
      getRecord: (difficulty, seed) =>
        getBestTime(get().records, difficulty, seed),
      resetAll: () => set({ records: {} }),
    }),
    {
      name: 'suudoku-best-times-v1',
      storage,
      partialize: (state) => ({ records: state.records }),
    },
  ),
);
