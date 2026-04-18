import { useGameStore } from '../state/gameStore';
import { useBestTimesStore } from '../state/bestTimesStore';
import { formatElapsed } from '../utils/format';

export const BestTimeBadge = () => {
  const difficulty = useGameStore((s) => s.difficulty);
  const seed = useGameStore((s) => s.seed);
  const record = useBestTimesStore((s) => s.records[`${difficulty}:${seed}`]);
  if (!record) return null;
  return (
    <div className="best-time" data-testid="best-time">
      <span className="best-time__label">BEST</span>
      <span className="best-time__value">{formatElapsed(record.bestSeconds)}</span>
    </div>
  );
};
